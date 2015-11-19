local function MysqlCallback1(res)
	if 0 ~= #res then
		return nil, WEBERR.FATHER_VER_EXIST
	end

	return
end

local function MysqlCallback2(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.VER_NO_EXIST
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

	return true
end

local function Execute(post)
	local _id = post.web.id
	local _query_sql = "select id from route_product_info where next_ver_id = " .. _id
	
	INFO("delete soft_ver id:" .._id)
	local _res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback1)
	if _err then
		return _res, _err
	end
	_query_sql = "delete from route_product_info where id = " .. _id
	return mysql.query(cloud_database, _query_sql, MysqlCallback2)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
