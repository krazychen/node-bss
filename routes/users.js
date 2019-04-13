const express = require('express');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');
const router = express.Router();
const dbhelper = require('../lib/dbhelper');

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './public/images/ue/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
    storage: storage
});

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

router.get('/changeAvatar/:user_id', function (req, res, next) {
    let data = {};
    data.session = req.session;
    res.render('user/changeAvatar', data);
});

router.post('/avatar/:user_id', upload.single('file'), function (req, res, next) {

    var file = req.file;
    let user_id = req.params.user_id;
    let sess = req.session;

    const imgurl = file.path;
    let connection_write = dbhelper.con_write();
    let sql = 'UPDATE user SET pic="'+imgurl+'" where uid="' + user_id + '"';
    connection_write.query(sql, function (err, data) {
        if (err) throw err;
        let status = {
            status: 1
        };
        connection_write.end();
        // console.log(imgurl)
        // console.log(imgurl.indexOf("public"))
        // console.log(imgurl.length)
        if(imgurl.indexOf("public")!=-1){
            sess.pic=imgurl.substring(imgurl.indexOf("public")+"public".length,imgurl.length);
        }else{
            sess.pic = imgurl;
        }
        // sess.save();
        data.session=sess;
        data.status=status;
        res.send(data);
    });
})

router.get('/changeProfile/:user_id', function (req, res, next) {
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'select code, name from province order by code';
    let citySql = null;
    if(req.session.province_code){
        citySql = 'select code, name from city where parent_code="'+req.session.province_code+'" order by code';
    }
    let areaSql = null;
    if(req.session.city_code){
        areaSql = 'select code, name from area where parent_code="'+req.session.city_code+'" order by code';
    }
    let data = {};
    connection_read.query(sql, function (err, provinceData) {
        if (err)
            throw err;
        data.session = req.session;
        data.provinceData = provinceData;
        data.cityData = null;
        data.areaData = null;
        if(citySql){
            connection_read.query(citySql, function (err, cityData) {
                if (err)
                    throw err;
                data.session = req.session;
                data.cityData = cityData;
                if(areaSql){
                    connection_read.query(areaSql, function (err, areaData) {
                        if (err)
                            throw err;
                        data.session = req.session;
                        data.areaData = areaData;
                        res.render('user/changeProfile', data);
                    })
                }else{
                    res.render('user/changeProfile', data);
                }
            })
        }else{
            res.render('user/changeProfile', data);
        }
    });
});

router.post('/getCitys', function (req, res, next) {
    let code = req.body.code;
    let connection_read = dbhelper.con_read();
    let sql = 'select code, name from city where parent_code='+code+' order by code';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        res.send(data);
    });
});

router.post('/getAreas', function (req, res, next) {
    let code = req.body.code;
    let connection_read = dbhelper.con_read();
    let sql = 'select code, name from area where parent_code='+code+' order by code';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        res.send(data);
    });
});

router.post('/profile/:user_id', function (req, res, next) {

    let user_id = req.params.user_id;
    let sess = req.session;
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let sqlUser = 'SELECT username,mail, uid ,country,province,province_code,city,city_code,area,area_code,utime, sign ,sex,pic FROM user where uid = "' + user_id + '" ';


    let username = req.body.username;
    let password1 = req.body.passowrd1;
    let sex = req.body.sex;
    let province = req.body.province_name;
    let province_code = Number(req.body.province)?Number(req.body.province):0;
    let city = req.body.city_name;
    let city_code = Number(req.body.city)? Number(req.body.city):0;
    let area = req.body.area_name;
    let area_code = Number(req.body.area)?Number(req.body.area):0;
    let signtext = req.body.signtext;
    let sql = 'UPDATE user SET ';
    if(password1) {
        sql += 'password="'+password1 +'",';
    }else {
        sql += 'username="'+username+'", sex ="'+sex+'", province="'+province+'",'
            +' province_code = "'+province_code+'", city="'+city+'",'
            +' city_code = "'+city_code+'", area="'+area+'",'
            +' area_code = "'+area_code+'", sign="'+signtext+'"'
            +' where uid="' + user_id + '"';
    }
    connection_write.query(sql, function (err, profileData) {
        connection_write.end();
        if (err) throw err;
        connection_read.query(sqlUser, function (err, data) {
            connection_read.end();
            if (err)
                throw err;
            let status = {
                status: 1
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
                if (data[0].pic.indexOf("public") != -1) {
                    sess.pic = data[0].pic.substring(data[0].pic.indexOf("public") + "public".length, data[0].pic.length);
                } else {
                    sess.pic = data[0].pic;
                }
                sess.uid = data[0].uid;
                sess.publishtime = data[0].publishtime || 0;
            } else {
                status.status = 0;
            }
            status.session=sess;
            res.send(status);
        });
    });
})

module.exports = router;