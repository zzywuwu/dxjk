local _redis = require("resty.redis")

local function connect(props)
	local _red = _redis:new()
	
	_red:set_timeout(1000)
	local _res, _err = _red:connect(props.ip, props.port)
	if not _res then
		_red:close()
		return nil
	end
	return _red
end
	
local function publish(props, channel, msg)
	if props and channel and msg then
		local _redis = connect(props)
		if _redis then
			local _res, _err = _redis:publish(channel, msg)
			_redis:set_keepalive()
			return _res, _err
		end
	end
	return nil
end

local function close(red)
	if not red then
		return
	end
	return red:close()
end

local _M = {
	publish = publish
}

return _M
