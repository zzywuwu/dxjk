require("kf_debug")

DEBUGINIT("ngx_lua.log", 1)

mysql = require("connect_mysql")
redis = require("connect_redis")
tcp = require("connect_tcp_svr")
common = require("common")
cjson = require("cjson")

local login = require("login")
local update_password = require("update_password")
local au_menu = require("au_menu")

local customer_get_list = require("customer_get_list")
local customer_modify = require("customer_modify")
local customer_add = require("customer_add")
local customer_del = require("customer_del")
local customer_upvip = require("customer_upvip")
local customer_remove = require("customer_remove")
local customer_remove_get_list = require("customer_remove_get_list")
local customer_reserver = require("customer_reserver")
local customer_query_by_id = require("customer_query_by_id")
local get_privilege = require("get_privilege")
local vip_modify = require("vip_modify")
local vip_remove = require("vip_remove")
local vip_get_list = require("vip_get_list")
local event_add = require("event_add")
local event_get_list = require("event_get_list")
local event_modify = require("event_modify")
local get_no_event_user_list = require("get_no_event_user_list")
local record_get_list = require("record_get_list")
local record_del = require("record_del")
local record_modify = require("record_modify")
local record_verify = require("record_verify")
local record_get_list_verify = require("record_get_list_verify")
local record_review = require("record_review")
local record_query_by_id = require("record_query_by_id")
local ac_add = require("ac_add")
local ac_modify = require("ac_modify")
local ac_del = require("ac_del")
local ac_get_list = require("ac_get_list")
local wx_serach_customer = require("wx_serach_customer")
local record_upload_image = require("record_upload_image")

file_path = "/var/logs/"
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
	database = "dtjx",
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
	customer_upvip = customer_upvip,
	customer_remove = customer_remove,
	customer_remove_get_list = customer_remove_get_list,
	customer_reserver = customer_reserver,
	customer_query_by_id = customer_query_by_id,
	get_privilege = get_privilege,
	vip_modify = vip_modify,
	vip_remove = vip_remove,
	vip_get_list = vip_get_list,
	event_add = event_add,
	event_get = event_get,
	event_get_list = event_get_list,
	event_modify = event_modify,
	get_no_event_user_list = get_no_event_user_list,
	record_get_list = record_get_list,
	record_del = record_del,
	record_modify = record_modify,
	record_verify = record_verify,
	record_get_list_verify = record_get_list_verify,
	record_upload_image = record_upload_image,
	record_review = record_review,
	record_query_by_id = record_query_by_id,
	ac_add = ac_add,
	ac_modify = ac_modify,
	ac_del = ac_del,
	ac_get_list = ac_get_list,
	wx_serach_customer = wx_serach_customer
	
}

g_privilege = {};

g_privilege[1] = {
				value = 16,
				jsontbl = {
					title = "工作日程",
					url = "calendar",
					img = "icon-list-alt"
				}
			}

g_privilege[2] = {
				value = 2,
				jsontbl = {
					title = "会员管理",
					url = "vip",
					img = "icon-user"
				}
			}

g_privilege[3] = {
				value = 4,
				jsontbl = {
					title = "预签客户",
					url = "customer",
					img = "icon-phone"
				}
			}

g_privilege[4] = {
				value = 64,
				jsontbl = {
					title = "陪诊记录",
					url = "record_verify",
					img = "icon-book"
				}
			}

g_privilege[5] = {
				value = 8,
				jsontbl = {
					title = "人员管理",
					url = "ac",
					img = "icon-eye-open"
				}
			}

g_privilege[6] = {
				value = 128,
				jsontbl = {
					title = "过期客户",
					url = "customer_remove",
					img = "icon-dropbox"
				}
			}

g_privilege[7] = {
				value = 1
				-- 会员升级和会员过期权限
			}

g_privilege[8] = {
				value = 32,
				--审核病历的权限 & 修改他人创建的未审核的病历
			}

-- g_privilege[9] = {
-- 				value = 256,
-- 				jsontbl = {
-- 					title = "上传",
-- 					url = "upload",
-- 					img = "icon-dropbox"
-- 				}
-- 			}


WEBERR = {
	NO_ERR = "成功",
	PARAM_ERR = "参数不正确",
	IDCODE_ERR = "验证码不正确",
	IDCODE_TIMEOUT = "验证码超时",
	NAME_OR_PASSWORD_ERR = "用户名不存在或密码错误",
	MYSQL_OBJ_ERR = "创建数据库对象出错",
	MYSQL_CONNECT_FAIL = "连接数据库失败",
	MYSQL_QUERY_FAIL = "输入的数据有问题,或者太长",
	ACCOUNT_NOT_ACTIVE = "帐号未激活",
	USER_PRIVILEGE_ERR = "用户权限值不对",
	USER_ALREADY_EXIST = "用户已存在",
	USER_NO_EXIST = "用户不存在",
	KEY_ALREADY_EXIST = "电话号码已经存在,请核对信息",
	SESSION_TIMEOUT = "长时间未操作,请重新登录",
	USER_PRIVILEGE_NOT_ENOUGH = "你没有权限进行此操作",
	DEL_USER_SELF = "不能删除自己",
	CUSTOMER_DONT_UP_VIP = "普通客户不能升级为会员",
	DONT_DELETE_CUSTOMER = "拥有记录或事件不能删除"
}

