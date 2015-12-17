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
	common.ClearCache("ac_get_list")
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.name and post.web.phonenumber and post.web.wx) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.name ~= '' and post.web.phonenumber ~= '' and post.web.wx ~= '') then
		return false, WEBERR.PARAM_ERR
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
	local _wx = post.web.wx

	local _query_sql = "update user set update_time = NOW(), password = 123456, status = 'not actived', phonenumber = "
			.. ngx.quote_sql_str(_phonenumber) .. ", wx = "
			.. ngx.quote_sql_str(_wx).." where name = "..ngx.quote_sql_str(_name) 
	
	DEBUG("ac_modify: ".._query_sql)
	INFO(post.session.name.." 修改用户 ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

