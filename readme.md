# 基于Node.js搭建论坛
### 项目架
##### 技术栈：

Node.JS + Express(EJS)  + MySQL 

页面框架：[Layui](http://www.layui.com/)社区前端模版及UI，富文本编辑器采用 [simditor](https://github.com/mycolorway/simditor)，以后考虑换成markdown编辑器。

### 开始
```
cd node-bss/ # 进入目录
npm install  # 安装依赖）
npm start  # 启动
```
打开浏览器访问 http://localhost:3000
#### 文件结构
```
---- bin
---- node_modules 依赖
---- public  公共静态文件
---- routes  路由
---- views  前端页面模版
-------- common
-------- topic
-------- user
---- app.js  应用启动入口
---- package.json 依赖描述
---- package-lock.json
---- readme.md
```
