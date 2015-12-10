local debug_file
local debug_level

local function FindScriptPos(str)
    local pos = string.find(str, "/")
    if not pos then
        return 0
    else
        while pos do
            pos = pos + 1
            last_pos = pos
            pos = string.find(str, "/", pos + 1)
        end
        return last_pos
    end
end

function DEBUGINIT(filename, level)
    local file_path = "/var/log/"..filename
    debug_file = io.open(file_path, "a+")
    debug_level = level
end

function INFO(str)
    local time = os.date("%Y-%m-%d %H:%M:%S")
    local func = debug.getinfo(2).name
    local script_path = debug.getinfo(2).short_src
    local script = string.sub(script_path, FindScriptPos(script_path))
    local line = debug.getinfo(2).currentline
    if not func then
        func = "Main"
    end
    local format_str = string.format("%s ".."\27[1;33m".."[INFO ]".."\27[m".."\27[1;36m".."[%-28s][%-28s][%-4s]"
                                                    .."\27[m".."\27[1;33m".." %s" .."\27[m\n", time, script, func, line, str)
    debug_file:write(format_str)
    debug_file:flush()
end

function ERROR(str)
    local time = os.date("%Y-%m-%d %H:%M:%S")
    local func = debug.getinfo(2).name
    local script_path = debug.getinfo(2).short_src
    local script = string.sub(script_path, FindScriptPos(script_path))
    local line = debug.getinfo(2).currentline
    if not func then
        func = "Main"
    end
    local format_str = string.format("%s ".."\27[1;31m".."[ERROR]".."\27[m".."\27[1;36m".."[%-28s][%-28s][%-4s]"
                                                    .."\27[m".."\27[1;31m".." %s" .."\27[m\n", time, script, func, line, str)
    debug_file:write(format_str)
    debug_file:flush()
end

function WARN(str)
    local time = os.date("%Y-%m-%d %H:%M:%S")
    local func = debug.getinfo(2).name
    local script_path = debug.getinfo(2).short_src
    local script = string.sub(script_path, FindScriptPos(script_path))
    local line = debug.getinfo(2).currentline
    if not func then
        func = "Main"
    end
    local format_str = string.format("%s ".."\27[1;35m".."[WARN ]".."\27[m".."\27[1;36m".."[%-28s][%-28s][%-4s]"
                                                    .."\27[m".."\27[1;35m".." %s" .."\27[m\n", time, script, func, line, str)
    debug_file:write(format_str)
    debug_file:flush()
end

function DEBUG(str)
    if debug_level == 0 then
        local time = os.date("%Y-%m-%d %H:%M:%S")
        local func = debug.getinfo(2).name
        local script_path = debug.getinfo(2).short_src
        local script = string.sub(script_path, FindScriptPos(script_path))
        local line = debug.getinfo(2).currentline
        if not func then
            func = "Main"
        end
        local format_str = string.format("%s ".."\27[1;32m".."[DEBUG]".."\27[m".."\27[1;36m".."[%-28s][%-28s][%-4s]"
                                                    .."\27[m".."\27[1;32m".." %s" .."\27[m\n", time, script, func, line, str)
        debug_file:write(format_str)
        debug_file:flush()
    end
end

function DEBUGCLOSE()
    io.close(debug_file)
end
