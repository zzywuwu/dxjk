local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MESSAGE_NO_EXIST
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR
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
	
	if not post.web.id then
		return false, WEBERR.PARAM_ERR
	end
	
	if #post.web.id == 0 then
		return false, WEBERR.NO_AD_PRIVIDED
	end
	
	return true
end

local function Execute(post)
	local _id = post.web.id
	local _debug_str = "delete advertisement id("
	
	local _query_sql = "delete from market_upgrade_message where id = "
	for k, v in pairs(_id) do
		if k == 1 then
			_query_sql = _query_sql .. v
			_debug_str = _debug_str .. v
		else
			_query_sql = _query_sql .. " or id = " .. v
			_debug_str = _debug_str .. "," .. v
		end
	end
	INFO(_debug_str .. ")")
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
