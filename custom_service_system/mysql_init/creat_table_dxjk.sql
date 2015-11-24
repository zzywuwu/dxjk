DROP DATABASE IF EXISTS dxjk;
CREATE DATABASE dxjk;
USE dxjk;

CREATE TABLE IF NOT EXISTS `user` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP DEFAULT NOW(),
        `update_time` TIMESTAMP DEFAULT NOW(),
        `last_login_time` TIMESTAMP DEFAULT NOW(),
        `status` VARCHAR(32)  DEFAULT 'not actived' NOT NULL,
        `privilege` INT NOT NULL DEFAULT 0,
        `name` VARCHAR(32) NOT NULL,
        `password` VARCHAR(32) NOT NULL,
        `phonenumber` VARCHAR(32) NOT NULL,
        `wx` VARCHAR(32) DEFAULT '',
        PRIMARY KEY (`id`),
        KEY(`name`),
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
        `next_visit_order` INT DEFAULT 0,
        `last_menses_time` DATETIME NOT NULL DEFAULT NOW(),
        `due_time` DATETIME NOT NULL DEFAULT NOW(),
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

insert into user(privilege, name, password, phonenumber, wx, status) VALUES(31, '王君', '123456', '13980870629', 'wj0629', 'actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(22, '赵哥', '123456', '18081189210', 'zzywuwu', 'actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(22, '邱容', '123456', '13980870629', 'wj0629', 'not actived');

insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip) VALUES('张三', '18012345678', '511002197903140617', '赵哥', '邱容', '游泳', 'zzy1121', '', 1);
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip) VALUES('李四', '18112345678', '511002197903140618', '赵哥', '邱容', '刘兴慧', '785692', '', 0);
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip) VALUES('钱五', '18212345678', '511002197903140619', '赵哥', '邱容', '游泳', '3261451', '', 0);
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip) VALUES('王六', '18212345678', '511002197903140619', '赵哥', '邱容', '游泳', '3261451', '', 0);


insert into event(customer_id, visit_type, order_success, visit_time) VALUES(1, '建卡', 0, NOW());
insert into event(customer_id, visit_type, order_success, visit_time) VALUES(3, '建卡', 1, NOW());
insert into event(customer_id, visit_type, order_success, visit_time) VALUES(4, '建卡', 0, NOW());

