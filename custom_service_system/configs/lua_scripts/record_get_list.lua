local function QuerynameBack(result)

	local _query_sql = "select * from record where customer_id = "..ngx.quote_sql_str(result[1].id)

	local function MysqlCallback(res)
		local _jsontbl = {
			web = {
				error = WEBERR.NO_ERR,
				user_record = res,
				username = result[1].name
			}
		}
		return _jsontbl
	end

	DEBUG("record_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)	
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
	local _id = post.web.customer_id

	local _query_sql = "select * from customer where id = " .. ngx.quote_sql_str(_id) .. " limit 1"

	-- local _query_sql = "select record.*,customer.name from record,customer where record.customer_id = " .. ngx.quote_sql_str(_id) .. " and record.customer_id = customer.id"

	-- DEBUG("record_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, QuerynameBack)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

