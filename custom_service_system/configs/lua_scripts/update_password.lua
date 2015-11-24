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
	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end

	if not post.session.name then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not post.web.new_password then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _name = post.session.name
	local _new_password = post.web.new_password
	
	INFO("update user password of name:" .. _name)
	local _query_sql = "update user set status = \"actived\",update_time = NOW(),password = " 
						.. ngx.quote_sql_str(_new_password) .. " where name = " .. ngx.quote_sql_str(_name)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

