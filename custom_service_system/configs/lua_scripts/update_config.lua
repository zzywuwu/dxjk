local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.NAME_OR_PASSWORD_ERR
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
	
	if not post.web.email then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _name = post.session.name
	local _email = post.web.email

	INFO("update user info of name:" .. _name)
	local _query_sql = "update KF_SYS_USR set email = " .. ngx.quote_sql_str(email) .. 
						" where name = " .. ngx.quote_sql_str(_name)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

