.PHONY: all
PREFIX_DIR = /opt/nginx
CUR_DIR = $(shell pwd)

LUA_JIT_DIR = LuaJIT-2.0.2
LUA_CJSON = lua-cjson-2.1.0
LUA_SQL = luasql-2.3.0
LUA_REDIS = redis-lua-2.0.4
LUA_SOCKET = luasocket-2.0.2
RESTY_MYSQL = lua-resty-mysql-0.15
RESTY_REDIS = lua-resty-redis-0.21
NGX_VER = nginx-1.8.0
NGX_DEV_KIT = ngx_devel_kit-0.2.19
NGX_LUA_MODULE = lua-nginx-module-0.9.16
NGX_ECHO = echo-nginx-module-0.58
NGX_SET_MISC = set-misc-nginx-module-0.29
NGX_PUSH_STREAM = nginx-push-stream-module-0.5.1


PHP_PREFIX = /usr/local
PHP_VER = php-5.6.13

CI_VER = CodeIgniter-3.0.0

default : all
all:nginx php ci config
nginx:
	@cd ../tools; \
	tar -xvf $(LUA_JIT_DIR).tar.gz; \
	tar -xvf $(RESTY_MYSQL).tar.gz; \
	tar -xvf $(RESTY_REDIS).tar.gz; \
	tar -xvf $(LUA_CJSON).tar.gz; \
	tar -xvf $(LUA_SQL).tar.gz; \
	tar -xvf $(LUA_REDIS).tar.gz; \
	tar -xvf $(LUA_SOCKET).tar.gz; \
	cd $(LUA_JIT_DIR); \
	make install PREFIX=/usr/local/luajit; \
	export LUAJIT_LIB=/usr/local/luajit/lib; \
	export LUAJIT_INC=/usr/local/luajit/include/luajit-2.0; \
	export LD_LIBRARY_PATH=/usr/local/luajit/lib:$$LD_LIBRARY_PATH; \
	cd ../$(RESTY_MYSQL); \
	make install LUA_INCLUDE_DIR=$(LUAJIT_INC) LUA_LIB_DIR=/usr/local/luajit/share/luajit-2.0.2; \
	echo "export LD_LIBRARY_PATH=/usr/local/luajit/lib:$$LD_LIBRARY_PATH" >> ~/.bashrc; \
	cd ../$(RESTY_REDIS); \
	make install LUA_INCLUDE_DIR=$(LUAJIT_INC) LUA_LIB_DIR=/usr/local/luajit/share/luajit-2.0.2; \
	cd ../$(LUA_CJSON); \
	make install LUA_CMODULE_DIR=/usr/local/luajit/lib/lua/5.1/ LUA_INCLUDE_DIR=/usr/local/luajit/include/luajit-2.0/; \
	cd ../$(LUA_SQL); \
	export LIBRARY_PATH=/usr/lib64/mysql:$$LIBRARY_PATH; \
	make; \
	make install LUA_LIBDIR=/usr/local/luajit/lib/lua/5.1; \
	cd ../$(LUA_REDIS); \
	\cp src/redis.lua /usr/local/luajit/share/luajit-2.0.2/; \
	cd ../$(LUA_SOCKET); \
	make; \
	make install INSTALL_TOP_SHARE=/usr/local/luajit/share/luajit-2.0.2 INSTALL_TOP_LIB=/usr/local/luajit/lib; \
	cd ..; \
	tar -xvf $(NGX_VER).tar.gz; \
	tar -xvf $(NGX_DEV_KIT).tar.gz; \
	tar -xvf $(NGX_LUA_MODULE).tar.gz; \
	tar -xvf $(NGX_ECHO).tar.gz; \
	tar -xvf $(NGX_SET_MISC).tar.gz; \
	tar -xvf $(NGX_PUSH_STREAM).tar.gz; \
	cd $(NGX_VER); \
	./configure --prefix=$(PREFIX_DIR) --add-module=$(CUR_DIR)/../tools/$(NGX_DEV_KIT) --add-module=$(CUR_DIR)/../tools/$(NGX_LUA_MODULE) --add-module=$(CUR_DIR)/../tools/$(NGX_ECHO) --add-module=$(CUR_DIR)/../tools/$(NGX_SET_MISC) --add-module=$(CUR_DIR)/../tools/$(NGX_PUSH_STREAM); \
	make -j2; \
	make install; \
	
php:nginx
	@echo "install php"; \
	cd ../tools; \
	tar -xvf $(PHP_VER).tar.gz; \
	cd $(PHP_VER); \
	./configure --prefix=/usr/local  --enable-fpm --with-mcrypt \
		--enable-mbstring --disable-pdo --with-curl --disable-debug  --disable-rpath \
		--enable-inline-optimization --with-bz2  --with-zlib --enable-sockets \
		--enable-sysvsem --enable-sysvshm --enable-pcntl --enable-mbregex \
		--enable-zip --with-pcre-regex --with-mysql --with-mysqli \
		--with-gd --with-jpeg-dir --with-openssl; \
	make && make install; \
	cp $(CUR_DIR)/configs/php/php.ini /usr/local/etc/php.ini; 

ci:php
	@echo "install ci"; \
	cd ../tools; \
	unzip $(CI_VER).zip; \
	cp -rf $(CI_VER)/application $(CI_VER)/system $(CI_VER)/index.php $(PREFIX_DIR)/html; \

config:
	@echo "copy config file,lua scripts and html files"; \
	\cp -rf configs/php/* $(PREFIX_DIR)/conf/; \
	\cp -rf configs/conf/ $(PREFIX_DIR); \
	\cp -rf configs/lua_scripts/ $(PREFIX_DIR); \
	\cp -rf configs/html/ $(PREFIX_DIR); \
	\cp -rf configs/consumersystem/consumersystem.lua $(PREFIX_DIR)/sbin/; \
	\cp -rf	startup/startup.lua $(PREFIX_DIR)/sbin/; \
	\cp -rf	db/backupdb.lua $(PREFIX_DIR)/sbin/; \
	\chmod +x $(PREFIX_DIR)/sbin/startup.lua; \
	\chmod +x $(PREFIX_DIR)/sbin/backupdb.lua; \
	mkdir $(PREFIX_DIR)/html/temp; \
	mkdir $(PREFIX_DIR)/html/temp/file; \
	mkdir $(PREFIX_DIR)/html/temp/log; \
	mkdir $(PREFIX_DIR)/html/temp/captcha;

clean:
	@cd ../tools/; \
	rm -rf $(LUA_JIT_DIR); \
	rm -rf $(NGX_VER); \
	rm -rf $(NGX_DEV_KIT); \
	rm -rf $(NGX_LUA_MODULE); \
	rm -rf $(NGX_ECHO); \
	rm -rf $(NGX_SET_MISC); \
	rm -rf $(NGX_PUSH_STREAM); \
	rm -rf $(PHP_VER); \
	rm -rf $(CI_VER); \
	rm -rf $(RESTY_MYSQL); \
	rm -rf $(RESTY_REDIS); \
	rm -rf $(LUA_CJSON); \
	rm -rf $(LUA_SQL); \
	rm -rf $(LUA_REDIS); \
	rm -rf $(LUA_SOCKET); \
