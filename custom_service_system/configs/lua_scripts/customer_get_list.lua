local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}

	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	
	-- local _query_sql = "select a.id, a.name, a.idnumber, a.phonenumber, a.doctor_name, a.wx, a.next_visit_time, a.due_time, a.last_menses_time, a.remarks, a.vip, a.username, user.name as sellname from (select customer.id, customer.name, customer.idnumber, customer.phonenumber, customer.doctor_name, customer.wx, customer.next_visit_time, customer.due_time, customer.last_menses_time, customer.remarks, customer.vip, customer.sell_id, user.name As username from customer,user where user.id = customer.user_id and customer.vip = 0) as a,user where user.id = a.sell_id order by a.next_visit_time asc"

	local _query_sql = "select * from customer where vip = 0 order by next_visit_time asc"

	INFO("get customer list ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

