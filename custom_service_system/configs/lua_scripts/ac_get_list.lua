local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not post.web.privilege then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _privilege = post.web.privilege
	
	local _query_sql = "select * from KF_SYS_USR where (privilege&" .. _privilege .. ") != 0"
	INFO("get user list privilege:" .. _privilege)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

