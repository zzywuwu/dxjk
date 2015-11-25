local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}
	-- local current_time = os.date("%Y-%m-%d %H:%M:%S")
	-- DEBUG(current_time)
	local current_time_ = os.time()
	-- DEBUG(current_time_)
	for i=1,#res do
		-- DEBUG(res[i].last_menses_time)
		local strtime = res[i].last_menses_time;
		local date_ = string.sub(strtime, 1, string.find(strtime, " ") - 1)
		local year_ = string.sub(date_,1,4)
		local month_ = string.sub(date_,6,7)
		local day_ = string.sub(date_,9,10)
		-- DEBUG("date "..date_.." y "..year_.." m "..month_.." d "..day_)
		local tab = {year=tonumber(year_), month=tonumber(month_), day=tonumber(day_), hour=0,min=0,sec=0,isdst=false}
		local time_ = os.time(tab)
		-- DEBUG(time_)
		local diffsecond = os.difftime(current_time_,time_)
		-- DEBUG("diff = "..diffsecond)
		local diffday = diffsecond/(24*60*60)
		-- DEBUG("diffday = "..string.format("%.1f", diffday))
		local diffweeks = diffday/7
		-- DEBUG("diffweeks = "..string.format("%.1f", diffweeks))
		_jsontbl.web.user_list[i]["diffweeks"] = tonumber(string.format("%.1f", diffweeks))
		_jsontbl.web.user_list[i]["diffdays"] = (string.format("%.1f", diffweeks)).."周("..string.format("%d", diffday).."天)"
	end

	return _jsontbl
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	
	local _query_sql = "select * from customer where vip = 0 order by id asc"

	DEBUG("customer_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

