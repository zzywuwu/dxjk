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
	-- ClearCache("event_get_list")
	return _jsontbl
end

local function ParamCheck(post)
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.id and post.web.visit_date) then
		return false, WEBERR.PARAM_ERR
	end

	if post.web.visit_date == '' then
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
	_visit_date = _visit_date.." 23:59:59"
	local _visit_time = post.web.visit_time
	local _order_success = post.web.order_success
	local _visit_type = post.web.visit_type
	local _remarks = post.web.remarks
	local _visit_doctor_name = post.web.visit_doctor_name
	local _visit_address = post.web.visit_address
	local _loginid = post.session.loginid

	local _query_sql
	_query_sql = "update record set update_time = NOW(), visit_date = " 
						.. ngx.quote_sql_str(_visit_date) .. ", visit_time = " 
						.. ngx.quote_sql_str(_visit_time) .. ", order_success = " 
						.. ngx.quote_sql_str(_order_success) .. ", visit_type = " 
						.. ngx.quote_sql_str(_visit_type) .. ", remarks = " 
						.. ngx.quote_sql_str(_remarks) .. ", visit_doctor_name = "
						.. ngx.quote_sql_str(_visit_doctor_name) .. ", user_id = "
						.. ngx.quote_sql_str(_loginid) .. ", visit_address = "
						.. ngx.quote_sql_str(_visit_address) .. " where id = " .. ngx.quote_sql_str(_id).." and verify = 0"


	DEBUG("event_modify: " .. _query_sql)
	INFO(post.session.name.." 修改事件 ".._customer_name.." ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

