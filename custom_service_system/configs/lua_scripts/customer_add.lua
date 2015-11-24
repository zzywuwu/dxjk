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
	
	local _query_sql = "insert into customer (name,phonenumber,doctor_name,sellname,due_time,idnumber,wx,last_menses_time,remarks) value("..ngx.quote_sql_str(_name)..","..ngx.quote_sql_str(_phonenumber)..","..ngx.quote_sql_str(_doctor_name)..","..ngx.quote_sql_str(_sellname)..","..ngx.quote_sql_str(_due_time)..","..ngx.quote_sql_str(_idnumber)..","..ngx.quote_sql_str(_wx)..","..ngx.quote_sql_str(_last_menses_time)..","..ngx.quote_sql_str(_remarks)..")" 

	INFO("add user name:" .. _query_sql)
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
