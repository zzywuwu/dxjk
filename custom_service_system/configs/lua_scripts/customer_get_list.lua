local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}

	local current_time_ = os.time()
	for i=1,#res do
		if (res[i].customer_type == "孕妈妈") then
			local strtime = res[i].last_menses_time;
			local date_ = string.sub(strtime, 1, string.find(strtime, " ") - 1)
			local year_ = string.sub(date_,1,4)
			local month_ = string.sub(date_,6,7)
			local day_ = string.sub(date_,9,10)
			local tab = {year=tonumber(year_), month=tonumber(month_), day=tonumber(day_), hour=0,min=0,sec=0,isdst=false}
			local time_ = os.time(tab)
			local diffsecond = os.difftime(current_time_,time_)
			local diffday = math.floor(diffsecond/(24*60*60)) + 1
			local diffweeks = math.floor(diffday/7).." + "..diffday%7
			_jsontbl.web.user_list[i]["diffweeks"] = diffweeks
			_jsontbl.web.user_list[i]["diffdays"] = diffweeks
		else
			_jsontbl.web.user_list[i]["diffweeks"] = 0
			_jsontbl.web.user_list[i]["diffdays"] = 0	
		end
	end
	
	SetCache("customer_get_list",_jsontbl)
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)

	local cache = common.GetCache("customer_get_list")
	if next(cache) ~= nil then 
		DEBUG("customer_get_list cache exits")
		return cache 
	end
	
	local _query_sql = "select * from customer where vip = 0 order by update_time desc"

	DEBUG("customer_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute,
	cache = {}
}

return _M

