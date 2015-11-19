local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			version_list = res
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
	local _production
	local _get_vers
	
	if post.web.production then
		_production = post.web.production
		INFO("get softver list of production:" .. _production)
		_query_sql = "select id,production,soft_ver,password,support," ..
					"next_ver_id,hard_ver,system,description,create_time,recursion from route_product_info " ..
					"where production = " .. ngx.quote_sql_str(_production)
	else
		_query_sql = "select id,production,soft_ver,password,support," ..
					"next_ver_id,hard_ver,system,description,create_time,recursion from route_product_info"
		INFO("get all production softver list")
	end
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

