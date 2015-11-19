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
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.name and post.web.password 
			and post.web.privilege and post.web.email) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _name = post.web.name
	local _password = post.web.password
	local _privilege = post.web.privilege
	local _email = post.web.email

	INFO("add user (name:" .. _name .. ",privilege:" .. _privilege .. ")")
	local _query_sql = "insert into KF_SYS_USR(privilege,name,password,email) value(" 
			.. ngx.quote_sql_str(_privilege) .. ",".. ngx.quote_sql_str(_name) .. "," 
			.. ngx.quote_sql_str(_password) .. "," .. ngx.quote_sql_str(_email) .. ")" 
	
	local _res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback)
	if _err == WEBERR.KEY_ALREADY_EXIST then
		_err = WEBERR.USER_ALREADY_EXIST
	end
	return _res,_err
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
