const express = require('express');
const router = express.Router();
const dbhelper = require('../lib/dbhelper');

router.get('/signin', function (req, res, next) {
    let data = {
        title: 'NodeBBS',
        session: req.session
    };
    res.render('user/signin', data);
});

router.get('/signup', function (req, res, next) {
    let data = {
        title: 'NodeBBS',
        session: req.session
    };
    res.render('user/signup', data);
});


router.get('/index/:user_id', function (req, res, next) {
    // let data = {
    //     title: 'NodeBBS',
    //     session: req.session
    // };
    // res.render('user/index', data);
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT uid, postname, publishtime, pid, pcontent, visits, reply from post where uid= ' + user_id + ' order by publishtime desc limit 10';
    let query = 'select answer.uid, answer.content, answer.pid, post.postname, answer.atime from answer join post on post.pid = answer.pid where answer.uid= ' + user_id + ' order by atime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        connection_read.query(query, function (err, data2) {
            if (err)
                throw err;
            connection_read.end();
            data.data2 = data2;
            data.session = req.session;
            // console.log(data2);
            res.render('user/index', data);
        });
    });
});

router.get('/:user_id', function (req, res, next) {
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT uid, postname, publishtime, pid, pcontent, visits, reply from post where uid= ' + user_id + ' order by publishtime desc limit 10';
    let query = 'select answer.uid, answer.content, answer.pid, post.postname, answer.atime from answer join post on post.pid = answer.pid where answer.uid= ' + user_id + ' order by atime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        connection_read.query(query, function (err, data2) {
            if (err)
                throw err;
            connection_read.end();
            data.data2 = data2;
            data.session = req.session;
            // console.log(data2);
            res.render('user/home', data);
        });
    });
});

router.get('/huitie/:user_id', function (req, res, next) {
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'select answer.uid, answer.content, answer.pid, post.postname, answer.atime from answer join post on post.pid = answer.pid where answer.uid= ' + user_id + ' order by atime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        res.render('user/huitie', data);
    });
});

router.get('/fatie/:user_id', function (req, res, next) {
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT uid, postname, publishtime, pid, pcontent, visits, reply from post where uid= ' + user_id + ' order by publishtime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        res.render('user/fatie', data);
    });
});

module.exports = router;