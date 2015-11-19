local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			ad_list = res
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.session.name then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _privilege = post.web.privilege
	
	local _query_sql = "select * from market_upgrade_message where type = 0"
	INFO("get advertisement list")
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

