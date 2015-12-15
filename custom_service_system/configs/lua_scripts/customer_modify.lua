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
	ClearCache("customer_get_list")
	ClearCache("customer_remove_get_list")
	return _jsontbl
end

local function ParamCheck(post)
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.name and post.web.phonenumber and post.web.sellname and post.web.age and post.web.customer_type) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.name ~= '' and post.web.phonenumber ~= '' and post.web.sellname ~= '' and post.web.age ~= '' and post.web.customer_type ~= '') then
		return false, WEBERR.PARAM_ERR
	end

	if (post.web.customer_type == "孕妈妈") then
		if not (post.web.due_time and post.web.last_menses_time) then
			return false, WEBERR.PARAM_ERR
		end

		if not (post.web.due_time ~= '' and post.web.last_menses_time ~= '') then
			return false, WEBERR.PARAM_ERR
		end
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
	local _name = post.web.name
	local _phonenumber = post.web.phonenumber
	local _due_time = post.web.due_time
	local _last_menses_time = post.web.last_menses_time
	local _doctor_name = post.web.doctor_name
	local _idnumber = post.web.idnumber
	local _wx = post.web.wx
	local _sellname = post.web.sellname
	local _remarks = post.web.remarks
	local _age = post.web.age
	local _address = post.web.address
	local _familyname = post.web.familyname
	local _familyphonenumber = post.web.familyphonenumber
	local _customer_type = post.web.customer_type
	local _height = post.web.height
	local _weight = post.web.weight

	local _query_sql
	if (post.web.customer_type == "孕妈妈") then
		_query_sql = "update customer set update_time = NOW(), phonenumber = "
						.. ngx.quote_sql_str(_phonenumber) .. ", customer_type= " 
						.. ngx.quote_sql_str(_customer_type) .. ",  due_time= " 
						.. ngx.quote_sql_str(_due_time) .. ", last_menses_time = " 
						.. ngx.quote_sql_str(_last_menses_time) .. ", doctor_name = " 
						.. ngx.quote_sql_str(_doctor_name) .. ", idnumber = " 
						.. ngx.quote_sql_str(_idnumber) .. ", wx = " 
						.. ngx.quote_sql_str(_wx) .. ", remarks = "
						.. ngx.quote_sql_str(_remarks) .. ", sellname = "
						.. ngx.quote_sql_str(_sellname) .. ", age = " 
						.. ngx.quote_sql_str(_age) .. ", address = " 
						.. ngx.quote_sql_str(_address) .. ", familyname = " 
						.. ngx.quote_sql_str(_familyname) .. ", height = "
						.. ngx.quote_sql_str(_height) .. ", weight = " 
						.. ngx.quote_sql_str(_weight) .. ", familyphonenumber = "    
						.. ngx.quote_sql_str(_familyphonenumber) .. " where id = " .. ngx.quote_sql_str(_id)
	else
		_query_sql = "update customer set update_time = NOW(), phonenumber = "
						.. ngx.quote_sql_str(_phonenumber) .. ", customer_type= "  
						.. ngx.quote_sql_str(_customer_type) .. ", doctor_name = " 
						.. ngx.quote_sql_str(_doctor_name) .. ", idnumber = " 
						.. ngx.quote_sql_str(_idnumber) .. ", wx = " 
						.. ngx.quote_sql_str(_wx) .. ", remarks = "
						.. ngx.quote_sql_str(_remarks) .. ", sellname = "
						.. ngx.quote_sql_str(_sellname) .. ", age = " 
						.. ngx.quote_sql_str(_age) .. ", address = " 
						.. ngx.quote_sql_str(_address) .. ", familyname = " 
						.. ngx.quote_sql_str(_familyname) .. ", height = "
						.. ngx.quote_sql_str(_height) .. ", weight = " 
						.. ngx.quote_sql_str(_weight) .. ", familyphonenumber = "    
						.. ngx.quote_sql_str(_familyphonenumber) .. " where id = " .. ngx.quote_sql_str(_id)
	end

	DEBUG("customer_modify: " .. _query_sql)
	INFO(post.session.name.." 修改 ".._name.." ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

