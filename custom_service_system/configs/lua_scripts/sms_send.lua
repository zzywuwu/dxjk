local http = require "socket.http"
local ltn12 = require "ltn12"

local function MysqlCallback(res)
	local _affected_rows = res.affected_rows
	if _affected_rows == 0 then
		return nil, WEBERR.NAME_OR_PASSWORD_ERR
	end
end

local function ParamCheck(post)
	if not post.web then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.web.content and post.web.id) then
		return false, WEBERR.PARAM_ERR
	end

	if not (post.web.content ~= '' and post.web.id ~= '') then
		return false, WEBERR.PARAM_ERR
	end

	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege) then
		return false, WEBERR.SESSION_TIMEOUT
	end

	-- if (common.BitAnd(post.session.privilege, 1) ~= 1) then
	-- 	return false, WEBERR.USER_PRIVILEGE_NOT_ENOUGH
	-- end

	return true
end

local function Execute(post)
	local _id = post.web.id
	local _content = post.web.content
	local _status = post.web.status
	local _phonenumber = post.web.phonenumber

	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR
		}
	}

	DEBUG("sms_send:")
	if _status == "Success" then
		INFO(post.session.name.." 发送成功 ".._phonenumber.." ".._content)
		local _query_sql = "update record set sms_count = (sms_count + 1) where id = "..ngx.quote_sql_str(_id)
		mysql.query(cloud_database, _query_sql, MysqlCallback)
	else
		ERROR(post.session.name.." 发送失败 ".._phonenumber.." ".._content)
		-- _jsontbl.web.error = WEBERR.SMS_SEND_ERR
		_jsontbl.web.error = post.web.message
	end

	return _jsontbl

end
local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M
