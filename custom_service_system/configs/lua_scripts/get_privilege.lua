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
	INFO("get privilege:" .. post.session.privilege)
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

