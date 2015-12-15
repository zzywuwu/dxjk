local function QueryKey(res)

	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			user_info = {}	
		}
	}

	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return _jsontbl
	end

	local user_list = res

	for i=1,#user_list do
		local str = "姓名\t\t: "..user_list[i].name.."\n"..
					"年龄\t\t: "..user_list[i].age.."\n"..
					"电话\t\t: "..user_list[i].phonenumber.."\n"
					
		table.insert(_jsontbl.web.user_info,str)
	end

	if #user_list == 0 then
		table.insert(_jsontbl.web.user_info,"没有搜索到关键字！")
	end

	return _jsontbl

end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end

	if not post.web.key then
		return false, WEBERR.PARAM_ERR
	end

	return true
end

local function Execute(post)
	local _key = post.web.key

	local function MysqlCallback(res)

		local user_list = res

		if #user_list == 0 then
			local _query_sql = "select * from customer where vip < 2 and name LIKE '%".._key.."%'"
			DEBUG("wx_serach_customer: " .. _query_sql)
			return mysql.query(cloud_database, _query_sql, QueryKey)
		end

		local _jsontbl = {
			web = {
				error = WEBERR.NO_ERR,
				user_info = {}	
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
			local diffday = math.floor(diffsecond/(24*60*60)) + 1
			local diffweeks = math.floor(diffday/7).." + "..diffday%7
			user_list[i]["diffweeks"] = diffweeks
			user_list[i]["diffdays"] = diffweeks
		end

		for i=1,#user_list do
			local str = ""
			if (user_list[i].customer_type == "孕妈妈") then
				str = 	"姓名\t\t\t\t\t\t\t\t: "..user_list[i].name.."\n"..
						"年龄\t\t\t\t\t\t\t\t: "..user_list[i].age.."\n"..
						"电话\t\t\t\t\t\t\t\t:"..user_list[i].phonenumber.."\n"..
						"身份证\t\t\t\t :"..user_list[i].idnumber.."\n"..
						"微信号\t\t\t\t :"..user_list[i].wx.."\n"..
						"销售人员\t:"..user_list[i].sellname.."\n"..
						"孕周\t\t\t\t\t\t\t\t: "..user_list[i].diffweeks.."\n"..
						"建卡医生\t: "..user_list[i].doctor_name.."\n"..
						"预产期\t\t\t\t : "..string.sub(user_list[i].due_time,1,11).."\n"..
						"末次月经\t: "..string.sub(user_list[i].last_menses_time,1,11).."\n"..
						"家属\t\t\t\t\t\t\t\t: "..user_list[i].familyname.."\n"..
						"家属电话\t: "..user_list[i].familyphonenumber.."\n"..
						"地址\t\t\t\t\t\t\t\t: "..user_list[i].address.."\n"
			else
				str = 	"姓名\t\t\t\t\t\t\t\t: "..user_list[i].name.."\n"..
						"年龄\t\t\t\t\t\t\t\t: "..user_list[i].age.."\n"..
						"电话\t\t\t\t\t\t\t\t:"..user_list[i].phonenumber.."\n"..
						"身份证\t\t\t\t :"..user_list[i].idnumber.."\n"..
						"微信号\t\t\t\t :"..user_list[i].wx.."\n"..
						"销售人员\t:"..user_list[i].sellname.."\n"..
						"家属\t\t\t\t\t\t\t\t: "..user_list[i].familyname.."\n"..
						"家属电话\t: "..user_list[i].familyphonenumber.."\n"..
						"地址\t\t\t\t\t\t\t\t: "..user_list[i].address.."\n"

			end		
			table.insert(_jsontbl.web.user_info,str)
		end

		return _jsontbl
	end
	
	local _query_sql = "select * from customer where vip < 2 and (phonenumber = "..ngx.quote_sql_str(_key).." or name = "..ngx.quote_sql_str(_key)..")"

	INFO("wx_serach_customer: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M


