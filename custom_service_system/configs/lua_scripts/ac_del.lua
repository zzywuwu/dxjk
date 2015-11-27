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
	local _loginid = post.session.loginid
	
	local _query_sql = "delete from user where id = "

	for k, v in pairs(_id) do
		if k == 1 then
			if tonumber(v) == tonumber(_loginid) then
				return nil, WEBERR.DEL_USER_SELF
			end
			_query_sql = _query_sql .. ngx.quote_sql_str(v)
		else
			_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
		end
	end

	DEBUG("ac_del: ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
