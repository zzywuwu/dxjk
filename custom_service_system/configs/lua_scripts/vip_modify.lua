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
	if not post.session.name then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.name and post.web.phonenumber) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local current_time = os.date("%Y-%m-%d %H:%M:%S")
	local _name = post.web.name
	local _phonenumber = post.web.phonenumber

	local _next_visit_time
	if post.web.next_visit_time == '' then
		_next_visit_time = current_time
	else
		_next_visit_time = post.web.next_visit_time
	end

	local _due_time
	if post.web.due_time == '' then
		_due_time = current_time
	else
		_due_time = post.web.due_time
	end

	local _last_menses_time
	if post.web.last_menses_time == '' then
		_last_menses_time = current_time
	else
		_last_menses_time = post.web.last_menses_time
	end

	local _doctor_name = post.web.doctor_name
	local _idnumber = post.web.idnumber
	local _wx = post.web.wx
	local _svrname = post.web.svrname
	local _sellname = post.web.sellname
	local _remarks = post.web.remarks
	
	local _query_sql = "update customer set update_time = NOW(), phonenumber = " 
						.. ngx.quote_sql_str(_phonenumber) .. ", next_visit_time = " 
						.. ngx.quote_sql_str(_next_visit_time) .. ", due_time = " 
						.. ngx.quote_sql_str(_due_time) .. ", last_menses_time = " 
						.. ngx.quote_sql_str(_last_menses_time) .. ", doctor_name = " 
						.. ngx.quote_sql_str(_doctor_name) .. ", idnumber = " 
						.. ngx.quote_sql_str(_idnumber) .. ", wx = " 
						.. ngx.quote_sql_str(_wx) .. ", remarks = " 
						.. ngx.quote_sql_str(_remarks) .. ", svrname = " 
						.. ngx.quote_sql_str(_svrname) .. ", sellname = " 
						.. ngx.quote_sql_str(_sellname) .. " where name = " .. ngx.quote_sql_str(_name)

	INFO("update user name:" .. _name)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

