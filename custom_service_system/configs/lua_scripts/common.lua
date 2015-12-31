local function ErrToJson(err_id)
	local json_tbl = {
		web = {
			error = err_id
		}
	}
    return ngx.print(cjson.encode(json_tbl))
end

local function SuccessToJson(res)
	return ngx.print(cjson.encode(res))
end

local function GetPostTbl()
	ngx.req.read_body()
	local _data = ngx.req.get_body_data()
	if not _data then
		return nil
	end
	return cjson.decode(_data)
end

local function DoubleToBit(double)
	local _bit = {}
	for i = 1, 32 do  
        if double >= mybit.data32[i] then  
			_bit[i] = 1  
			double = double - mybit.data32[i]  
		else  
			_bit[i] = 0  
        end  
    end  
	return _bit
end

local function BitToDouble(bit)
	local _double = 0  
	for i = 1, 32 do  
		if bit[i] == 1 then  
		_double = _double + 2^(32-i)  
		end  
	end  
	return _double 
end

local function BitAnd(a, b)
	local _bit_a = DoubleToBit(a)  
	local _bit_b = DoubleToBit(b)  
	local _bit_r = {}  

	for i = 1, 32 do  
		if _bit_a[i] == 1 and _bit_b[i] == 1  then  
			_bit_r[i] = 1  
		else  
			_bit_r[i] = 0  
		end  
	end  
	return  BitToDouble(_bit_r)  
end

local function ClearCache(model)
	local _m = funcsinit[model]
	if _m then
		_m.cache  = {}
	end
end

local function SetCache(model,cache)
	local _m = funcsinit[model]
	if _m then
		_m.cache = cache
	end
end

local function GetCache(model)	
	local _m = funcsinit[model]
	if _m then
		return _m.cache
	end
end

local function getFileName(str)  
    local idx = str:match(".+()%.%w+$")  
    if(idx) then  
        return string.lower(str:sub(1, idx-1))  
    else  
        return string.lower(str)  
    end  
end 

local function getExtension(str)
    return string.lower(str:match(".+%.(%w+)$"))
end

local _M = {
	ErrToJson = ErrToJson,
	SuccessToJson = SuccessToJson,
	GetPostTbl = GetPostTbl,
	BitAnd = BitAnd,
	ClearCache = ClearCache,
	SetCache = SetCache,
	GetCache = GetCache,
	getFileName = getFileName,
	getExtension = getExtension
}

return _M
