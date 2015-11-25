local function MysqlCallback(res)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_list = res
		}
	}
	
	local current_time_ = os.time()
	for i=1,#res do
		local strtime = res[i].last_menses_time;
		local date_ = string.sub(strtime, 1, string.find(strtime, " ") - 1)
		local year_ = string.sub(date_,1,4)
		local month_ = string.sub(date_,6,7)
		local day_ = string.sub(date_,9,10)
		local tab = {year=tonumber(year_), month=tonumber(month_), day=tonumber(day_), hour=0,min=0,sec=0,isdst=false}
		local time_ = os.time(tab)
		local diffsecond = os.difftime(current_time_,time_)
		local diffday = diffsecond/(24*60*60)
		local diffweeks = diffday/7
		_jsontbl.web.user_list[i]["diffday"] = tonumber(string.format("%.1f", diffday))
		_jsontbl.web.user_list[i]["diffweeks"] = tonumber(string.format("%.1f", diffweeks))
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
	
	local _query_sql = "select * from customer where vip = 1 order by id asc"

	DEBUG("vid_get_list: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

