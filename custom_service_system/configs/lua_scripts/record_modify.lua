local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.PARAM_ERR
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
	local _customer_name = post.web.customer_name
	local _visit_date = post.web.visit_date
	local _visit_time = post.web.visit_time
	local _visit_type = post.web.visit_type
	local _visit_doctor_name = post.web.visit_doctor_name
	local _result = post.web.result
	local _remarks = post.web.remarks
	local _doctor_advise = post.web.doctor_advise
	local _servicename = post.web.servicename
	local _user_id = post.session.loginid
	local _fzinfo = post.web.fzinfo

	local _query_sql
		_query_sql = "update record set update_time = NOW(), status = 1, visit_date = " 
						.. ngx.quote_sql_str(_visit_date) .. ", visit_time = " 
						.. ngx.quote_sql_str(_visit_time) .. ", visit_type = " 
						.. ngx.quote_sql_str(_visit_type) .. ", visit_doctor_name = " 
						.. ngx.quote_sql_str(_visit_doctor_name) .. ", result = " 
						.. ngx.quote_sql_str(_result) .. ", doctor_advise = " 
						.. ngx.quote_sql_str(_doctor_advise) .. ", remarks = "
						.. ngx.quote_sql_str(_remarks) .. ", user_id = " 
						.. ngx.quote_sql_str(_user_id) .. ", fzinfo = "
						.. ngx.quote_sql_str(_fzinfo) .. ", servicename = "  
						.. ngx.quote_sql_str(_servicename) .. " where id = " .. ngx.quote_sql_str(_id)
						.. " and verify = 0"	
	
	DEBUG("record_modify: " .. _query_sql)
	INFO(post.session.name.." 修改记录 ".._customer_name.." ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

