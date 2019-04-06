const express = require('express');
const router = express.Router();
const request = require('request');
const dbhelper = require('../lib/dbhelper');

/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log(req.query);
    request('http://localhost:3000/api/topics/?page=' + (req.query.page || '1') + (req.query.sort?'&sort=hot':''), function (err, val, body) {
        if (err)
            throw err;
        let data = {
            title: 'NodeBBS',
            session: req.session,
            data: JSON.parse(body).data,
            page: req.query.page || '1'
        };
        res.render('index', data);
    });
});

router.post('/topic/:pid', function (req, res, next) {
    let connection = dbhelper.con_read();
    let pid = req.params.pid;
    let sql = 'INSERT INTO post(pid,uid,acontent,atime) VALUES("' + pid + '","' + req.body.uid + '","' + req.body.content + '",now())';
    let sess = req.session;
    connection.query(sql, function (err, data) {
        if (err) throw err;
        let status = {status: 'success'};
        connection.end();
        res.json(status);
    });
});

router.get('/test/', function (req, res, next) {
    let sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
    // console.log(sess);
    if (sess.views) {
        sess.views++;
        // res.setHeader('Content-Type', 'text/html');
        res.send('<p>欢迎' + sess.username + '第 ' + sess.views + '次访问,' + 'expires in:' + (sess.cookie.maxAge / 1000) + 's</p>');
    } else {
        sess.views = 1;
        sess.username = 'ZKin';
        res.end('welcome to the session demo. refresh!');
    }
});

router.get('/out', function(req, res){
    // console.log(req.session);
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
