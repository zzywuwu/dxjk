local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_record = res
		}
	}
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	local date = os.date("*t",os.time()-60*60*24);
	local yeset_day_str = date.year.."-"..date.month.."-"..date.day	
	date = os.date("*t",os.time()+60*60*24*30);
	local ten_day_str = date.year.."-"..date.month.."-"..date.day
	local _query_sql = "select record.*,customer.phonenumber As phonenumber,customer.name As customer_name,customer.gender As gender,customer.create_time as customer_create_time,customer.customer_type as customer_type from customer,record where record.status = 0 and customer.id = record.customer_id and customer.vip < 2 and record.visit_date > '"..yeset_day_str.."' and record.visit_date < '"..ten_day_str.."'"

	DEBUG("sms_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M