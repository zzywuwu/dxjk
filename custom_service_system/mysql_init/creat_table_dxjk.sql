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
        `password` VARCHAR(32) DEFAULT NULL,
        `phonenumber` VARCHAR(32) NOT NULL,
        `wx` VARCHAR(32),
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
        `next_visit_time` TIMESTAMP NOT NULL DEFAULT NOW(),
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

CREATE TABLE IF NOT EXISTS `bingli` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `update_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `customer_id` INT NOT NULL DEFAULT 0,
        `visit_time` DATETIME NOT NULL DEFAULT NOW(),
        `doctor_advise` VARCHAR(128),
        `remarks` VARCHAR(128),	
        FOREIGN KEY (`customer_id`) REFERENCES customer(`id`),
        PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

use dxjk;

insert into user(privilege, name, password, phonenumber, wx, status) VALUES(7, '王君', '123456', '13980870629', 'wj0629', 'actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(6, '赵哥', '123456', '18081189210', 'zzywuwu', 'actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(6, '秋容', '123456', '13980870629', 'wj0629', 'not actived');

insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, next_visit_time) VALUES('张三', '18012345678', '511002197903140617', '赵哥', '秋容', '游泳', 'zzy1121', '老公是个程序员！', 1, "2015-11-30");
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, next_visit_time) VALUES('李四', '18112345678', '511002197903140618', '赵哥', '秋容', '刘兴慧', '785692', '弱不禁风', 0, "2015-11-20");
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, next_visit_time) VALUES('王麻子', '18212345678', '511002197903140619', '赵哥', '秋容', '游泳', '3261451', '大美女一个', 0, "2015-11-10");
insert into customer(name, phonenumber, idnumber, svrname, sellname, doctor_name, wx, remarks, vip, next_visit_time) VALUES('预售人员', '18212345678', '511002197903140619', '赵哥', '秋容', '游泳', '3261451', '大美女一个', 0, "2015-11-1");

insert into bingli(customer_id, doctor_advise, remarks) VALUES(1, '吃药1', '记得吃药');
insert into bingli(customer_id, doctor_advise, remarks) VALUES(1, '吃药2', '记得吃药');
insert into bingli(customer_id, doctor_advise, remarks) VALUES(1, '吃药3', '记得吃药');
insert into bingli(customer_id, doctor_advise, remarks) VALUES(1, '吃药4', '记得吃药');

