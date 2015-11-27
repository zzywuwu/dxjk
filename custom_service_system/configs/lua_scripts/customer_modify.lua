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
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.name and post.web.phonenumber and post.web.sellname) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local current_time = os.date("%Y-%m-%d %H:%M:%S")
	local _name = post.web.name
	local _phonenumber = post.web.phonenumber

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
	local _sellname = post.web.sellname
	local _remarks = post.web.remarks
	local _age = post.web.age
	local _address = post.web.address
	local _familyname = post.web.familyname
	local _familyphonenumber = post.web.familyphonenumber
	
	local _query_sql = "update customer set update_time = NOW(), phonenumber = " 
						.. ngx.quote_sql_str(_phonenumber) .. ",  due_time= " 
						.. ngx.quote_sql_str(_due_time) .. ", last_menses_time = " 
						.. ngx.quote_sql_str(_last_menses_time) .. ", doctor_name = " 
						.. ngx.quote_sql_str(_doctor_name) .. ", idnumber = " 
						.. ngx.quote_sql_str(_idnumber) .. ", wx = " 
						.. ngx.quote_sql_str(_wx) .. ", remarks = "
						.. ngx.quote_sql_str(_remarks) .. ", sellname = "
						.. ngx.quote_sql_str(_sellname) .. ", age = " 
						.. ngx.quote_sql_str(_age) .. ", address = " 
						.. ngx.quote_sql_str(_address) .. ", familyname = " 
						.. ngx.quote_sql_str(_familyname) .. ", familyphonenumber = "  
						.. ngx.quote_sql_str(_familyphonenumber) .. " where name = " .. ngx.quote_sql_str(_name)

	DEBUG("customer_modify: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

