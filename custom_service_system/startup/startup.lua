local php_tbl = {
    sbin = "/usr/local/sbin/php-fpm",
    conf = "/opt/nginx/conf/php.ini",
    sub_conf = "/opt/nginx/conf/php-fpm.conf.default"
}
local nginx_tbl = {
    sbin = "/opt/nginx/sbin/nginx",
    conf = "/opt/nginx/conf/nginx.conf"
}

local consumer_tbl = {
    sbin = "lua /opt/nginx/sbin/consumersystem.lua"
}

local backupdb_tbl = {
    sbin = "lua /opt/nginx/sbin/backupdb.lua"
}

local program = {
    php = php_tbl,
    nginx = nginx_tbl,
    consumersystem = consumer_tbl,
    backupdb = backupdb_tbl
}

local function FindBasePos(str)
    local pos = string.find(str, "/")
    if not pos then
        return 0
    else
        while pos do
            pos = pos + 1 
            last_pos = pos 
            pos = string.find(str, "/", last_pos)
        end 
            return last_pos
    end 
end

local function PrintHelp()
    local str = "progress |"
    for k,v in pairs(program) do
        str = str..k.."|"
    end
    print(str)
end
    
local function start(program)
    for k,v in pairs(program) do
        local command = v.sbin
        if v.conf ~= nil then
            command = command.." -c "..v.conf
        end
        if v.sub_conf ~= nil then
            command = command.." -y "..v.sub_conf
        end
        command = command .. " &"
        print("execute command:"..command)
        os.execute(command)
    end
end

local function stop(program)
    for k,v in pairs(program) do
        local command = "kill"
        if string.find(v.sbin, "lua", 1) then
            command = command.." -9 `ps -ef | grep "..string.sub(v.sbin, 4).." | grep -v grep | awk '{print $2}'` "
        else
            local progress_name = string.sub(v.sbin, FindBasePos(v.sbin))
            command = command.."all "..progress_name
        end
        print("execute command:"..command)
        os.execute(command)
    end
end

local function status(program)
    for k,v in pairs(program) do
        local command = "ps -ef | grep "..string.sub(v.sbin, FindBasePos(v.sbin)).." | grep -v grep"
        if not string.find(v.sbin, "lua", 1) then
            command = command.." | grep -v lua"
        end
        print("execute command:"..command)
        os.execute(command)
    end
end

local function restart(program)
    stop(program)
    start(program)
end

local function ProgramStart()
    if arg[2] == nil then
        start(program)
    else 
        local progress = arg[2]
        if program[progress] == nil then
            PrintHelp()
            return
        end
        local _program = {
            progress = program[progress]
        }
        start(_program)
    end
end
 
local function ProgramStop()
    if arg[2] == nil then
        stop(program)
    else
        local progress = arg[2]
        if program[progress] == nil then
            PrintHelp()
            return
        end
        local _program = {
            progress = program[progress]
        }
        stop(_program)       
    end
end

local function ProgramRestart()
    if arg[2] == nil then
        restart(program)
    else
        local progress = arg[2]
        if program[progress] == nil then
            PrintHelp()
            return
        end
        local _program = {
            progress = program[progress]
        }
        restart(_program)
    end
end

local function ProgramStatus()
     if arg[2] == nil then
        status(program)
    else
        local progress = arg[2]
        if program[progress] == nil then
            PrintHelp()
            return
        end
        local _program = {
            progress = program[progress]
        }
        status(_program)
    end
end   
------------------------------------main--------------------------------
--[[if arg[1] == "start" then
    ProgramStart()
else]]
if arg[1] == "stop" then
    ProgramStop()
elseif arg[1] == "restart" then
    ProgramRestart()
elseif arg[1] == "status" then
    ProgramStatus()
else
    print("stop|restart|status")
    return
end
