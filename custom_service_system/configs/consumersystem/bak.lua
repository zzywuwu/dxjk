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

function CreateUndistributed()
	return coroutine.create(function ()
        while true do
        --print("Undistributed")
        	local kfs = GetOnlineChannel()
            if next(kfs)  == nil then
                DEBUG("No Channel online")
            else
        	    for k, v in pairs(kfs) do
                    --有channel不一定正好有客服监听，需要判断subscribers是否为0
                    if v["subscribers"] ~= "0" then
                	    local id = QueryUndistributed(v["channel"], "self")
                        if not id then
                            id = QueryUndistributed(v["channel"], "default")
                        end
                        if not id then    	
                            DEBUG("No Order need to Distribute")
                            break;
                        end
                        PushMessage(v["channel"], id)
                    end
                end
            end
            coroutine.yield()
        end
	end)
end
function CreateDistributed()
	return coroutine.create(function ()
		while true do
            --print("distributed")
			local res = SetOrderToUndistributed("KF_VIEW_DISTRIBUTED", 60)
			coroutine.yield()
		end
	end)
end
function CreateProcessing()
	return coroutine.create(function ()
		while true do
            --print("processing")
			local res = SetOrderToUndistributed("KF_VIEW_PROCESSING", 60)
			coroutine.yield()
		end
	end)
end
function CreateProcessed()
	return coroutine.create(function ()
		while true do
            --print("Processed")
			local res = SetOrderToDone(60*60*24*7)
			coroutine.yield()
		end
	end)
end
	
function GetOnlineChannel()
	local res, code = http.request("http://127.0.0.1:9080/channels-stats?id=ALL")
    --[[ 调用接口返回的json格式，
        {"hostname": "localhost.localdomain", "time": "2015-11-05T08:42:53", "channels": "2", "wildcard_channels": "0", "uptime": "85101", 
        "infos": [
                    {"channel": "kf1", "published_messages": "0", "stored_messages": "0", "subscribers": "1"},
                    {"channel": "kf2", "published_messages": "0", "stored_messages": "0", "subscribers": "1"}
        ]}
    ]]
    if code ~= 200 then
        local empty_tbl = {}
        WARN("Can not query channels,pls check nginx push channel config")
        return empty_tbl
    end
	local content = cjson.decode(res)
	return content["infos"]
end

function QueryUndistributed(kf_name, option)
	local str_sql = nil
	if option == "self" then
		str_sql = "select id from KF_VIEW_UNDISTRIBUTED where kf_id=(select id from KF_SYS_USR where name='"..kf_name.."')order by update_time limit 1"
	elseif option == "default" then
		str_sql = "select id from KF_VIEW_UNDISTRIBUTED where kf_id=0 order by update_time limit 1"
	end	
    DEBUG("Execute Sql: "..str_sql)
	local cur,err = conn:execute(str_sql)
    if not cur then
        ERROR("Disconnect with Mysql,need to reconnect...")
        ConnectMysql()
        return nil
    end
	local row = cur:fetch({}, "a")
	return row;
end

function PushMessage(kf_account, order_id)
    local str_sql = "update KF_VIEW_UNDISTRIBUTED set update_time = NOW(),status='distributed' where id ="..order_id["id"]
    DEBUG("Execute Sql: "..str_sql)
	local cur, err = conn:execute(str_sql)
    if not cur then
        ERROR("Disconnect with Mysql,need to reconnect...")
        ConnectMysql()
        return nil
    end

    local post_data = order_id["id"]

	local res, code = http.request{  
	    url = "http://127.0.0.1:9080/pub?id="..kf_account,
		method = "POST",
		headers =   
		{  
			["Content-Type"] = "application/x-www-form-urlencoded",  
			["Content-Length"] = #post_data,  
		},
		source = ltn12.source.string(post_data) 
	}  
    if code ~= 200 then
        ERROR("Can not Push Message please check nginx push config")
    end
    DEBUG("Push Message To "..kf_account.." With "..post_data)
end

function SetOrderToUndistributed(table_name, time_out)
    local str_sql = "select id from ".. table_name.." where UNIX_TIMESTAMP(update_time) + "..time_out.." < UNIX_TIMESTAMP(now())"
    DEBUG("Execute Sql: "..str_sql)
	local cur, err = conn:execute(str_sql)
    if not cur then
        ERROR("Disconnect with Mysql,need to reconnect...")
        ConnectMysql()
        return nil
    end
	local row = cur:fetch({}, "a")
	if not row then
		return nil
	else 
        while row do
            str_sql = "update "..table_name.." set update_time = NOW(),status = 'undistributed' where id ="..row["id"]
            DEBUG("Execute Sql: "..str_sql)
            row = cur:fetch(row, "a")
	        local cur, err = conn:execute(str_sql)
            if not cur then
                ERROR("Disconnect with Mysql,need to reconnect...")
                ConnectMysql()
                return nil
            end
        end
	end
end

function SetOrderToDone(time_out)
    local str_sql = "select id from KF_VIEW_PROCESSED where UNIX_TIMESTAMP(update_time) + "..time_out.." < UNIX_TIMESTAMP(now())"
    DEBUG("Execute Sql: "..str_sql)
	local cur, err = conn:execute(str_sql)
    if not cur then
        ERROR("Disconnect with Mysql,need to reconnect...")
        ConnectMysql()
        return nil
    end
	local row = cur:fetch({}, "a")
	if not row then
		return nil
	else 
        while row do
            str_sql = "update KF_SYS_ORDER set update_time = NOW(),status = 'done',feedback=11 ".."where id="..row["id"]
            DEBUG("Execute Sql: "..str_sql)
            row = cur:fetch(row, "a")
	        local cur = conn:execute(str_sql)
            if not cur then
                ERROR("Disconnect with Mysql,need to reconnect...")
                ConnectMysql()
                return nil
            end
        end
	end
end

DEBUGINIT("consumersystem.log", 1)
local res = ConnectMysql()
local co_undistributed = CreateUndistributed()
local co_distributed = CreateDistributed()
local co_processing = CreateProcessing()
local co_processed = CreateProcessed()
while true do
	coroutine.resume(co_undistributed)
	coroutine.resume(co_distributed)
	coroutine.resume(co_processing)
	coroutine.resume(co_processed)
    
    if coroutine.status(co_undistributed) ~= "suspended" then
        ERROR("co_undistributed dead need to restart")
        co_undistributed = CreateUndistributed()
    end
    if coroutine.status(co_distributed) ~= "suspended" then
        ERROR("co_distributed dead need to restart")
        co_distributed = CreateDistributed()
    end
    if coroutine.status(co_processing) ~= "suspended" then
        ERROR("co_processing dead need to restart")
        co_processing = CreateProcessing()
    end
    if coroutine.status(co_processed) ~= "suspended" then
        ERROR("co_processed dead need to restart")
        co_processed = CreateProcessed()
    end
    
--	os.execute("sleep " .. 5)
    socket.select(nil, nil, 2)
end
