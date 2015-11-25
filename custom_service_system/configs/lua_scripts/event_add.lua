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
	
	if not (post.web.customer_id and post.web.visit_time) then
		return false, WEBERR.PARAM_ERR
	end

	if post.web.visit_time == '' then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local current_time = os.date("%Y-%m-%d %H:%M:%S")
	local _customer_id = post.web.customer_id
	local _visit_time = post.web.visit_time
	_visit_time = _visit_time.." 23:59:59"
	local _morning_or_noon = post.web.morning_or_noon
	local _order_success = post.web.order_success
	local _visit_type = post.web.visit_type
	local _remarks = post.web.remarks
	
	local _query_sql = "replace into event (customer_id,visit_time,remarks,morning_or_noon,visit_type,order_success) value("..ngx.quote_sql_str(_customer_id)..","..ngx.quote_sql_str(_visit_time)..","..ngx.quote_sql_str(_remarks)..","..ngx.quote_sql_str(_morning_or_noon)..","..ngx.quote_sql_str(_visit_type)..","..ngx.quote_sql_str(_order_success)..")" 

	DEBUG("event_add: " .. _query_sql)
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
