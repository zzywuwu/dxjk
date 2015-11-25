local function MysqlCallback(res)
	if 0 ==  #res then
		return nil, WEBERR.NAME_OR_PASSWORD_ERR
	end

	local _privilege = res[1].privilege
	local _status = res[1].status
	local _err = WEBERR.NO_ERR
	if _status == "not actived" then
		_err = WEBERR.ACCOUNT_NOT_ACTIVE
	end
	
	local _jsontbl = {
		web = {
			error = _err
		},
		session = {
			name = nil,
			privilege = _privilege
		}
	}
	
	return _jsontbl
end

local function ParamCheck(post)
	local _web = post.web
	local _session = post.session
	
	if not (_web and _session) then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (_web.name and _web.password and _web.randcode and _session.cap_word 
						and _session.now_time and _session.cap_time) then
		return false, WEBERR.PARAM_ERR
	end
	
	if _web.randcode ~= _session.cap_word then
		return false, WEBERR.IDCODE_ERR
	end
	
	if _session.cap_time + 60 < _session.now_time then
		return false, WEBERR.IDCODE_TIMEOUT
	end

	return true
end

local function Execute(post)
	local _name = post.web.name
	local _password = post.web.password

	INFO("login name: " .. _name)
	local _get_user_password = "select privilege,status from user where name = " 
					.. ngx.quote_sql_str(_name) .. " and password = " .. ngx.quote_sql_str(_password)
	local _update_login_time = "update user set last_login_time = NOW() where name = " 
					.. ngx.quote_sql_str(_name) .. " and password = " .. ngx.quote_sql_str(_password)
	local _query_sql = _get_user_password .. ";" .. _update_login_time
	
	DEBUG("login: " .. _query_sql)
	local _res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback)
	if _res then
		_res.session.name = _name
	end
	return _res, _err
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

