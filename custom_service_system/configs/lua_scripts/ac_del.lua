local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.USER_NO_EXIST
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
	
	if not post.web.id then
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
	-- local _id = post.web.id
	-- local _loginid = post.session.loginid
	
	-- local _query_sql = "delete from user where id = "

	-- for k, v in pairs(_id) do
	-- 	if k == 1 then
	-- 		if tonumber(v) == tonumber(_loginid) then
	-- 			return nil, WEBERR.DEL_USER_SELF
	-- 		end

	-- 		_query_sql = _query_sql .. ngx.quote_sql_str(v)
	-- 	else
	-- 		_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
	-- 	end
	-- end

	-- DEBUG("ac_del: ".._query_sql)
	-- INFO(post.session.name.." 删除用户 ".._query_sql)
	-- return mysql.query(cloud_database, _query_sql, MysqlCallback)

	local _id = post.web.id
	local _loginid = post.session.loginid

	local function QueryCountBack(res)
		-- if res[1].count ~= '0' then
		-- 	return nil, WEBERR.DONT_DELETE_CUSTOMER
		-- else
			local _query_sql = "update user set update_time = NOW(), status = 'dead' where id = "
			for k, v in pairs(_id) do
				if k == 1 then				
					_query_sql = _query_sql .. ngx.quote_sql_str(v)
				else
					_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
				end
			end
			DEBUG("ac_del: " .. _query_sql)
			INFO(post.session.name.." 删除用户 ".._query_sql)
			return mysql.query(cloud_database, _query_sql, MysqlCallback)
		-- end
	end

	local _query_sql = "select count(*) As count from record where user_id = "

	for k, v in pairs(_id) do
		if k == 1 then
			_query_sql = _query_sql .. ngx.quote_sql_str(v)
		else
			_query_sql = _query_sql .. " or id = " .. ngx.quote_sql_str(v)
		end
	end

	DEBUG("QueryCount: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, QueryCountBack)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
