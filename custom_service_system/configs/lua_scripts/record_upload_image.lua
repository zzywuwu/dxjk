local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	
	local _record_id = post.web.record_id
    local _new_name = post.web.image_name
    local _org_name = post.web.org_name
    
    local function MysqlCallback(res)
    	local _new_image_json = {}
		local _new_file = _record_id.."_".._new_name.."."..common.getExtension(_org_name)
		if res[1].image == "" then
			table.insert(_new_image_json,_new_file)
		else
			local tbl = cjson.decode(res[1].image)
			if not tbl then
				ERROR("ERROR image = "..res[1].image)
			else
				_new_image_json = tbl
				local flag = false
				for i,v in ipairs(_new_image_json) do
					if v == _new_file then
						flag = true
					end
				end
				if flag == false then
					table.insert(_new_image_json,_record_id.."_".._new_name.."."..common.getExtension(_org_name))
				end
			end
		end
	
		local _image_str = cjson.encode(_new_image_json)
		local _query_sql = "update record set update_time = NOW(), image = " 
							.. ngx.quote_sql_str(_image_str) .. " where id = " .. ngx.quote_sql_str(_record_id)
							
		DEBUG("record_upload_image: " .. _query_sql)
		INFO("上传图片 ".._query_sql)
		mysql.query(cloud_database, _query_sql, nil)

		local _jsontbl = {
			session = {
				file = nil
			},
			web = {
				error = WEBERR.NO_ERR,
				user_info = res
			}
		}
		return _jsontbl
	end

	local _query_sql = "select *,customer.name as customer_name from record,customer where record.id = "..ngx.quote_sql_str(_record_id).." and customer.id = record.customer_id"
	INFO(_query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

