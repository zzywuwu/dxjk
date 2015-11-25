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

	if not post.web.customer_id then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	
	local _query_sql = "select * from event where event.customer_id = "
	..post.web.customer_id.." limit 1"

	DEBUG("customer_get: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

