local function connect(props)
	if not (props.addr and props.port) then
		return nil
	end
	local _tcp = ngx.socket.tcp()
	local _res, _err = _tcp:connect(props.addr, props.port)
	if not _res then
		_tcp:close()
		return nil
	end
	_tcp:settimeout(5000)
	return _tcp
end
	
local function send(props, msg)
	if props and msg then
		local _tcp = connect(props)
		if _tcp then
			local _bytes, _err = _tcp:send(msg)
			_tcp:setkeepalive()
			return _bytes, _err
		end
	end
	return nil
end

local function close(tcp)
	if not tcp then
		return
	end
	return tcp:close()
end

local _M = {
	send = send
}

return _M
