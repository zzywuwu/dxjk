local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}
	-- SetCache("get_no_event_user_list",_jsontbl)
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)

	-- local cache = common.GetCache("get_no_event_user_list")
	-- if next(cache) ~= nil then 
	-- 	DEBUG("get_no_event_user_list cache exits")
	-- 	return cache 
	-- end
	
	-- local _query_sql = "select xxx.name,xxx.vip from (select customer.name,event.customer_id,customer.vip from event right join customer on customer.id = event.customer_id) AS xxx where customer_id is null and vip !=2"

	-- local _query_sql = "select customer.name,event.customer_id,customer.vip,event.visit_date from event right join customer on customer.id = event.customer_id where ((visit_date < now() or visit_date is null) and vip < 2)"

	-- local _query_sql = "select * from (select customer.name,a.visit_date from customer left join (select customer.id as cid,record.visit_date from customer,record where customer.id = record.customer_id and status = 0 and customer.vip < 2 order by record.visit_date desc limit 1) as a on customer.id = a.cid) as b where (b.visit_date < now() or b.visit_date is null)"

	local _query_sql = "select customer.name,customer.vip,a.visit_date from customer left join (select customer.id as cid,record.visit_date from customer,record where customer.id = record.customer_id and status = 0 and customer.vip < 2 and record.visit_date > now()) as a on a.cid = customer.id where a.visit_date is null"

	DEBUG("get_no_event_user_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute,
	cache = {}
}

return _M

