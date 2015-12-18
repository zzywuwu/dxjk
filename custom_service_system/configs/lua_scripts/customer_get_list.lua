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
			local last_menses_time = res[i].last_menses_time;
			local due_time = res[i].due_time;

			local year_ = string.sub(last_menses_time,1,4)
			local month_ = string.sub(last_menses_time,6,7)
			local day_ = string.sub(last_menses_time,9,10)
			local tab_ = {year=tonumber(year_), month=tonumber(month_), day=tonumber(day_), hour=0,min=0,sec=0,isdst=false}
			local time_ = os.time(tab_)
			
			local year__ = string.sub(due_time,1,4)
			local month__ = string.sub(due_time,6,7)
			local day__ = string.sub(due_time,9,10)
			local tab__ = {year=tonumber(year__), month=tonumber(month__), day=tonumber(day__), hour=0,min=0,sec=0,isdst=false}
			local time__ = os.time(tab__)

			local diffsecond
			if (time__ > current_time) then
				diffsecond = os.difftime(current_time,time_)
			else
				diffsecond = os.difftime(time__,time_)
			end
			local diffday = math.floor(diffsecond/(24*60*60)) + 1
			local diffweeks = math.floor(diffday/7).." + "..diffday%7
			_jsontbl.web.user_list[i]["diffweeks"] = diffweeks	
		else
			_jsontbl.web.user_list[i]["diffweeks"] = ""	
		end
	end
	
	common.SetCache("customer_get_list",_jsontbl)
	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)

	-- local cache = common.GetCache("customer_get_list")
	-- if next(cache) ~= nil then 
	-- 	DEBUG("customer_get_list cache exits")
	-- 	return cache 
	-- end
	
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

