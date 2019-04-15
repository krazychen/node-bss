const express = require('express');
const router = express.Router();
const dbhelper = require('../lib/dbhelper');

router.get('/topicTypeMag/:user_id', function (req, res, next) {

    let user_id = req.params.user_id;
    let data = {
    };
    data.session = req.session;
    res.render('manager/topicTypeManager', data);
});

router.get('/tableTopicType', function (req, res, next) {
    // console.log(req.body);
    // console.log(req.query)
    // console.log(req.params)
    let page=req.query.page;
    let limit=req.query.limit;
    let topicType=req.query.topicType;
    let remark = req.query.remark;

    let start = (page- 1) * limit;
    let connection_read = dbhelper.con_read();
    let sql = 'select * from topic_type where 1=1 ';
    if(topicType){
        sql += ' and type like "%'+topicType+'%"';
    }
    if(remark){
        sql += ' and remark like "%'+remark+'%"';
    }
    sql += ' order by type desc limit ' + start + ','+limit;
    // console.log(sql);
    let sqlcount = 'select count(id) from topic_type ';
    let data = {};
    connection_read.query(sql, function (err, topicTypeData) {
        if (err)
            throw err;
        data.topicTypeData = topicTypeData;
        connection_read.query(sqlcount, function (err, count) {
            // console.log(count[0]['count(mail)'])
            connection_read.end();
            if (err)
                throw err;
            data.session = req.session;
            data.status = 0;
            data.total = count[0]['count(id)'];
            res.send(data);
        });
    });
});

router.post('/addTopicType', function (req, res, next) {

    let sess = req.session;
    let connection_write = dbhelper.con_write();

    let newTopicType=req.body.newType;
    let newRemark = req.body.newRemark;

    let sql = 'INSERT INTO topic_type(type, remark) '
        + ' VALUES("' +newTopicType+'","'+newRemark+'")';

    console.log(sql);
    connection_write.query(sql, function (err, topicTypeData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})

router.post('/editTopicType', function (req, res, next) {

    let sess = req.session;
    let connection_write = dbhelper.con_write();

    let ttid=req.body.id;
    let newTopicType=req.body.newType;
    let newRemark = req.body.newRemark;

    let sql = 'UPDATE topic_type SET ';
    sql += 'type="'+newTopicType+'", remark ="'+newRemark+'" '
        +' where id="' + ttid + '"';

    console.log(sql);
    connection_write.query(sql, function (err, topicTypeData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})

router.post('/deleteTopicType', function (req, res, next) {
    let ids=req.body.ids.split(",");
    let uids='';
    for(let i=0;i<ids.length;i++){
        uids+='"'+ids[i]+'"';
        if(i!=ids.length-1){
            uids+=',';
        }
    }
    let connection_write = dbhelper.con_write();
    let sql = 'delete from topic_type where id in ('+uids+')';
    // console.log(sql);
    connection_write.query(sql, function (err, topicTypeData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})

router.get('/pupTopicType', function (req, res, next) {
    // console.log(req.body);
    // console.log(req.query)
    // console.log(req.params)
    let page=req.query.page;
    let limit=req.query.limit;
    let topicType=req.query.topicType;
    let remark = req.query.remark;

    let start = (page- 1) * limit;
    let connection_read = dbhelper.con_read();
    let sql = 'select * from topic_type where 1=1 ';
    if(topicType){
        sql += ' and type like "%'+topicType+'%"';
    }
    if(remark){
        sql += ' and remark like "%'+remark+'%"';
    }
    sql += ' order by type desc limit ' + start + ',2'+limit;
    // console.log(sql);
    let sqlcount = 'select count(id) from topic_type ';
    let data = {};
    connection_read.query(sql, function (err, topicTypeData) {
        if (err)
            throw err;
        data.topicTypeData = topicTypeData;
        connection_read.query(sqlcount, function (err, count) {
            // console.log(count[0]['count(mail)'])
            connection_read.end();
            if (err)
                throw err;
            data.session = req.session;
            data.status = 0;
            data.total = count[0]['count(id)'];
            res.send(data);
        });
    });
});

module.exports = router;