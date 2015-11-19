local _mysql = require("resty.mysql")

local function query(database, query_str, callback)
	local _db, _err = _mysql:new()
	if not _db then
		return nil, WEBERR.MYSQL_OBJ_ERR
	end
	_db:set_timeout(1000)
	local _res, _err, _errno, _sqlstate = _db:connect(database)
	if not _res then
		_db:close()
		return nil, WEBERR.MYSQL_CONNECT_FAIL
	end
	
	local _res,_err,_errno,_sqlstate = _db:query(query_str)
	if not _res then
		local _sqlerr
		if _errno == 1062 then
			_sqlerr = WEBERR.KEY_ALREADY_EXIST
		else
			_sqlerr = WEBERR.MYSQL_QUERY_FAIL
		end
		return nil, _sqlerr
	end
	_db:set_keepalive()
	
	return callback(_res)
end

local function connect(props)
	local _db, _err = _mysql:new()
	if not _db then
		return nil, WEBERR.MYSQL_OBJ_ERR
	end
	_db:set_timeout(1000)
	local _res, _err, _errno, _sqlstate = _db:connect(props)
	if not _res then
		_db:close()
		return nil, WEBERR.MYSQL_CONNECT_FAIL
	end
	return _db
end
	
local function close(db)
	if not db then
		return
	end
	db:close()
	return
end

local _M = {
	connect = connect,
	query = query,
	close = close
}

return _M
