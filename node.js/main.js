const express = require("express")
const fs = require("fs")
const mysql = require("mysql")
const util = require("util")
const {getNow} = require("./tool")

const app = express();
const bodyParser = require("body-parser");
const { nextTick } = require("process");
app.use("/static/", express.static("./static/"));
app.use('/node_modules/', express.static('./node_modules/'));
app.engine("html", require("express-art-template"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '666123',
    database: 'react-node-blog'
});

connection.connect();

// 渲染页面
app.get("/", (req, res) => {
    res.render("index.html");
})

// 获取所有数据
app.get("/api/blog_list", (req, res) => {
    let obj = {
        ret: false, 
        total: 0, 
        rows: [], 
        msg: ""
    }

    const pageSize = Number(req.query.pageSize);
    const pageNumber = Number(req.query.pageNumber)-1;

    connection.query(`SELECT * FROM blog`, (error, results, fields) => {
        if (!error) {
            obj.total = results.length;
            // 分页查询 begin
            connection.query(`SELECT * FROM blog limit ${pageNumber*pageSize}, ${pageSize}`, (error, results, fields) => {
                if (!error) {
                    obj.ret = true;
                    obj.rows = results.map((value, key) => {
                        return {
                            id: value.id,
                            title: value.title,
                            content: value.content.toString(),
                            datetime: value.datetime
                        }
                    });
                    res.header("Access-Control-Allow-Origin", "*");
                    res.type('application/json');
                    res.jsonp(obj);
                }else{
                    next(error);
                }
            })
            // 分页查询 end
        }else{
            next(error);
        }
    })
})

app.get("/api/get_blog_detail", (req, res) => {
    let obj = {
        ret: false, 
        content: "",
        msg: ""
    }

    connection.query(`SELECT * FROM blog WHERE ID=${req.query.id}`, (error, results, fields) => {
        if(!error){
            obj.ret = true;
            obj.content = results[0].content.toString();
            res.header("Access-Control-Allow-Origin", "*");
            res.type('application/json');
            res.jsonp(obj);
        }else{
            next(error);
        }
    })
})

app.post("/api/add_blog", (req, res) => {
    let obj = {
        ret: false,
        msg: ""
    }

    console.log(req.body);
    console.log(typeof req.body);
    console.log(req.body.title);
    console.log(req.body.content);

    //connection.query(`INSERT INTO users(id, name, sex, city, age) VALUES(NULL, '${req.body.name}', '${req.body.sex}', '${req.body.city}', '${req.body.age}')`, function (error, results, fields) {
    connection.query(`INSERT INTO blog(id, title, content, datetime) VALUES(NULL, '${req.body.title}', '${req.body.content}', '${getNow()}')`, function(error, result, fields){
        if(!error){
            obj.ret = true;
            obj.msg = "信息添加成功！";
            res.header("Access-Control-Allow-Origin", "*");
            res.type('application/json');
            res.jsonp(obj);
        }else{
            next(error);
        }
    })
})

app.post("/api/delete_blogs", (req, res) => {
    let obj = {
        ret: false,
        msg: ""
    }

    var idArr = JSON.parse(req.body.idArr);

    for(let i = 0; i<idArr.length; i++){
        connection.query(`DELETE FROM blog WHERE id='${idArr[i]}'`, (error, results, fields) => {
            if(!error){
                obj.ret = true;
                obj.msg = "删除成功！";
                res.header("Access-Control-Allow-Origin", "*");
                res.type('application/json');
                res.jsonp(obj);
            }else{
                next(error);
            }
        })
    }
})

app.get("/404", (req, res) => {
    res.render("404.html");
})

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.listen(5555, () => {
    console.log("服务启动成功......");
})