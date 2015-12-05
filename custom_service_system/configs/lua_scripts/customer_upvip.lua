local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.CUSTOMER_DONT_UP_VIP
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
	
	if not (post.web.id and post.web.order_time and post.web.order_over_time) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.order_time ~= '' and post.web.order_over_time ~= '') then
		return false, WEBERR.PARAM_ERR
	end

	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege) then
		return false, WEBERR.SESSION_TIMEOUT
	end

	if (common.BitAnd(post.session.privilege, 1) ~= 1) then
		return false, WEBERR.USER_PRIVILEGE_NOT_ENOUGH
	end

	return true
end

local function Execute(post)
	local _id = post.web.id
	local _order_time = post.web.order_time
	local _order_over_time = post.web.order_over_time

	local _query_sql = "update customer set update_time = NOW(), vip = 1, order_time = "..ngx.quote_sql_str(_order_time)..", order_over_time = "..ngx.quote_sql_str(_order_over_time).." where customer_type = '孕妈妈' and id = "

	for k, v in pairs(_id) do
		if k == 1 then
			_query_sql = _query_sql .. ngx.quote_sql_str(v)
		else
			_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
		end
	end

	DEBUG("customer_upvip: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
