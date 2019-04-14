const express = require('express');
const router = express.Router();
const request = require('request');
const dbhelper = require('../lib/dbhelper');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
    // res.render('signin', data);

});

router.get('/add', function (req, res, next) {
    let connection_read = dbhelper.con_read();
    let sql = 'select * from topic_type where 1=1 ';
    let data = {
        title: 'NodeBBS',
        session: req.session
    };
    connection_read.query(sql, function (err, topicTypeData) {
        if (err)
            throw err;
        console.log(topicTypeData)
        data.topicTypeData = topicTypeData;
        res.render('topic/add', data);
    });

});

router.get('/:topic_id', function (req, res, next) {
    let topic_id = req.params.topic_id;
    request('http://localhost:3000/api/topic/' + topic_id, function (err, val, body) {
        if (err)
            throw err;
        let data = {
            title: 'NodeBBS',
            session: req.session,
            data: JSON.parse(body).data,
            reply: JSON.parse(body).reply,
            topicTypes:JSON.parse(body).topicTypes
        };
        res.render('topic/detail', data);
    });
});

module.exports = router;
