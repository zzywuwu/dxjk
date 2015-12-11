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
	ClearCache("customer_get_list")
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
	
		_query_sql = "insert into customer (name,phonenumber,doctor_name,sellname,due_time,idnumber,wx,last_menses_time,age,address,familyname,familyphonenumber,remarks,customer_type,height,weight) value("..ngx.quote_sql_str(_name)..","..ngx.quote_sql_str(_phonenumber)..","..ngx.quote_sql_str(_doctor_name)..","..ngx.quote_sql_str(_sellname)..","..ngx.quote_sql_str(_due_time)..","..ngx.quote_sql_str(_idnumber)..","..ngx.quote_sql_str(_wx)..","..ngx.quote_sql_str(_last_menses_time)..","..ngx.quote_sql_str(_age)..","..ngx.quote_sql_str(_address)..","..ngx.quote_sql_str(_familyname)..","..ngx.quote_sql_str(_familyphonenumber)..","..ngx.quote_sql_str(_remarks)..","..ngx.quote_sql_str(_customer_type)..","..ngx.quote_sql_str(_height)..","..ngx.quote_sql_str(_weight)..")" 
	else

		_query_sql = "insert into customer (name,phonenumber,doctor_name,sellname,idnumber,wx,age,address,familyname,familyphonenumber,remarks,customer_type,height,weight) value("..ngx.quote_sql_str(_name)..","..ngx.quote_sql_str(_phonenumber)..","..ngx.quote_sql_str(_doctor_name)..","..ngx.quote_sql_str(_sellname)..","..ngx.quote_sql_str(_idnumber)..","..ngx.quote_sql_str(_wx)..","..ngx.quote_sql_str(_age)..","..ngx.quote_sql_str(_address)..","..ngx.quote_sql_str(_familyname)..","..ngx.quote_sql_str(_familyphonenumber)..","..ngx.quote_sql_str(_remarks)..","..ngx.quote_sql_str(_customer_type)..","..ngx.quote_sql_str(_height)..","..ngx.quote_sql_str(_weight)..")" 

	end

	DEBUG("customer_add: " .. _query_sql)
	INFO(post.session.name.." 添加客户 ".._query_sql)
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
