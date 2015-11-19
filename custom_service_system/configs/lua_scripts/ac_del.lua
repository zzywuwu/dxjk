local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.USER_NO_EXIST
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not post.web.name then
		return false, WEBERR.PARAM_ERR
	end
	
	if #post.web.name == 0 then
		return false, WEBERR.NO_USER_PRIVIDED
	end
	
	return true
end

local function Execute(post)
	local _name = post.web.name
	local _debug_str = "delete user name:("

	local _query_sql = "delete from KF_SYS_USR where name = "
	for k, v in pairs(_name) do
		if k == 1 then
			_query_sql = _query_sql .. ngx.quote_sql_str(v)
			_debug_str = _debug_str .. v
		else
			_query_sql = _query_sql .. " or name = " .. ngx.quote_sql_str(v)
			_debug_str = _debug_str .. "," .. v
		end
	end
	INFO(_debug_str .. ")")
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
