const express = require('express');
const router = express.Router();
const dbhelper = require('../lib/dbhelper');

/* GET home page. */
router.get('/', function (req, res, next) {
    // API document
    res.redirect('https://www.jianshu.com/p/224c004af262');
});

router.get('/topics', function (req, res) {
    let connection_read = dbhelper.con_read();
    // 在这里添加代码
    let current_page = 0; //默认为1
    let num = 15; //每页条数
    if (req.query.page) {
        current_page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        num = parseInt(req.query.limit);
    }
    let next_page = current_page + 1;
    let sql = 'SELECT * FROM post natural join user ORDER BY lasttime DESC limit ' + num + ' offset ' + num * (current_page-1);
    if(req.query.sort) {
        sql = 'SELECT * FROM post natural join user ORDER BY reply DESC limit ' + num + ' offset ' + num * (current_page-1);
    }
    let data = {};
    connection_read.query(sql, function (err, val) {
        connection_read.end();
        if (err)
            throw err;
        if (val && val.length > 0) {
            data.data = val;
            data.status = 'success';
        } else {
            data.status = 'failed';
        }
        res.json(data);
    })
});

router.get('/topic/:topic_id', function (req, res, next) {
    let connection_read = dbhelper.con_read();
    let connection_write = dbhelper.con_write();
    let pid = req.params.topic_id;
    let sql = 'SELECT * FROM post NATURAL JOIN user where pid = "' + pid + '"';
    let sql1 = 'SELECT * FROM answer NATURAL JOIN user where pid = "' + pid + '"';
    let sql2 = 'update post set visits=visits+1 where pid = "' + pid + '"';
    let data = {};
    connection_read.query(sql, function (err, val) {
        if (err)
            throw err;
        if (val && val.length > 0) {
            data.data = val[0];
            data.status = 'success';
        } else {
            data.status = 'failed';
        }
        connection_write.query(sql2, function (err, val) {
            if (err)
                throw err;

        })
        connection_read.query(sql1, function (err, val) {
            connection_read.end();
            if (err)
                throw err;
            if (val && val.length > 0) {
                data.reply = val;
                data.status = 'success';
            } else {
                data.status = 'failed';
            }
            res.json(data);
        })
    })
});

router.post('/signin', function (req, res, next) {
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT username,mail, uid ,country,province,province_code,city,city_code,area,area_code,utime, sign ,sex,pic,role_type FROM user where mail = "' + req.body.mail + '" and password = "' + req.body.password + '"';
    let sess = req.session;
    connection_read.query(sql, function (err, data) {
        connection_read.end();
        if (err)
            throw err;
        let status = {
            status: 'success'
        };
        if (data.length > 0) {
            sess.views = 1;
            sess.username = data[0].username;
            sess.mail = data[0].mail;
            sess.country = data[0].country;
            sess.utime = data[0].utime;
            sess.sign = data[0].sign;
            sess.sex = data[0].sex;
            sess.province = data[0].province;
            sess.province_code = data[0].province_code;
            sess.city = data[0].city;
            sess.city_code = data[0].city_code;
            sess.area = data[0].area;
            sess.area_code = data[0].area_code;
            sess.role_type = data[0].role_type;
            if(data[0].pic.indexOf("public")!=-1){
                sess.pic=data[0].pic.substring(data[0].pic.indexOf("public")+"public".length,data[0].pic.length);
            }else{
                sess.pic = data[0].pic;
            }
            sess.uid = data[0].uid;
            sess.publishtime = data[0].publishtime || 0;
        } else {
            status.status = 'failed';
        }
        res.json(status);
    });
});

router.post('/signup', function (req, res, next) {
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let imgurl="public/images/avatar/2.jpg";
    let sql1 = 'SELECT mail FROM user where mail = "' + req.body.mail + '"';
    let sql = 'INSERT INTO user(mail, username, password, utime, country,pic) VALUES("' + req.body.mail + '", "' + req.body.username + '", "' + req.body.password + '", now(), "中国","'+imgurl+'")';
    connection_read.query(sql1, function (err, data) {
        if (err)
            throw err;
        let status = {
            status: 'success'
        };
        if (data.length > 0) {
            status.status = 'failed';
            connection_write.end();
            connection_read.end();
        } else {
            connection_write.query(sql);
            connection_write.end();
            connection_read.end();
        }
        res.json(status);
    });
});

router.post('/add', function (req, res, next) {
    let connection_write = dbhelper.con_write();
    let sql = "INSERT INTO post(postname,uid,topic,pcontent,publishtime,lasttime)VALUES('" + req.body.postname + "','" + req.session.uid + "','" + req.body.topic + "','" + req.body.content + "', now(),now())";
    let connection_read = dbhelper.con_read();
    let sql1 = 'SELECT * FROM post where postname ="' + req.body.postname + '"and uid="' + req.session.uid + '" ORDER BY publishtime DESC LIMIT 1 ';
    let sess = req.session;
    let data = {};
    connection_write.query(sql, function (err, val) {
        if (err) throw err;
        connection_read.query(sql1, function (err, val) {
            if (err)
                throw err;
            if (val.length > 0) {
                data = {
                    status: 'success',
                    pid: val[0].pid
                };
            } else {
                data = {
                    status: 'failed'
                };
            }
            connection_write.end();
            connection_read.end();
            res.json(data);
        })
    });
});

router.post('/topic/:pid', function (req, res, next) {
    let connection_write = dbhelper.con_write();
    let pid = req.params.pid;
    let sql = "INSERT INTO answer(pid,uid,content,atime) VALUES('" + pid + "','" + req.session.uid + "','" + req.body.content + "',now())";
    let sql1 = 'UPDATE post SET reply=reply+1 where pid="' + pid + '"';
    let sess = req.session;
    connection_write.query(sql, function (err, data) {
        if (err) throw err;
        let status = {
            status: 'success'
        };
        connection_write.query(sql1);
        connection_write.end();
        res.json(status);
    });
});


module.exports = router;