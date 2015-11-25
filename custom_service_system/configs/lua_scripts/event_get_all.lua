local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_event = res
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
	
	local _query_sql = "select event.*,customer.name as customer_name from event,customer where customer.id = event.customer_id and customer.vip !=2 and visit_time >= now() order by event.morning_or_noon asc"

	DEBUG("customer_get_all: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

