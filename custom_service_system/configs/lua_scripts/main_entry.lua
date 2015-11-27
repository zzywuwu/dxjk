local _post_tbl = common.GetPostTbl()
if not _post_tbl then
	return common.ErrToJson(WEBERR.PARAM_ERR)
else
	if not _post_tbl.web then
		ERROR(WEBERR.PARAM_ERR)
		return common.ErrToJson(WEBERR.PARAM_ERR)
	else
		if not _post_tbl.web.script then
			ERROR(WEBERR.PARAM_ERR)
			return common.ErrToJson(WEBERR.PARAM_ERR)
		end
	end
end

local _funcs = funcsinit[_post_tbl.web.script]
if not _funcs then
	ERROR(WEBERR.PARAM_ERR)
	return common.ErrToJson(WEBERR.PARAM_ERR)
end

if not _post_tbl.session then
 	ERROR(WEBERR.SESSION_TIMEOUT)
	return common.ErrToJson(WEBERR.SESSION_TIMEOUT)
end
	
if not (_post_tbl.session.privilege) then
	ERROR(WEBERR.SESSION_TIMEOUT)
	return common.ErrToJson(WEBERR.SESSION_TIMEOUT)
end

DEBUG("Begin Execute " .. _post_tbl.web.script)
local _res, _err = _funcs.ParamCheck(_post_tbl)
if not _res then
	ERROR(_post_tbl.web.script .. " " .. _err)
	return common.ErrToJson(_err)
end

local _res, _err = _funcs.Execute(_post_tbl)
if not _res then
	ERROR(_post_tbl.web.script .. " " .. _err)
	return common.ErrToJson(_err)
else
	DEBUG("Execute " .. _post_tbl.web.script .. " success")
	return common.SuccessToJson(_res)
end

