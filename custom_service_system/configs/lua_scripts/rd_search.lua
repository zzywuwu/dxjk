local function MysqlCallback(res)
	if 0 == #res then
		return nil, WEBERR.RD_ID_NO_EXIST
	end
	
	local _contents_tbl = cjson.decode(res[1].contents)
	res[1].contents = _contents_tbl
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			rd_list = res
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
	local _query_sql = "select * from KF_SYS_CONTENT where id = " .. _id
	
	INFO("search rd content id:" .. _id)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
