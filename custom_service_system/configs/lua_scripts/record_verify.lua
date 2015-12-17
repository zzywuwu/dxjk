local function AddEventback(res)
		local _affected_rows = res.affected_rows
		if _affected_rows == 0 then
			ERROR("AddEventback")
			return nil, WEBERR.PARAM_ERR
		end	
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not post.web.id then
		return false, WEBERR.PARAM_ERR
	end

	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege) then
		return false, WEBERR.SESSION_TIMEOUT
	end

	if (common.BitAnd(post.session.privilege, 32) ~= 32) then
		return false, WEBERR.USER_PRIVILEGE_NOT_ENOUGH
	end

	return true
end

local function Execute(post)
	local _id = post.web.id
	local _user_id = post.session.loginid
	
	local _query_sql = "update record set update_time = NOW(), verify = 1 where id = "

	for k, v in pairs(_id) do
		if k == 1 then
			_query_sql = _query_sql .. ngx.quote_sql_str(v)
		else
			_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
		end
	end

	local function AddEvent(res)
		local tbl = cjson.decode(res[1].fzinfo)
		if not tbl then
			ERROR("ERROR ".._fzinfo)
			return false, WEBERR.PARAM_ERR
		else
			for i=1,#tbl do
				local _customer_id = res[1].id
				local _next_visit_date = tbl[i].next_visit_date
				local _next_visit_time = tbl[i].next_visit_time
				local _next_order_success = tbl[i].next_order_success
				local _next_visit_doctor_name = tbl[i].next_visit_doctor_name
				local _next_visit_type = tbl[i].next_visit_type
				local _next_visit_address = tbl[i].next_visit_address
				local _next_visit_remarks = tbl[i].next_visit_remarks
				local current_time = os.date("%Y-%m-%d %H:%M:%S", os.time()+i)
				local _query_sql = "insert into record (update_time,customer_id,visit_date,remarks,visit_time,visit_type,visit_doctor_name,visit_address,order_success,user_id) value("..ngx.quote_sql_str(current_time)..","..ngx.quote_sql_str(_customer_id)..","..ngx.quote_sql_str(_next_visit_date)..","..ngx.quote_sql_str(_next_visit_remarks)..","..ngx.quote_sql_str(_next_visit_time)..","..ngx.quote_sql_str(_next_visit_type)..","..ngx.quote_sql_str(_next_visit_doctor_name)..","..ngx.quote_sql_str(_next_visit_address)..","..ngx.quote_sql_str(_next_order_success)..","..ngx.quote_sql_str(_user_id)..")" 

				DEBUG("record_verify: " .. _query_sql)
				INFO(post.session.name.."审核增加事件".._query_sql)
				mysql.query(cloud_database, _query_sql, AddEventback)	
			end
		end
	end

	local function MysqlCallback(res)
		local _affected_rows = res.affected_rows
		if _affected_rows == 0 then
			return nil, WEBERR.USER_NO_EXIST
		end
		local _query_sql = "select record.fzinfo,customer.id from record,customer where record.customer_id = customer.id and record.id = "..ngx.quote_sql_str(_id[1]).. " limit 1"
		mysql.query(cloud_database, _query_sql, AddEvent)
		local _jsontbl = {
			web = {
				error = WEBERR.NO_ERR
			}
		}
		return _jsontbl
	end

	DEBUG("record_verify: " .. _query_sql)
	INFO(post.session.name.." 审核记录 ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M


