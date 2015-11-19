local function MysqlCallback1(res)
	return res
end

local function MysqlCallback2(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MYSQL_QUERY_FAIL
	end

	return res
end

local function MysqlCallback3(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MYSQL_QUERY_FAIL
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.type and post.web.content) then
		return false, WEBERR.PARAM_ERR
	end
	
	if post.web.type == "kefu" then
		if not post.session.name then
			return false, WEBERR.SESSION_TIMEOUT
		end
		
		if not post.web.id then
			return false, WEBERR.PARAM_ERR
		end
	end
	
	return true
end

local function CreateFileUrl(file, id)
	local _file = {}
	local k, v, n
	n = 1
	if file then
		for k, v in pairs(file) do
			_file[n] = url_path .. id .. "/" .. v
			n = n + 1
		end
	end
	return _file
end

local function NewAddRemoveFile(file, id)
	os.execute("mkdir -p " .. file_path .. id)
	if file then
		local k, v
		for k, v in pairs(file) do
			os.rename(file_path .. "temp/" .. v, file_path .. id .. "/" .. v)
			os.remove(file_path .. "temp/" .. v)
		end
	end
	return
end

local function Execute(post)
	local _new_contents, _contents_tbl, _count
	local _type = post.web.type
	local _content = post.web.content
	local _yh_name = post.web.name
	local _kf_name = post.session.name
	local _id = post.web.id
	local _file = post.session.file
	local _res, _err, _query_sql
	local _new_content = {
		type = _type,
		content = _content,
		add_time = os.date("%Y-%m-%d %H:%M:%S"),
		file = nil
	}

	
	if _id then
		INFO("add new content to id:" .. _id .. ",content:\"" .. _content .. "\"")
		_query_sql = "select contents from KF_SYS_CONTENT where id = " .. ngx.quote_sql_str(_id)
		_res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback1)
		if _res then
			if _file then
				_new_content.file = CreateFileUrl(_file, _id)
			end
			_contents_tbl = cjson.decode(_res[1].contents)
			_count = #_contents_tbl
			_contents_tbl[_count+1] = _new_content
			_new_contents = cjson.encode(_contents_tbl)
			_query_sql = "update KF_SYS_CONTENT set contents = " .. ngx.quote_sql_str(_new_contents) ..
						" where id = " .. _id
			_res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback2)
			if _err then
				return _res, _err
			end
			if _type == "kefu" then
				_query_sql = "update KF_SYS_ORDER set kf_id = (select id from KF_SYS_USR where name = " .. 
							ngx.quote_sql_str(_kf_name) .. "),status = \"processed\",update_time = NOW()" ..
							" where id = " .. ngx.quote_sql_str(_id)
			else
				_query_sql = "update KF_SYS_ORDER set status = \"undistributed\" where id = " .. ngx.quote_sql_str(_id)
			end
			return mysql.query(cloud_database, _query_sql, MysqlCallback3)
		end
	else 
		INFO("add new content:\"" .. _content .. "\"")
		_query_sql = "insert into KF_SYS_ORDER(user_id,status) value((select id from KF_APP_USR where name = " .. 
								ngx.quote_sql_str(_yh_name) .. "), \"undistributed\")"
		_res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback2)
		if _err then
			return _res, _err
		end
		if _file then
			_new_content.file = CreateFileUrl(_file, _res.insert_id)
		end
		_contents_tbl = {}
		_contents_tbl[1] = _new_content
		_new_contents = cjson.encode(_contents_tbl)
		_query_sql = "insert into KF_SYS_CONTENT(id, contents) value(" .. _res.insert_id .. "," .. 
					ngx.quote_sql_str(_new_contents) .. ")"
		local _insert_id = _res.insert_id
		_res, _err = mysql.query(cloud_database, _query_sql, MysqlCallback3)
		if _res then
			NewAddRemoveFile(_file, _insert_id)
		end
		return _res, _err
	end

	return _res,_err
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
