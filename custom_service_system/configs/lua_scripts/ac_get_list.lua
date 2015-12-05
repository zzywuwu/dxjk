
local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}
	SetCache("ac_get_list",_jsontbl)
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	local cache = common.GetCache("ac_get_list")
	if next(cache) ~= nil then 
		DEBUG("ac_get_list cache exits")
		return cache 
	end

	local _query_sql = "select * from user"
	DEBUG("ac_get_list: ".._query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute,
	cache = {}
}

return _M

