local function ParamCheck(post)
	if not (post.web.p)then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.p ~= '') then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	local _p = post.web.p

	local _md5 = string.sub(_p,1,8)
	local _uid = string.sub(_p,9)

	-- INFO(_md5)
	-- INFO(_uid)

	local function MysqlCallback(res)
		local _affected_rows = res.affected_rows
		if _affected_rows == 0 then
			return nil, WEBERR.USER_NO_EXIST
		end
		local _jsontbl = {
			web = {
				error = WEBERR.PARAM_ERR
			}
		}
		if (#res == 0) then
			_jsontbl.web.error = WEBERR.NO_ERR
			INFO(_uid.." 病历查询 ")
		else
			local md5 = md5.sumhexa(res[1].customer_create_time.."TSL")
			local md5sub8 = string.sub(md5,1,8)
			if (_md5 == md5sub8) then
				_jsontbl.web.error = WEBERR.NO_ERR
				_jsontbl.web.user_info = res
			end
			INFO(res[1].customer_name.." 病历查询 ")
		end
		return _jsontbl
	end

	local _query_sql = "select record.*,customer.name as customer_name,customer.create_time as customer_create_time,customer.gender as customer_gender from record,customer where record.customer_id = "..ngx.quote_sql_str(_uid).." and record.customer_id = customer.id order by record.visit_date desc" 
	DEBUG("query_bingli: " .. _query_sql)
	
	return mysql.query(cloud_database, _query_sql, MysqlCallback)

end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

