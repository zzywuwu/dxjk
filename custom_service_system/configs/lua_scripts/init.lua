require("kf_debug")
mysql = require("connect_mysql")
common = require("common")
cjson = require("cjson")

local login = require("login")
local update_password = require("update_password")
local update_config = require("update_config")
local au_menu = require("au_menu")
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
	database = "cloud",
	user = "root",
	password = "server"
}

funcsinit = {
	login = login,
	update_password = update_password,
	update_config = update_config,
	au_menu = au_menu,
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

g_privilege = {
	admin = {
		value = 1,
		jsontbl = {
			title = "人员管理",
			url = "ac_index"
		}
	},
	kf_manager = {
		value = 2,
		jsontbl = {
			title = "客服管理",
			url = "kf_index"
		}
	},
	kf = {
		value = 4,
		jsontbl = {
			title = "处理问题单",
			url = "rd_index"
		}
	},
	inspedtor = {
		value = 8,
		jsontbl = {
			title = "查看报表",
			url = "rp_index"
		}
	},
	ver_manager = {
		value = 16,
		jsontbl = {
			title = "版本管理",
			child = {
				{title = "版本列表", url = "pd_list"},
				{title = "发布新版本", url = "pd_add"}
			}
		}
	},
	ad_manager = {
		value = 32,
		jsontbl = {
			title = "发布广告",
			url = "ad_index"
		}
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
	USER_NO_EXIST = "用户名不存在",
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
	SESSION_TIMEOUT = "长时间未操作,请重新登录"
}

DEBUGINIT("ngx_lua.log", 0)
