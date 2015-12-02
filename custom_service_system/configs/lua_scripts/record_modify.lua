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
	
	if not (post.web.visit_date and post.web.servicename and post.web.id) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.visit_date ~= '' and post.web.servicename ~= '') then
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
	local _visit_date = post.web.visit_date
	local _visit_time = post.web.visit_time
	local _visit_type = post.web.visit_type
	local _visit_doctor_name = post.web.visit_doctor_name
	local _result = post.web.result
	local _remarks = post.web.remarks
	local _doctor_advise = post.web.doctor_advise
	local _next_visit_date = post.web.next_visit_date
	local _servicename = post.web.servicename
	local _loginid =post.session.loginid
	
	local _query_sql
	-- if (common.BitAnd(post.session.privilege, 32) ~= 32) then
	-- 	-- 不能修改他人创建的记录
	-- 	_query_sql = "update record set update_time = NOW(), visit_date = " 
	-- 					.. ngx.quote_sql_str(_visit_date) .. ", visit_time = " 
	-- 					.. ngx.quote_sql_str(_visit_time) .. ", visit_type = " 
	-- 					.. ngx.quote_sql_str(_visit_type) .. ", visit_doctor_name = " 
	-- 					.. ngx.quote_sql_str(_visit_doctor_name) .. ", result = " 
	-- 					.. ngx.quote_sql_str(_result) .. ", doctor_advise = " 
	-- 					.. ngx.quote_sql_str(_doctor_advise) .. ", remarks = "
	-- 					.. ngx.quote_sql_str(_remarks) .. ", next_visit_date = "
	-- 					.. ngx.quote_sql_str(_next_visit_date) .. ", servicename = " 
	-- 					.. ngx.quote_sql_str(_servicename) .. " where id = " .. ngx.quote_sql_str(_id)
	-- 					.. " and verify = 0 and user_id = " .. ngx.quote_sql_str(_loginid)
	-- else
		-- 有32权限的人可以修改任何人的记录
		_query_sql = "update record set update_time = NOW(), status = 1, visit_date = " 
						.. ngx.quote_sql_str(_visit_date) .. ", visit_time = " 
						.. ngx.quote_sql_str(_visit_time) .. ", visit_type = " 
						.. ngx.quote_sql_str(_visit_type) .. ", visit_doctor_name = " 
						.. ngx.quote_sql_str(_visit_doctor_name) .. ", result = " 
						.. ngx.quote_sql_str(_result) .. ", doctor_advise = " 
						.. ngx.quote_sql_str(_doctor_advise) .. ", remarks = "
						.. ngx.quote_sql_str(_remarks) .. ", next_visit_date = "
						.. ngx.quote_sql_str(_next_visit_date) .. ", servicename = " 
						.. ngx.quote_sql_str(_servicename) .. " where id = " .. ngx.quote_sql_str(_id)
						.. " and verify = 0"	
	-- end 
	
	DEBUG("record_modify: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

