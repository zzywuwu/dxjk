local function MysqlCallback(res)
	if 0 ==  #res then
		return nil, WEBERR.NAME_OR_PASSWORD_ERR
	end

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
			loginid = res[1].id,
			name = res[1].name,
			privilege = res[1].privilege
		}
	}
	local current_time = os.date("%Y-%m-%d %H:%M:%S")
	INFO("login name: " .. res[1].name ..", time: "..current_time..", privilege: "..res[1].privilege)
	
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
		ERROR("login name: " .. _web.name .." 填写验证码不正确")
		return false, WEBERR.IDCODE_ERR
	end
	
	if _session.cap_time + 60 < _session.now_time then
		ERROR("login name: " .. _web.name .." 填写验超时")
		return false, WEBERR.IDCODE_TIMEOUT
	end

	return true
end

local function Execute(post)
	local _name = post.web.name
	local _password = post.web.password

	local _get_user_password = "select privilege,status,name,id from user where name = " 
					.. ngx.quote_sql_str(_name) .. " and password = " .. ngx.quote_sql_str(_password)
	local _update_login_time = "update user set last_login_time = NOW() where name = " 
					.. ngx.quote_sql_str(_name) .. " and password = " .. ngx.quote_sql_str(_password)
	local _query_sql = _get_user_password .. ";" .. _update_login_time
	
	DEBUG("login_sql: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

