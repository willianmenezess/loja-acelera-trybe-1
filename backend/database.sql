drop DATABASE IF EXISTS bank;
CREATE DATABASE IF NOT EXISTS bank;

USE bank;

CREATE table IF NOT EXISTS accounts (
	`id` INT PRIMARY KEY auto_increment,
    `identifier` VARCHAR(255) NOT NULL UNIQUE, 
    `name` VARCHAR(255) NOT NULL, 
    `email` VARCHAR(255) NOT NULL, 
    `password` VARCHAR(255) NOT NULL, 
    `isAdmin`  boolean default false,
    `status`  boolean default true
);

INSERT INTO `bank`.`accounts` (`identifier`, `name`, `email`, `password`, `status`) VALUES ('228.564.570-88', 'zambs', 'z@z.com', '$2b$10$3GcfaBHoo00PnzMOaz3seeHivp4IBpPBB957B8fFvolC5V2qxNgYe', true); -- password: 123456
INSERT INTO `bank`.`accounts` (`identifier`, `name`, `email`, `password`, `isAdmin`, `status`) VALUES ('124.424.522-43', 'paulo', 'a@a.com', '$2b$10$KltGq/1NPEun.8QezgjRdOt7HV4HXSnPsciTLoeJ1p6fNZoUWxg3y', true, true); -- password:123456

CREATE table IF NOT EXISTS transactions (
	`transactionId` INT PRIMARY KEY auto_increment,
    `accountId` INT NOT NULL, 
    `cashback` DOUBLE DEFAULT NULL, 
    `value` DOUBLE NOT NULL, 
    `date`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
