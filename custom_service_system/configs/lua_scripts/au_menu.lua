local function GetMenuTable(privilege)
	local _menu = {}
	local i = 1
	for k, v in pairs(g_privilege) do
		if common.BitAnd(privilege, v.value) == v.value then
			_menu[i] = v.jsontbl
			i = i + 1
		end
	end
	if i == 1 then
		return _menu, WEBERR.USER_PRIVILEGE_ERR
	end
	
	return _menu
end

local function ParamCheck(post)
	if not post.session then
		return false, WEBERR.PARAM_ERR
	end
	
	if not (post.session.privilege and post.session.name) then
		return false, WEBERR.PARAM_ERR
	end
	
	return true
end

local function Execute(post)
	INFO("get menu privilege:" .. post.session.privilege)
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

