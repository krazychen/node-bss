const express = require('express');
const router = express.Router();
const request = require('request');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
    // res.render('signin', data);

});

router.get('/add', function (req, res, next) {
    let data = {
        title: 'HZNU CLUB',
        session: req.session
    };
    res.render('topic/add', data);
});

router.get('/:topic_id', function (req, res, next) {
    let topic_id = req.params.topic_id;
    request('http://localhost:3000/api/topic/' + topic_id, function (err, val, body) {
        if (err)
            throw err;
        let data = {
            title: 'HZNU CLUB',
            session: req.session,
            data: JSON.parse(body).data,
            reply: JSON.parse(body).reply
        };
        res.render('topic/detail', data);
    });
});

module.exports = router;
