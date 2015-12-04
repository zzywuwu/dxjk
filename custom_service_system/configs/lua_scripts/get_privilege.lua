local function ParamCheck(post)
	if not post.session then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	if not (post.session.privilege) then
		return false, WEBERR.SESSION_TIMEOUT
	end
	
	return true
end

local function Execute(post)
	DEBUG("get_privilege: " .. post.session.privilege)
	local _jsontbl = {
		web = {
			error = WEBERR.NO_ERR,
			privilege = post.session.privilege
		}
	}
	return _jsontbl
end

local _M = {
	ParamCheck = ParamCheck,
	Execute = Execute
}

return _M

