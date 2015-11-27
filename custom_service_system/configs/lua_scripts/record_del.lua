local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.USER_PRIVILEGE_NOT_ENOUGH
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
	
	if not post.web.id then
		return false, WEBERR.PARAM_ERR
	end

	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege) then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	return true
end

local function Execute(post)
	local _id = post.web.id
	local _loginid =post.session.loginid
	
	local _query_sql = "delete from record where (id = "
	if (common.BitAnd(post.session.privilege, 32) ~= 32) then
		for k, v in pairs(_id) do
			if k == 1 then
				
				_query_sql = _query_sql .. ngx.quote_sql_str(v)
			else
				_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
			end
		end
		_query_sql = _query_sql .. " and verify = 0 and user_id = ".. ngx.quote_sql_str(_loginid)..")"
	else
		for k, v in pairs(_id) do
			if k == 1 then
				
				_query_sql = _query_sql .. ngx.quote_sql_str(v)
			else
				_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
			end
		end
		_query_sql = _query_sql .. " and verify = 0)"
	end

	DEBUG("record_del: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
