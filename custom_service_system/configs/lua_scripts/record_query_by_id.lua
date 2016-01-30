local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.USER_NO_EXIST
	end

	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_info = res[1]
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	if not post.web.id then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.id ~= '') then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	local _id = post.web.id
	local _query_sql = "select record.*,customer.name as customer_name from record,customer where record.id = "..ngx.quote_sql_str(_id).." and record.customer_id = customer.id limit 1"

	DEBUG("record_query_by_id: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute,
	cache = {}
}

return _M

