# secondhand 二手闲置交易平台
## 项目介绍
本项目是一套前后端分离的二手物品交易平台，面向个人闲置物品流转场景，实现完整的二手交易业务流程。

## 核心功能
- 用户模块：注册、登录、个人信息管理、密码修改
- 商品模块：闲置商品发布、分类浏览、搜索筛选、收藏、商品详情
- 交易模块：下单、订单管理、商品买卖流程
- 沟通模块：买家卖家在线私信聊天
- 后台管理：商品分类管理、用户管理、订单审核

## 技术栈
### 前端
Vue3 + TypeScript + Vite + Element Plus
### 后端
SpringBoot + MyBatis-Plus + MySQL + Maven

## 本地运行
### 前端启动
1. 进入frontend目录
cd frontend
npm install
npm run dev
### 后端启动
修改application.yml数据库连接配置
导入项目 SQL 脚本至 MySQL
使用 IDEA 打开 backend，运行启动类即可
