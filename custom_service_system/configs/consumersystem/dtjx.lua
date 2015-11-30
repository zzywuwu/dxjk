package.path = package.path..";/usr/lib64/lua/5.1/?.lua;/opt/nginx/lua_scripts/?.lua"
package.cpath = package.cpath..";/usr/lib64/lua/5.1/?.so"
require "kf_debug"
local mysql = require "luasql.mysql"
local http = require "socket.http"
local cjson = require "cjson"
local cjson_safe = require "cjson.safe"

local conn = nil

function ConnectMysql()
	local env = mysql.mysql()
    while not conn do
	    conn = env:connect('cloud', 'root', 'server', '127.0.0.1', 3306)
        if not conn then
            ERROR("Can not connect to Mysql")
        end
	    os.execute("sleep " .. 1)
	end
    INFO("Connet to Mysql successful")
end

function GetTokenFromServer() 
    while true do
        --os.execute("curl -v https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx755e6479b3b52da5&corpsecret=gJqLx9cY77lfgEZr5VRh7ptsSsoWm_B8rlsDMHZrCkbxorkFWC4KAZOUnLBXuW3n")
        local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx755e6479b3b52da5&corpsecret=gJqLx9cY77lfgEZr5VRh7ptsSsoWm_B8rlsDMHZrCkbxorkFWC4KAZOUnLBXuW3n\"" 
        local t = io.popen(cmd)
        local res = t:read("*all")
        INFO(res)
        local content = cjson.decode(res)
        INFO("Get Token Success, Date = "..os.date()..", access_token = "..content["access_token"])
        return content["access_token"]
    end
end

function GetToken()
    time = time or 0
    token = token or ""
    INFO("time = "..time.." token = "..token)
    difftime = os.time()-time
    if (time and (difftime<7000)) then
        INFO("Token expires_in time "..difftime)
    else 
        token = GetTokenFromServer()
        time = os.time()
    end
    return token
end

function CreateUndistributed()
	return coroutine.create(function ()
        while true do
            local i = 0
            INFO("Run Loop")
        	GetToken()
            PushMessage("美女")
            i = i + 1
            coroutine.yield()
        end
	end)
end

function PushMessage(info)
    local cmd = "curl -v \"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="..token.."\" -d \"{\\\"touser\\\": \\\"zhaoyu\\\",\\\"toparty\\\": \\\"3\\\",\\\"totag\\\": \\\"\\\",\\\"msgtype\\\": \\\"text\\\",\\\"agentid\\\":4,\\\"text\\\": {\\\"content\\\":\\\""..info.."\\\"},\\\"safe\\\":\\\"0\\\"}\"" 
    INFO(cmd)
    local t = io.popen(cmd)
    local res = t:read("*all")
    INFO(res)
    --local content = cjson.decode(res)
    --INFO("Get Token Success, Date = "..os.date()..", access_token = "..content["access_token"])
end
	
-- function PushMessage(kf_account, order_id)
--     local str_sql = "update KF_VIEW_UNDISTRIBUTED set update_time = NOW(),status='distributed' where id ="..order_id["id"]
--     DEBUG("Execute Sql: "..str_sql)
-- 	local cur, err = conn:execute(str_sql)
--     if not cur then
--         ERROR("Disconnect with Mysql,need to reconnect...")
--         ConnectMysql()
--         return nil
--     end

--     local post_data = order_id["id"]

-- 	local res, code = http.request{  
-- 	    url = "http://127.0.0.1:9080/pub?id="..kf_account,
-- 		method = "POST",
-- 		headers =   
-- 		{  
-- 			["Content-Type"] = "application/x-www-form-urlencoded",  
-- 			["Content-Length"] = #post_data,  
-- 		},
-- 		source = ltn12.source.string(post_data) 
-- 	}  
--     if code ~= 200 then
--         ERROR("Can not Push Message please check nginx push config")
--     end
--     DEBUG("Push Message To "..kf_account.." With "..post_data)
-- end

DEBUGINIT("dtjx.log", 1)
local res = ConnectMysql()
local co_undistributed = CreateUndistributed()

while true do
	coroutine.resume(co_undistributed)
    if coroutine.status(co_undistributed) ~= "suspended" then
        ERROR("co_undistributed dead need to restart")
        co_undistributed = CreateUndistributed()
    end
    socket.select(nil, nil, 30)
end
