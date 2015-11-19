local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.VER_ID_NO_EXIST
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
	
	if not (post.web.id and post.web.soft_ver and post.web.production
		and post.web.password and post.web.support and post.web.next_ver_id
		and post.web.hard_ver and post.web.system and post.web.description
		and post.web.recursion) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _file
	local _query_sql
	local _id = post.web.id
	local _soft_ver = post.web.soft_ver
	local _production = post.web.production
	local _password = post.web.password
	local _support = post.web.support
	local _next_ver_id = post.web.next_ver_id
	local _hard_ver = post.web.hard_ver
	local _system = post.web.system
	local _description = post.web.description
	local _recursion = post.web.recursion
	
	if post.session.file then
		_file = file_path .. "temp/" .. post.session.file
		INFO("update softver(contain image) of id:" .. _id .. " softver:" .. _soft_ver)
		_query_sql = "update route_product_info set soft_ver = " .. ngx.quote_sql_str(_soft_ver) .. 
						",production = " .. ngx.quote_sql_str(_production) ..
						",password = " .. ngx.quote_sql_str(_password) ..
						",support = " .. _support ..
						",next_ver_id = " .. _next_ver_id ..
						",recursion = " .. _recursion ..
						",hard_ver = " .. ngx.quote_sql_str(_hard_ver) ..
						",system = " .. ngx.quote_sql_str(_system) ..
						",description = " .. ngx.quote_sql_str(_description) ..
						",image = LOAD_FILE(" .. ngx.quote_sql_str(_file) .. ")" ..
						",image_md5 = md5(image)" ..
						" where id = " .. _id
	else
		INFO("update softver of id:" .. _id .. " softver:" .. _soft_ver)
		_query_sql = "update route_product_info set soft_ver = " .. ngx.quote_sql_str(_soft_ver) .. 
						",production = " .. ngx.quote_sql_str(_production) ..
						",password = " .. ngx.quote_sql_str(_password) ..
						",support = " .. _support ..
						",next_ver_id = " .. _next_ver_id ..
						",recursion = " .. _recursion ..
						",hard_ver = " .. ngx.quote_sql_str(_hard_ver) ..
						",system = " .. ngx.quote_sql_str(_system) ..
						",description = " .. ngx.quote_sql_str(_description) ..
						" where id = " .. _id
	end
	local _res,_err = mysql.query(cloud_database, _query_sql, MysqlCallback)
	if _file then
		os.remove(_file)
	end
	return _res,_err
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

