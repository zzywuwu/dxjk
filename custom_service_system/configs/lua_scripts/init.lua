require("kf_debug")

DEBUGINIT("ngx_lua.log", 0)

mysql = require("connect_mysql")
common = require("common")
cjson = require("cjson")

local login = require("login")
local update_password = require("update_password")
local au_menu = require("au_menu")

local customer_get_list = require("customer_get_list")
local customer_modify = require("customer_modify")
local customer_add = require("customer_add")
local customer_del = require("customer_del")
local customer_up = require("customer_up")
local get_privilege = require("get_privilege")
local vip_modify = require("vip_modify")
local vip_del = require("vip_del")
local vip_get_list = require("vip_get_list")
local event_add = require("event_add")
local event_get = require("event_get")
local event_get_all = require("event_get_all")
local get_no_event_user = require("get_no_event_user")

local update_config = require("update_config")
local ac_add = require("ac_add")
local ac_del = require("ac_del")
local ac_get_list = require("ac_get_list")
local ac_modify = require("ac_modify")
local ad_add = require("ad_add")
local ad_del = require("ad_del")
local ad_get_list = require("ad_get_list")
local pd_add = require("pd_add")
local pd_del = require("pd_del")
local pd_update = require("pd_update")
local pd_get_list = require("pd_get_list")
local rd_add = require("rd_add")
local rd_get_msg = require("rd_get_msg")
local rd_search = require("rd_search")

file_path = "/opt/nginx/html/temp/file/"
url_path = "/temp/file/"

mybit = {
	data32 = {}
}  
for i = 1, 32 do  
    mybit.data32[i] = 2^(32 - i)  
end

cloud_database = {
	host = "127.0.0.1",
	port = 3306,
	database = "dxjk",
	user = "root",
	password = ""
}

funcsinit = {

	login = login,
	update_password = update_password,
	au_menu = au_menu,

	customer_get_list = customer_get_list,
	customer_modify = customer_modify,
	customer_add = customer_add,
	customer_del = customer_del,
	customer_up = customer_up,
	get_privilege = get_privilege,
	vip_modify = vip_modify,
	vip_del = vip_del,
	vip_get_list = vip_get_list,
	event_add = event_add,
	event_get = event_get,
	event_get_all = event_get_all,
	get_no_event_user = get_no_event_user,

	update_config = update_config,
	ac_add = ac_add,
	ac_del = ac_del,
	ac_get_list = ac_get_list,
	ac_modify = ac_modify,
	ad_add = ad_add,
	ad_del = ad_del,
	ad_get_list = ad_get_list,
	pd_add = pd_add,
	pd_del = pd_del,
	pd_update = pd_update,
	pd_get_list = pd_get_list,
	rd_add = rd_add,
	rd_get_msg = rd_get_msg,
	rd_search = rd_search
}

g_privilege = {};

g_privilege[1] = {
				value = 1
			}

g_privilege[2] = {
				value = 2,
				jsontbl = {
					title = "会员管理",
					url = "vip_index"
				}
			}

g_privilege[3] = {
				value = 4,
				jsontbl = {
					title = "预签客户",
					url = "customer_index"
				}
			}

g_privilege[4] = {
				value = 8,
				jsontbl = {
					title = "人员管理",
					url = "ac_index"
				}
			}

g_privilege[5] = {
				value = 16,
				jsontbl = {
					title = "日历",
					url = "calendar_index"
				}
			}


WEBERR = {
	NO_ERR = "成功",
	PARAM_ERR = "参数不正确",
	IDCODE_ERR = "验证码不正确",
	IDCODE_TIMEOUT = "验证码超时",
	NAME_OR_PASSWORD_ERR = "用户名不存在或密码错误",
	MYSQL_OBJ_ERR = "创建数据库对象出错",
	MYSQL_CONNECT_FAIL = "连接数据库失败",
	MYSQL_QUERY_FAIL = "数据库语句出错",
	ACCOUNT_NOT_ACTIVE = "帐号未激活",
	USER_PRIVILEGE_ERR = "用户权限值不对",
	USER_ALREADY_EXIST = "用户已存在",
	USER_NO_EXIST = "用户不存在",
	NO_USER_PRIVIDED = "未提交用户",
	NO_AD_PRIVIDED = "未提交广告",
	NO_VER_PRIVIDED = "未提交版本号",
	VER_NO_EXIST = "版本号不存在",
	VER_ID_NO_EXIST = "版本id不存在",
	VER_ALREADY_EXIST = "版本号已经存在",
	FATHER_VER_EXIST = "有父版本存在,不能进行删除,请先修改升级逻辑",
	RD_ID_NO_EXIST = "问题单ID不存在",
	RD_EMPTY = "问题单为空",
	MESSAGE_ALREADY_EXIST = "消息已存在",
	MESSAGE_NO_EXIST = "消息不存在",
	KEY_ALREADY_EXIST = "MYSQL主键已经存在",
	SESSION_TIMEOUT = "长时间未操作,请重新登录",
	USER_PRIVILEGE_NOT_ENOUGH = "你没有权限进行此操作"
}


