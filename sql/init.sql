-- SuperAdmin 初始化脚本：创建数据库与用户表示例数据
CREATE DATABASE IF NOT EXISTS super_admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE super_admin;

CREATE TABLE IF NOT EXISTS sys_user (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  username VARCHAR(64) NOT NULL COMMENT '登录用户名',
  nickname VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户';

INSERT INTO sys_user (username, nickname)
VALUES ('admin', '管理员')
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname);
