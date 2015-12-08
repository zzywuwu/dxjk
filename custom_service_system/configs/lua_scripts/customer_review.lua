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
	
	if not (post.web.id) then
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
	local _review_content = post.web.review_content
	
	local _query_sql
	if (_review_content == '') then
		_query_sql = "update customer set review_time = '0000-00-00 00:00:00', review_content = "..ngx.quote_sql_str(_review_content).." where id = "..ngx.quote_sql_str(_id)
	else
		_query_sql = "update customer set review_time = NOW(), review_content = "..ngx.quote_sql_str(_review_content).." where id = "..ngx.quote_sql_str(_id)
	end

	DEBUG("customer_review: " .. _query_sql)
	INFO(post.session.name.." 客户回访 ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
