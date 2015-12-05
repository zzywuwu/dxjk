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
	ClearCache("ac_get_list")
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

	local _query_sql = "insert into user (name,phonenumber,wx,password) value(" 
			.. ngx.quote_sql_str(_name) .. ",".. ngx.quote_sql_str(_phonenumber).. "," 
			.. ngx.quote_sql_str(_wx)..",123456)" 
	
	DEBUG("ac_add: ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
