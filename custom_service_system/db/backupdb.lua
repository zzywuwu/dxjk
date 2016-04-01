package.path = package.path..";/usr/lib64/lua/5.1/?.lua;/opt/nginx/lua_scripts/?.lua;/usr/local/share/lua/5.1/?.lua"
package.cpath = package.cpath..";/usr/lib64/lua/5.1/?.so;/usr/local/lib/lua/5.1/?.so;/usr/local/share/lua/5.1/?.so"
require("socket")

local full_path = "/var/logs/fullbackup/"
local increment_path = "/var/logs/incrementbackup/"

local function GetTimeNow()
    return os.time()
end
local function CreateBakeupDir()
    os.execute("mkdir -p "..full_path)
    os.execute("mkdir -p "..increment_path)
end

local function BackupFullDB(time)
    local date = os.date("*t", time)
    local hour = date.hour
    local min = date.min 
    local wday = date.wday
    if hour*60+min - 180 >= 0 and hour*60+min -190 < 0 then
    	local command = "mysqldump --flush-logs --single-transaction --master-data=2 -uroot --quick dtjx > "..full_path..date.year.."_"..date.month.."_"..date.day..".sql"
        os.execute(command)
        command = "echo "..date.year.."-"..date.month.."-"..date.day.."-"..date.hour.."-"..date.min.."-"..date.sec.." Done Full Backup >> "..full_path.."fulldb.log"  
        os.execute(command)
    end
end


local function DeleteData()
    local command = string.format("find %s -name \"*.sql\" -type f -mtime +2 -exec rm {} \\; > /dev/null 2>&1",full_path)
    os.execute(command)
    command = string.format("find %s -name \"dtjx-bin.*\" -type f -mtime +2 -exec rm {} \\; > /dev/null 2>&1",increment_path)
    os.execute(command)
end


local function BackupIncDB(time)
    local date = os.date("*t", time)
    local hour = date.hour
    local min = date.min
    local wday = date.wday
    if hour*60+min - 300 >= 0 and hour*60+min - 310 < 0 then
        local day_2_ago = os.date("*t", time-60*60*24*2)
        local day_2_m = string.format("%02d",day_2_ago.month)
        local day_2_d = string.format("%02d",day_2_ago.day)
        local day_2_ago_str = day_2_ago.year..day_2_m..day_2_d
        local command = "mysql -uroot -e \"purge master logs before "..day_2_ago_str.."\""
        os.execute(command)
        command = "cp -a /var/logs/mysql/dtjx-bin.* "..increment_path
        os.execute(command)
        command = "echo "..date.year.."-"..date.month.."-"..date.day.."-"..date.hour.."-"..date.min.."-"..date.sec.." Done Increament Backup >> "..increment_path.."incdb.log"
        os.execute(command)
        DeleteData()
    end
end

-------------------------main---------------------
CreateBakeupDir()
while true do
    local time = GetTimeNow()
    BackupFullDB(time)
    BackupIncDB(time)
    socket.select(nil, nil, 600)
end
