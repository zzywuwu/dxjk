local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.MYSQL_QUERY_FAIL
	end
	
	local _jsontbl = {
		session = {
			file = nil
		},
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
	
	if not (post.session.file and post.web.father_id and post.web.soft_ver 
		and post.web.password and post.web.support and post.web.hard_ver 
		and post.web.recursion and post.web.system and post.web.description and post.web.production) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _file = file_path .. "temp/" .. post.session.file
	local _father_id = post.web.father_id
	local _soft_ver = post.web.soft_ver
	local _production = post.web.production
	local _password = post.web.password
	local _support = post.web.support
	local _hard_ver = post.web.hard_ver
	local _system = post.web.system
	local _description = post.web.description
	local _recursion = post.web.recursion
	local _id

	INFO("add softver:" .. _soft_ver .. "of production:" .. _production)
	local _query_sql = "insert into route_product_info(company,next_ver_id,soft_ver,hard_ver,password,system," ..
					"production,support,recursion,description,image,image_md5) value(\"深圳吉祥腾达\",0," 
			.. ngx.quote_sql_str(_soft_ver) .. ",".. ngx.quote_sql_str(_hard_ver) .. "," 
			.. ngx.quote_sql_str(_password) .. "," .. ngx.quote_sql_str(_system) .. ","
			.. ngx.quote_sql_str(_production) .. "," .. _support .. ","  .. _recursion .. ","
			.. ngx.quote_sql_str(_description) .. ",LOAD_FILE(" .. ngx.quote_sql_str(_file) .."),md5(image))"

	local _res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback)
	os.remove(_file)
	if _err == WEBERR.KEY_ALREADY_EXIST then
		_err = WEBERR.VER_ALREADY_EXIST
		return _res, _err
	end
	_id = _res.insert_id 
	_query_sql = "update route_product_info set next_ver_id = " .. _id .. " where id = " .. _father_id
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
