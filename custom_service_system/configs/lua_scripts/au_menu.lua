local function GetMenuTable(privilege)
	local _menu = {}
	local k = 1
	for i=1, #g_privilege do
		if common.BitAnd(privilege, g_privilege[i].value) == g_privilege[i].value then
			if g_privilege[i].jsontbl ~= nil then
				_menu[k] = g_privilege[i].jsontbl
				k = k + 1
			end
		end
	end
	if k == 1 then
		return _menu, WEBERR.USER_PRIVILEGE_ERR
	end
	
	return _menu
end

local function ParamCheck(post)
	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege and post.session.name) then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	return true
end

local function Execute(post)
	INFO("get menu, privilege = " .. post.session.privilege)
	local _menu, _err = GetMenuTable(post.session.privilege)
	if _err then
		return nil, _err
	end
	
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			name = post.session.name,
			menu = _menu
		}
	}
	return _jsontbl
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

