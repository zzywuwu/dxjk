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
    --1 for sunday
    local wday = date.wday
    -- if wday == 1 then
    --3:00~3:10
        if hour*60+min - 180 >= 0 and hour*60+min -190 < 0 then
            --do backup full
            --mysqldump --flush-logs -u$user -p$userPWD --quick $database| gzip >$DumpFile
            local command = "mysqldump --flush-logs --single-transaction --master-data=2 -uroot --quick dtjx > "..full_path..date.year.."_"..date.month.."_"..date.day..".sql"
        --print(command)
            os.execute(command)
            command = "echo "..date.year.."-"..date.month.."-"..date.day.."-"..date.hour.."-"..date.min.."-"..date.sec.." Done Full Backup >> "..full_path.."fulldb.log"  
        --print(command)
            os.execute(command)
        end
    -- end
end

local function BackupIncDB(time)
    local date = os.date("*t", time)
    local hour = date.hour
    local min = date.min
    local wday = date.wday
    --if wday ~= 1 then
        --if hour*60+min - 180 >= 0 and hour*60+min -190 < 0 then
        if hour*60+min - 300 >= 0 and hour*60+min - 310 < 0 then
            --do backup increment
            local day_3_ago = os.date("*t", time-60*60*24*3)
            local day_3_ago_str = day_3_ago.year..day_3_ago.month..day_3_ago.day..day_3_ago.hour..day_3_ago.min..day_3_ago.sec
            local command = "mysqladmin -uroot flush-logs && mysql -uroot -pserver -e \"purge master logs before "..day_3_ago_str.."\""
            os.execute(command)
            command = "cp /var/logs/mysql/dtjx-bin.* "..increment_path
            os.execute(command)
            command = "echo "..date.year.."-"..date.month.."-"..date.day.."-"..date.hour.."-"..date.min.."-"..date.sec.." Done Increament Backup >> "..increment_path.."incdb.log"
            os.execute(command)
            DeleteData()
        end
    --end
end

local function DeleteData()
    local command = string.format("find %s -name \"*.sql\" -type f -mtime +21 -exec rm {} \; > /dev/null 2>&1",full_path)
    os.execute(command)
    command = string.format("find %s -name \"dtjx-bin.*\" -type f -mtime +21 -exec rm {} \; > /dev/null 2>&1",increment_path)
    os.execute(command)
end
-------------------------main---------------------
CreateBakeupDir()
while true do
    local time = GetTimeNow()
    BackupFullDB(time)
    BackupIncDB(time)
    socket.select(nil, nil, 600)
end
