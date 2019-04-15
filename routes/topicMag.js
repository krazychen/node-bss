const express = require('express');
const router = express.Router();
const request = require('request');
const dbhelper = require('../lib/dbhelper');

//后台主题管理
router.get('/topicManager/:user_id', function (req, res, next) {

    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'select * from topic_type where 1=1 ';
    let data = {
    };
    connection_read.query(sql, function (err, topicTypeData) {
        if (err)
            throw err;
        data.session = req.session;
        data.topicTypeData = topicTypeData;
        res.render('manager/topicManager', data);
    });

});

router.get('/tabletopic', function (req, res, next) {
    // console.log(req.body);
    // console.log(req.query)
    // console.log(req.params)
    let page=req.query.page;
    let limit=req.query.limit;
    let postname=req.query.postname;
    let topicType = req.query.topicType;

    let start = (page- 1) * limit;
    let connection_read = dbhelper.con_read();
    let sql = 'select * from post natural join user where 1=1 ';
    if(postname){
        sql += ' and postname like "%'+postname+'%"';
    }
    if(topicType){
        sql += ' and type_id ='+topicType+'';
    }
    sql += ' order by publishtime desc limit ' + start + ','+limit;
    // console.log(sql);
    let sqlcount = 'select count(*) from post ';
    let data = {};
    connection_read.query(sql, function (err, topicdata) {
        if (err)
            throw err;
        // console.log(topicdata)
        data.topicdata = topicdata;
        connection_read.query(sqlcount, function (err, count) {
            // console.log(count[0]['count(mail)'])
            connection_read.end();
            if (err)
                throw err;
            data.session = req.session;
            data.status = 0;
            data.total = count[0]['count(*)'];
            res.send(data);
        });
    });
});

router.post('/deleteTopic', function (req, res, next) {
    let ids=req.body.ids.split(",");
    let pids='';
    for(let i=0;i<ids.length;i++){
        pids+='"'+ids[i]+'"';
        if(i!=ids.length-1){
            pids+=',';
        }
    }
    let connection_write = dbhelper.con_write();
    let status = {
        status: 0
    };
    let answersql = 'delete from answer where pid in('+pids+')';
    let sql = 'delete from post where pid in ('+pids+')';
    // console.log(sql);
    connection_write.query(answersql, function (err, userData) {
        if (err) throw err;
        connection_write.query(sql, function (err, userData) {
            connection_write.end();
            if (err) throw err;
            status.status=1;
            res.json(status);
        });
    });

})

module.exports = router;
