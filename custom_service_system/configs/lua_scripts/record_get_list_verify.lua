local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_record = res
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
	
	local _query_sql = "select record.*,user.name As username,customer.name As customer_name from customer,record,user where record.verify = 0 and record.status = 1 and customer.id = record.customer_id and record.user_id = user.id and customer.vip < 2 order by update_time desc"

	DEBUG("verify_record_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

