local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MYSQL_QUERY_FAIL
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.session.name then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.title and post.web.start_time 
			and post.web.end_time and post.web.zhcn_msg
			and post.web.en_msg and post.web.zhtw_msg) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _title = post.web.title
	local _start_time = post.web.start_time
	local _end_time = post.web.end_time
	local _zhcn_msg = post.web.zhcn_msg
	local _en_msg = post.web.en_msg
	local _zhtw_msg = post.web.zhtw_msg

	local _query_sql = "insert into market_upgrade_message(type,title,start_time,end_time,zhcn_msg,en_msg,zhtw_msg) value(0," 
			.. ngx.quote_sql_str(_title) .. ",".. ngx.quote_sql_str(_start_time) .. "," 
			.. ngx.quote_sql_str(_end_time) .. "," .. ngx.quote_sql_str(_zhcn_msg) .. ","
			.. ngx.quote_sql_str(_en_msg) .. "," .. ngx.quote_sql_str(_zhtw_msg) .. ")" 

	INFO("add advertisement title:" .. _title)
	local _res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback)
	if _err == WEBERR.KEY_ALREADY_EXIST then
		_err = WEBERR.MESSAGE_ALREADY_EXIST
	end
	return _res,_err
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
