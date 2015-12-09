package.path = package.path..";/usr/lib64/lua/5.1/?.lua;/opt/nginx/lua_scripts/?.lua;/usr/local/share/lua/5.1/?.lua"
package.cpath = package.cpath..";/usr/lib64/lua/5.1/?.so;/usr/local/lib/lua/5.1/?.so;/usr/local/share/lua/5.1/?.so"
require "kf_debug"
local mysql = require "luasql.mysql"
local http = require "socket.http"
local cjson = require "cjson"
local cjson_safe = require "cjson.safe"

local mysql_conn = nil
local message_agentid = 4  -- 孕妈妈信息频道

function GetPartyID()
    -- 通讯录"内部"的partyid
    return 3    
end

function ConnectMysql()
	local env = mysql.mysql()
    while not mysql_conn do
	    mysql_conn = env:connect('dtjx', 'root', '', '127.0.0.1', 3306)
        if not mysql_conn then
            ERROR("Can not connect to Mysql")
        end
        local cur,err = mysql_conn:execute("set names utf8")
        if not cur then
            ERROR("set names utf8 failed...")
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
         io.close(t)
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

function PushMessage(current_time,info,user)
    while true do
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
        local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="..GetToken().."\" -d \"{\\\"touser\\\":\\\""..user_str.."\\\",\\\"toparty\\\":\\\"\\\",\\\"totag\\\":\\\"\\\",\\\"msgtype\\\":\\\"text\\\",\\\"agentid\\\":"..message_agentid..",\\\"text\\\":{\\\"content\\\":\\\""..info.."\\\"},\\\"safe\\\":\\\"0\\\"}\"" 
        local t = io.popen(cmd)
        local res = t:read("*all")
        io.close(t)
        local content = cjson_safe.decode(res)
        if (content == nil) then
            ERROR("["..current_time.hour..":"..current_time.min..":"..current_time.sec.."] [单发] "..info.." res = "..res ) 
        else
            -- INFO("errcode= "..content["errcode"]..", errmsg = "..content["errmsg"])
            INFO("["..current_time.hour..":"..current_time.min..":"..current_time.sec.."] [单发] "..info)
            break
        end
     end
end

function PushGroupMessage(current_time,info,partyid)
    while true do
        local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="..GetToken().."\" -d \"{\\\"touser\\\": \\\"\\\",\\\"toparty\\\": \\\""..partyid.."\\\",\\\"totag\\\": \\\"\\\",\\\"msgtype\\\": \\\"text\\\",\\\"agentid\\\":"..message_agentid..",\\\"text\\\": {\\\"content\\\":\\\""..info.."\\\"},\\\"safe\\\":\\\"0\\\"}\"" 
        local t = io.popen(cmd)
        local res = t:read("*all")
         io.close(t)
        local content = cjson_safe.decode(res)
        if (content == nil) then
            ERROR("["..current_time.hour..":"..current_time.min..":"..current_time.sec.."] [群发] "..info.." res = "..res ) 
        else
            -- INFO("errcode= "..content["errcode"]..", errmsg = "..content["errmsg"])
            INFO("["..current_time.hour..":"..current_time.min..":"..current_time.sec.."] [群发] "..info)
            break
        end
    end
end

function GetSecondDayInfo()

    tab = os.date("*t",os.time()+86400);
    after = os.date("*t",os.time()+86400*2);
    tommorow_start = string.format("%s-%s-%s 00:00:00",tab.year,tab.month,tab.day)
    tommorow_end = string.format("%s-%s-%s 00:00:00",after.year,after.month,after.day)
    tommorow = string.format("%s-%s-%s",tab.year,tab.month,tab.day)
    tommorowday = tonumber(os.date("%w",os.time()+86400))

    local info = "明天 ("..tommorow.." 星期"

    if tommorowday == 0 then
        info = info .. "天) 工作内容:"
    elseif tommorowday == 1 then
        info = info .. "一) 工作内容:"
    elseif tommorowday == 2 then
        info = info .. "二) 工作内容:"
    elseif tommorowday == 3 then
        info = info .. "三) 工作内容:"
    elseif tommorowday == 4 then
        info = info .. "四) 工作内容:"
    elseif tommorowday == 5 then
        info = info .. "五) 工作内容:"
    elseif tommorowday == 6 then
        info = info .. "六) 工作内容:"
    end
 
    local str_sql = "select record.*,customer.name as customer_name from record,customer where (customer.id = record.customer_id and customer.vip < 2 and record.visit_date >= '"..tommorow_start.."' and record.visit_date < '"..tommorow_end.."' and record.status = 0) order by record.visit_time asc"
    INFO("str_sql: "..str_sql)
    local cur,err = mysql_conn:execute(str_sql)
    if not cur then
        ERROR("Disconnect with Mysql,need to reconnect...")
        ConnectMysql()
        return nil
    end

    local row = cur:fetch({}, "a")
    if not row then
        info = info .. " 无"
    else
        info = info .. "\n"
        while row do
            local str = string.format("%-10s %s ",row["customer_name"],row["visit_time"])
            if tonumber(row["order_success"]) == 1 then
                -- ..string.sub(row["visit_date"],1,10)
                str = str .. "(已预约) "..row["visit_type"].." "..row["remarks"].."\n\n"
            else
                str = str .. "(未预约) "..row["visit_type"].." "..row["remarks"].."\n\n"
            end
            info = info .. str
            row = cur:fetch({},"a")
            if(row == nil) then 
                break 
            end
        end  
    end
    cur:close()
    -- INFO(info)
    return true,info
end

function NotifySecondDay()
    local current_time = os.date("*t")
    local t = os.time() 
    second_day_last_send = second_day_last_send or 0;
    if (current_time.hour == 12 and current_time.min == 0 and ((t-second_day_last_send)>1000)) then
        local err,info = GetSecondDayInfo()
        if not err then
            ERROR("GetSecondEventInfo failed!")
            return
        end 
        PushGroupMessage(current_time,info,GetPartyID())
        second_day_last_send = os.time()
    -- elseif ((t-second_day_last_send)>1000) then
    --     local err,info = GetSecondDayInfo()
    --     if not err then
    --          ERROR("GetSecondEventInfo failed!")
    --          return
    --     end
    --     local user = {"zhaoyu"}     
    --     PushMessage(current_time,info,user)
    --     second_day_last_send = os.time()  
    end
end

function TestPushPersonal()
    local info = "尊敬的客户：  你好！\\n\\n        今日"..os.date(os.date("%Y-%m-%d").."上午8点，已为你预约医生(张力)，请你于7点30分到达医院后联系客户专员(陈淘15198073537)。\\n\\n        祝你有美好的一天！")
    local user = {"zhaoyu"}
    -- local user = {"zhaoyu","wangjun"}
    -- local user = {"zhaoyu","wangjun","zhanghongli","chentao","liruixue"}
    PushMessage(info,user) 
end

function CreateMainLoop()
    return coroutine.create(function ()
        while true do
            GetToken()
            NotifySecondDay()
            -- TestPushPersonal()
            coroutine.yield()
        end
    end)
end
	
function main()
    DEBUGINIT("wx.log", 1)
    local res = ConnectMysql()
    local co_main_loop = CreateMainLoop()

    while true do
    	coroutine.resume(co_main_loop)
        if coroutine.status(co_main_loop) ~= "suspended" then
            ERROR("co_main_loop dead need to restart")
            co_main_loop = CreateMainLoop()
        end
        socket.select(nil, nil, 10)
    end
end

main()
