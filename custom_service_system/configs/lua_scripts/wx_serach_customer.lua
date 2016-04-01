local function get_customer_vip(vip)
	if (vip == 0) then
		return " (预签)"
	elseif (vip == 1) then
		return " (会员)"
	elseif (vip == 2) then
		return " (过期)"
	else
		return ""
	end
end

local function cal_link(ctime,uid)
	local link = ""
	local md5 = md5.sumhexa(ctime.."TSL")
	local md5sub8 = string.sub(md5,1,8)
	link = "http://139.129.133.155/s/i?p="..md5sub8..uid
	return link
end

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
		local str = "姓名\t\t: "..user_list[i].name..get_customer_vip(user_list[i].vip).." ID:"..user_list[i].id.."\n"..
					-- "类型\t\t: "..user_list[i].customer_type.."\n"..
					-- "年龄\t\t: "..user_list[i].age.."\n"..
					"电话\t\t: "..user_list[i].phonenumber.."\n"..
					"病历\t\t: "..cal_link(user_list[i].create_time,user_list[i].id).."\n"
					
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
		
		local current_time = os.time()
		local function cal_weeks(user,last_menses_time,due_time)
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
			user["diffweeks"] = diffweeks		
		end

		for i=1,#user_list do
			local str = ""
			if (user_list[i].customer_type == "孕妈妈") then
				cal_weeks(user_list[i],user_list[i].last_menses_time,user_list[i].due_time)
				str = 	"姓名\t\t\t\t\t\t\t\t: "..user_list[i].name..get_customer_vip(user_list[i].vip).." ID:"..user_list[i].id.."\n"..
						"年龄\t\t\t\t\t\t\t\t: "..user_list[i].age.."\n"..
						"就诊卡号\t:"..user_list[i].cordnumber.."\n"..
						"电话\t\t\t\t\t\t\t\t:"..user_list[i].phonenumber.."\n"..
						"身份证\t\t\t\t :"..user_list[i].idnumber.."\n"..
						"微信号\t\t\t\t :"..user_list[i].wx.."\n"..
						"销售人员\t:"..user_list[i].sellname.."\n"..
						"孕周\t\t\t\t\t\t\t\t: "..user_list[i].diffweeks.."\n"..
						"建卡医生\t: "..user_list[i].doctor_name.."\n"..
						"预产期\t\t\t\t : "..user_list[i].due_time.."\n"..
						"末次月经\t: "..user_list[i].last_menses_time.."\n"..
						"家属\t\t\t\t\t\t\t\t: "..user_list[i].familyname.."\n"..
						"家属电话\t: "..user_list[i].familyphonenumber.."\n"..
						"家属年龄\t: "..user_list[i].familyage.."\n"..
						"地址\t\t\t\t\t\t\t\t: "..user_list[i].address.."\n"..
						"备注\t\t\t\t\t\t\t\t: "..user_list[i].remarks.."\n"..
						"病历\t\t\t\t\t\t\t\t: "..cal_link(user_list[i].create_time,user_list[i].id).."\n"
			else
				str = 	"姓名\t\t\t\t\t\t\t\t: "..user_list[i].name..get_customer_vip(user_list[i].vip).." ID:"..user_list[i].id.."\n"..
						"年龄\t\t\t\t\t\t\t\t: "..user_list[i].age.."\n"..
						"就诊卡号\t:"..user_list[i].cordnumber.."\n"..
						"电话\t\t\t\t\t\t\t\t:"..user_list[i].phonenumber.."\n"..
						"性别\t\t\t\t\t\t\t\t:"..user_list[i].gender.."\n"..
						"身份证\t\t\t\t :"..user_list[i].idnumber.."\n"..
						"微信号\t\t\t\t :"..user_list[i].wx.."\n"..
						"销售人员\t:"..user_list[i].sellname.."\n"..
						"家属\t\t\t\t\t\t\t\t: "..user_list[i].familyname.."\n"..
						"家属电话\t: "..user_list[i].familyphonenumber.."\n"..
						"家属年龄\t: "..user_list[i].familyage.."\n"..
						"地址\t\t\t\t\t\t\t\t: "..user_list[i].address.."\n"..
						"备注\t\t\t\t\t\t\t\t: "..user_list[i].remarks.."\n"..
						"病历\t\t\t\t\t\t\t\t: "..cal_link(user_list[i].create_time,user_list[i].id).."\n"

			end		
			table.insert(_jsontbl.web.user_info,str)
		end

		return _jsontbl
	end
	
	local _query_sql = "select * from customer where (phonenumber = "..ngx.quote_sql_str(_key).." or name = "..ngx.quote_sql_str(_key).. " or id = "..ngx.quote_sql_str(_key)..")"

	INFO("wx_serach_customer: " .. _query_sql)
	return mysql.query(cloud_database, _query_sql, MysqlCallback)
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M


