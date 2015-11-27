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
	
	if not (post.web.visit_date and post.web.next_visit_date) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.visit_date ~= '' and post.web.next_visit_date ~= '') then
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
	
	local _customer_id = post.web.customer_id
	local _visit_date = post.web.visit_date
	local _visit_time = post.web.visit_time
	local _visit_type = post.web.visit_type
	local _visit_doctor_name = post.web.visit_doctor_name
	local _result = post.web.result
	local _remarks = post.web.remarks
	local _doctor_advise = post.web.doctor_advise
	local _next_visit_date = post.web.next_visit_date
	local _servicename = post.web.servicename
	local _loginid = post.session.loginid
	
	local _query_sql = "insert into record (customer_id,visit_date,visit_time,servicename,next_visit_date,visit_type,visit_doctor_name,result,doctor_advise,remarks,user_id) value("..ngx.quote_sql_str(_customer_id)..","..ngx.quote_sql_str(_visit_date)..","..ngx.quote_sql_str(_visit_time)..","..ngx.quote_sql_str(_servicename)..","..ngx.quote_sql_str(_next_visit_date)..","..ngx.quote_sql_str(_visit_type)..","..ngx.quote_sql_str(_visit_doctor_name)..","..ngx.quote_sql_str(_result)..","..ngx.quote_sql_str(_doctor_advise)..","..ngx.quote_sql_str(_remarks)..","..ngx.quote_sql_str(_loginid)..")" 

	DEBUG("record_add: " .. _query_sql)
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
