const express = require('express');
const router = express.Router();
const dbhelper = require('../lib/dbhelper');

router.get('/userManager/:user_id', function (req, res, next) {

    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'select code, name from province order by code';
    let data = {
    };
    connection_read.query(sql, function (err, provinceData) {
        if (err)
            throw err;
        data.session = req.session;
        data.provinceData = provinceData;
        res.render('manager/userManager', data);
    });

});

router.get('/tableuser', function (req, res, next) {
    // console.log(req.body);
    // console.log(req.query)
    // console.log(req.params)
    let page=req.query.page;
    let limit=req.query.limit;
    let mail=req.query.mail;
    let username = req.query.username;

    let start = (page- 1) * limit;
    let connection_read = dbhelper.con_read();
    let sql = 'select * from user where 1=1 ';
    if(mail){
        sql += ' and mail like "%'+mail+'%"';
    }
    if(username){
        sql += ' and username like "%'+username+'%"';
    }
    sql += ' order by utime desc limit ' + start + ','+limit;
    console.log(sql);
    let sqlcount = 'select count(mail) from user ';
    let data = {};
    connection_read.query(sql, function (err, userdata) {
        if (err)
            throw err;
        data.userdata = userdata;
        connection_read.query(sqlcount, function (err, count) {
            // console.log(count[0]['count(mail)'])
            connection_read.end();
            if (err)
                throw err;
            data.session = req.session;
            data.status = 0;
            data.total = count[0]['count(mail)'];
            res.send(data);
        });
    });
});

router.post('/addUser', function (req, res, next) {

    let sess = req.session;
    let connection_write = dbhelper.con_write();

    let mail=req.body.newmail;
    let username = req.body.newun;
    let password1 = req.body.newpassword;
    let sex = req.body.newsex;
    let province = req.body.province_name;
    let province_code = Number(req.body.province)?Number(req.body.province):0;
    let city = req.body.city_name;
    let city_code = Number(req.body.city)? Number(req.body.city):0;
    let area = req.body.area_name;
    let area_code = Number(req.body.area)?Number(req.body.area):0;
    let signtext = req.body.newSign;
    let newRoleType = req.body.newRoleType;
    let imgurl="public/images/avatar/2.jpg";

    let sql = 'INSERT INTO user(mail, username, password, utime, country,sex,city,sign,'
        + ' pic,province,area,province_code,area_code,city_code,role_type) '
        + ' VALUES("' +mail+'","'+username+'","'+password1+'",'+'now(),"中国","'+sex+'","'
        + city+'","'+signtext+'","'+imgurl+'","'+province+'","'+area+'","'+province_code+'","'
        + area_code+'","'+city_code+'","'+newRoleType+'")';

    console.log(sql);
    connection_write.query(sql, function (err, userData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})

router.post('/editUser', function (req, res, next) {

    let sess = req.session;
    let connection_write = dbhelper.con_write();

    let mail=req.body.newmail;
    let username = req.body.newun;
    let password1 = req.body.newpassword;
    let sex = req.body.newsex;
    let province = req.body.province_name;
    let province_code = Number(req.body.province)?Number(req.body.province):0;
    let city = req.body.city_name;
    let city_code = Number(req.body.city)? Number(req.body.city):0;
    let area = req.body.area_name;
    let area_code = Number(req.body.area)?Number(req.body.area):0;
    let signtext = req.body.newSign;
    let newRoleType = req.body.newRoleType;
    let imgurl="public/images/avatar/2.jpg";

    let sql = 'UPDATE user SET ';
    if(password1) {
        sql += 'password="'+password1 +'",';
    }else {
        sql += 'username="'+username+'", sex ="'+sex+'", province="'+province+'",'
            +' province_code = "'+province_code+'", city="'+city+'",'
            +' city_code = "'+city_code+'", area="'+area+'",'
            +' area_code = "'+area_code+'", sign="'+signtext+'",'
            +' role_type = "'+newRoleType+'"'
            +' where mail="' + mail + '"';
    }

    console.log(sql);
    connection_write.query(sql, function (err, userData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})

router.post('/deleteUser', function (req, res, next) {
    let mails=req.body.mails.split(",");
    let uids='';
    for(let i=0;i<mails.length;i++){
        uids+='"'+mails[i]+'"';
        if(i!=mails.length-1){
            uids+=',';
        }
    }
    let connection_write = dbhelper.con_write();
    let sql = 'delete from user where uid in ('+uids+')';
    // console.log(sql);
    connection_write.query(sql, function (err, userData) {
        connection_write.end();
        if (err) throw err;
        let status = {
            status: 1
        };
        res.json(status);
    });
})



module.exports = router;