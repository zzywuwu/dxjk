local function MysqlCallback1(res)
	return res
end

local function MysqlCallback2(res)
	if 0 == #res then
		return nil, WEBERR.RD_EMPTY
	end
	
	local n, _contents_tbl
	for n = 1, #res do
		_contents_tbl = cjson.decode(res[n].contents)
		res[n].contents = _contents_tbl
	end
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			rd_list = res
		}
	}
	return _jsontbl
end

local function MysqlCallback3(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MYSQL_QUERY_FAIL
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not post.web.type then
		return false, WEBERR.PARAM_ERR
	end
	
	if post.web.type == "yonghu" then
		if not post.web.name then
			return false, WEBERR.PARAM_ERR
		end
	else
		if not post.session.name then
			return false, WEBERR.SESSION_TIMEOUT
		end
		
		if not post.web.id then
			return false, WEBERR.PARAM_ERR
		end
	end
	
	return true
end

local function Execute(post)
	local _type = post.web.type
	local _name, _id, _query_sql, _res, _err
	
	if _type == "yonghu" then
		_name = post.web.name
		INFO("user_name:" .. _name .. " get rd message")
		_query_sql = "select id from KF_APP_USR where name = " .. ngx.quote_sql_str(_name)
		_res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback1)
		
		if _res then
			if 0 == #_res then
				_query_sql = "insert into KF_APP_USR(name) value(" .. ngx.quote_sql_str(_name) .. ")"
				_res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback3)
				if _err == WEBERR.KEY_ALREADY_EXIST then
					_err = WEBERR.USER_ALREADY_EXIST
				end
			else 
				_query_sql = "select id from KF_SYS_ORDER where user_id = " .. _res[1].id
				_res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback1)
				if _res then
					if 0 == #_res then
						return nil, WEBERR.RD_EMPTY
					else
						local n
						_query_sql = "select * from KF_SYS_CONTENT where id = "
						for n = 1, #_res do
							if n == 1 then
								_query_sql = _query_sql .. _res[n].id
							else
								_query_sql = _query_sql .. " or id = " .. _res[n].id
							end
						end
						_res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback2)
					end
				end
			end
		end
		return _res, _err
	else
		_id = post.web.id
		_name = post.session.name
		INFO("kf_name:" .. _name .. " get rd message of id:" .. ngx.quote_sql_str(_id))
		local _select_sql = "select * from KF_SYS_CONTENT where id = " .. _id
		local _update_sql = "update KF_SYS_ORDER set status = \"processing\" where id = " .. ngx.quote_sql_str(_id)
		_query_sql = _select_sql .. ";" .. _update_sql
		return mysql.query(cloud_database, _query_sql, MysqlCallback2)
	end
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

