DROP DATABASE IF EXISTS dxjk;
CREATE DATABASE dxjk;
USE dxjk;

CREATE TABLE IF NOT EXISTS `user` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP DEFAULT NOW(),
        `update_time` TIMESTAMP DEFAULT NOW(),
        `last_login_time` TIMESTAMP DEFAULT NOW(),
        `status` VARCHAR(32)  DEFAULT 'not actived' NOT NULL,
        `privilege` INT NOT NULL DEFAULT 2046,
        `name` VARCHAR(32) NOT NULL,
        `password` VARCHAR(32) NOT NULL,
        `phonenumber` VARCHAR(32) NOT NULL,
        `wx` VARCHAR(32) DEFAULT '',
        PRIMARY KEY (`id`),
        UNIQUE KEY(`name`),
        KEY(`phonenumber`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `customer` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `update_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `name` VARCHAR(32) NOT NULL,
        `idnumber` VARCHAR(32) DEFAULT '',
        `phonenumber` VARCHAR(32) NOT NULL,
        `wx` VARCHAR(32) DEFAULT '',
        `svrname` VARCHAR(32) DEFAULT '',
        `sellname` VARCHAR(32) DEFAULT '',
        `doctor_name` VARCHAR(32) DEFAULT '',
        `last_menses_time` DATETIME NOT NULL DEFAULT NOW(),
        `due_time` DATETIME NOT NULL DEFAULT NOW(),
        `order_time` DATETIME DEFAULT NULL,
        `order_over_time` DATETIME DEFAULT NULL,
        `remarks` VARCHAR(128) DEFAULT '',
        `vip` INT DEFAULT 0,
        PRIMARY KEY (`id`),
        KEY(`name`),
        KEY(`phonenumber`),
        KEY(`svrname`),
        KEY(`sellname`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci; 

CREATE TABLE IF NOT EXISTS `event` (
        `customer_id` INT NOT NULL DEFAULT 0,
        `create_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `update_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `visit_time` DATETIME NOT NULL,
        `morning_or_noon` VARCHAR(32) DEFAULT '上午',
        `visit_type` VARCHAR(32) DEFAULT '',
        `order_success` INT DEFAULT 0,
        `result` VARCHAR(128) DEFAULT '',
        `doctor_advise` VARCHAR(128) DEFAULT '',
        `remarks` VARCHAR(128) DEFAULT '',	
        PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

use dxjk;


insert into user(name, password, phonenumber, wx, status) VALUES('邱容',  '123456', '13541235352', '',                     'not actived');
insert into user(name, password, phonenumber, wx, status) VALUES('张红莉','123456', '18908182406', '',                     'not actived');
insert into user(name, password, phonenumber, wx, status) VALUES('陈淘',  '123456', '15198073537', 'Caroline1468178921',   'not actived');
insert into user(name, password, phonenumber, wx, status) VALUES('吕环宇','123456', '13980870629', '',                     'not actived');
insert into user(name, password, phonenumber, wx, status) VALUES('余澜悦', '123456','13980870629', '',                     'not actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(2047, '王君',  '123456', '13980870629', 'zz830629',             'actived');
insert into user(name, password, phonenumber, wx, status) VALUES('余军',  '123456', '15108407210', 'huaxibaishitong',      'not actived');

insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, last_menses_time) VALUES('张三', '18012345678', '511002197903140617', '邱容', '王君', '游泳', 'zzy1121', '', 1, '2015-11-1');
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, last_menses_time) VALUES('李四', '18112345678', '511002197903140618', '邱容', '王君', '刘兴会', '785692', '', 0, '2015-10-1');
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, last_menses_time) VALUES('钱五', '18212345678', '511002197903140619', '邱容', '王君', '游泳', '3261451', '', 0, '2015-09-1');
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, last_menses_time) VALUES('王六', '18212345678', '511002197903140619', '邱容', '王君', '游泳', '3261451', '', 0, '2015-08-1');


insert into event(customer_id, visit_type, order_success, visit_time) VALUES(1, '建卡', 0, '2015-11-1 23:59:59');
insert into event(customer_id, visit_type, order_success, visit_time) VALUES(3, '建卡', 1, '2015-11-11 23:59:59');
insert into event(customer_id, visit_type, order_success, visit_time) VALUES(4, '建卡', 0, '2015-11-30 23:59:59');

