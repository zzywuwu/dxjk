package.path = package.path..";/usr/lib64/lua/5.1/?.lua;/opt/nginx/lua_scripts/?.lua"
package.cpath = package.cpath..";/usr/lib64/lua/5.1/?.so;/usr/local/lib/lua/5.1/?.so"
require "kf_debug"
local mysql = require "luasql.mysql"
local http = require "socket.http"
local cjson = require "cjson"
local cjson_safe = require "cjson.safe"

local mysql_conn = nil
local message_agentid = 4  -- 孕妈妈信息

function ConnectMysql()
	local env = mysql.mysql()
    while not conn do
	    mysql_conn = env:connect('cloud', 'root', '', '127.0.0.1', 3306)
        if not mysql_conn then
            ERROR("Can not connect to Mysql")
        end
	    socket.select(nil, nil, 1)
	end
    INFO("Connet to Mysql successful")
end

function GetTokenFromServer() 
    while true do
        local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx755e6479b3b52da5&corpsecret=gJqLx9cY77lfgEZr5VRh7ptsSsoWm_B8rlsDMHZrCkbxorkFWC4KAZOUnLBXuW3n\"" 
        local t = io.popen(cmd)
        local res = t:read("*all")
        local content = cjson_safe.decode(res)
        if (content == nil) then
            ERROR("GetTokenFromServer() failed! res = "..res)
            socket.select(nil, nil, 1)
        else
            INFO("Get Token Success, Date = "..os.date()..", access_token = "..content["access_token"])
            return content["access_token"]
        end
    end
end

function GetToken()
    time = time or 0
    token = token or ""
    difftime = os.time()-time
    if not (time and (difftime < 7000)) then
        token = GetTokenFromServer()
        time = os.time()
    end
    return token
end

function PushMessage(info,user)
    local user_str = ""
    local first = false
    for i=1, #(user) do
        if first == false then
            user_str = user_str..user[i]
            first = true
        else
            user_str = user_str.."|"..user[i]
        end
    end
    INFO("user_str = "..user_str)
    local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="..token.."\" -d \"{\\\"touser\\\":\\\""..user_str.."\\\",\\\"toparty\\\":\\\"\\\",\\\"totag\\\":\\\"\\\",\\\"msgtype\\\":\\\"text\\\",\\\"agentid\\\":"..message_agentid..",\\\"text\\\":{\\\"content\\\":\\\""..info.."\\\"},\\\"safe\\\":\\\"0\\\"}\"" 
    local t = io.popen(cmd)
    local res = t:read("*all")
    local content = cjson_safe.decode(res)
    if (content == nil) then
        ERROR("PushMessage() failed! cmd = "..cmd.." res = "..res)
    else
        INFO(cmd)
        INFO("errcode= "..content["errcode"]..", errmsg = "..content["errmsg"])
    end
end

function PushGroupMessage(info,partyid)
    local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="..token.."\" -d \"{\\\"touser\\\": \\\"\\\",\\\"toparty\\\": \\\""..partyid.."\\\",\\\"totag\\\": \\\"\\\",\\\"msgtype\\\": \\\"text\\\",\\\"agentid\\\":"..message_agentid..",\\\"text\\\": {\\\"content\\\":\\\""..info.."\\\"},\\\"safe\\\":\\\"0\\\"}\"" 
    local t = io.popen(cmd)
    local res = t:read("*all")
    local content = cjson_safe.decode(res)
    if (content == nil) then
        ERROR("PushGroupMessage() failed! cmd = "..cmd.." res = "..res)
    else
        INFO(cmd)
        INFO("errcode= "..content["errcode"]..", errmsg = "..content["errmsg"])
    end
end

function NotifySecondDay()

    function GetPartyID()
        return 3
    end

    local current_time = os.date("*t")
    INFO("current hour "..current_time.hour.." current_time.min .."..current_time.min)
    if (current_time.hour == 20 and current_time.min == 0) then
        PushGroupMessage("测试群发消息!",GetPartyID())        
        socket.select(nil, nil, 61)     
    end
end

function NotifyEvent()
    local event_str = "尊敬的客户：  你好！\\n\\n        今日"..os.date(os.date("%Y-%m-%d").."上午8点，已为你预约医生(张力)，请你于7点30分到达医院后联系客户专员(陈淘15198073537)。\\n\\n        祝你有美好的一天！")
    local user = {"zhaoyu"}
    -- local user = {"zhaoyu","wangjun"}
    -- local user = {"zhaoyu","wangjun","zhanghongli","chentao","liruixue"}
    PushMessage(event_str,user)
    socket.select(nil, nil, 61)
end

function CreateMainLoop()
    return coroutine.create(function ()
        while true do
            -- INFO("Run Main Loop")
            GetToken()
            -- NotifySecondDay()
            NotifyEvent()
            coroutine.yield()
        end
    end)
end
	
function main()
    DEBUGINIT("dtjx.log", 1)
    local res = ConnectMysql()
    local co_main_loop = CreateMainLoop()

    while true do
    	coroutine.resume(co_main_loop)
        if coroutine.status(co_main_loop) ~= "suspended" then
            ERROR("co_main_loop dead need to restart")
            co_main_loop = CreateMainLoop()
        end
        socket.select(nil, nil, 2)
    end
end

main()
