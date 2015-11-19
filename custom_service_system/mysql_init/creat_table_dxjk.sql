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
		`idnumber` VARCHAR(32) NOT NULL,
		`phonenumber` VARCHAR(32) NOT NULL,
		`wx` VARCHAR(32),
		`email` VARCHAR(32) DEFAULT NULL,
		`user_id` INT NOT NULL DEFAULT 0,
		`doctor_name` VARCHAR(32) NOT NULL,
		`next_visit_time` TIMESTAMP NOT NULL DEFAULT NOW(),
		 FOREIGN KEY (`user_id`) REFERENCES user(`id`),
         PRIMARY KEY (`id`),
		 KEY(`name`),
		 KEY(`phonenumber`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci; 

CREATE TABLE IF NOT EXISTS `bingli` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `create_time` TIMESTAMP NOT NULL DEFAULT NOW(),
        `update_time` TIMESTAMP NOT NULL DEFAULT NOW(),
		`customer_id` INT NOT NULL DEFAULT 0,
		`visit_time` DATETIME NOT NULL DEFAULT NOW(),
        `doctor_advise` VARCHAR(2048),
		`remark` VARCHAR(2048),	
		 FOREIGN KEY (`customer_id`) REFERENCES customer(`id`),
         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

use dxjk;

insert into user(privilege, name, password, phonenumber, wx, status) VALUES(3, 'zzy', '123456', '18081189210', 'zzywuwu', 'actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(3, '王君', '123456', '13980870629', 'wj0629', 'not actived');
insert into user(privilege, name, password, phonenumber, wx, status) VALUES(3, '秋容', '123456', '13980870629', 'wj0629', 'not actived');

insert into customer(name, phonenumber, idnumber, user_id, doctor_name, next_visit_time) VALUES('张三', '18012345678', '511002197903140617', 2, '游泳', NOW());
insert into customer(name, phonenumber, idnumber, user_id, doctor_name, next_visit_time) VALUES('李四', '18112345678', '511002197903140618', 3, '刘兴慧', NOW());
insert into customer(name, phonenumber, idnumber, user_id, doctor_name, next_visit_time) VALUES('王麻子', '18212345678', '511002197903140619', 3, '游泳', NOW());

insert into bingli(customer_id, doctor_advise, remark) VALUES(1, '吃药1', '记得吃药');
insert into bingli(customer_id, doctor_advise, remark) VALUES(1, '吃药2', '记得吃药');
insert into bingli(customer_id, doctor_advise, remark) VALUES(1, '吃药3', '记得吃药');
insert into bingli(customer_id, doctor_advise, remark) VALUES(1, '吃药4', '记得吃药');

