var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
const sql_config = require("../modules/sql_config");
const sql = require('mysql').createPool(sql_config);
var sendmail = require("../modules/mail.js");
var util = require("util");
var fs = require('fs');
var path = require('path');
//测试样式
router.get('/starter', function(req, res, next) {
    req.session.title = '标题';
    console.log(req.session.title)
    res.json({ 'title': '标题', "description": '内容' });
});

router.get('/ceshishujuku', function(req, res, next) {
    const queryStr = `select id, content from ceshi`;
    console.log(req.session.title)
    sql.query(queryStr, function(error, results) {
        if (error) {
            next(error);
        } else {
            if (results.length === 0) {
                res.json({ ceshi: 0 })
            } else {
                res.json(results)
                console.log(results)
            }
        }
    })
});
router.get('/upload', function(req, res, next) {
    req.session.title = '标题';
    console.log(req.session.title)
    res.json({ 'title': '标题', "description": '内容' });
});
router.post('/upload', function (req, res, next) {
    var form = new multiparty.Form();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./upload";
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log(fields);
            console.log('parse files: ' + filesTmp);
            console.log(files,);
            console.log('文件');
            console.log(files);
            var inputFile = files;
            //重命名为真实文件名
            fs.renameSync(inputFile.avatar[0].path, form.uploadDir+inputFile.avatar[0].originalFilename, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: filesTmp}));
    });
});

router.post('/sendMail', function(req, res, next){
    console.log(req.body)
    sendmail(req.body.useremail, '这是测试邮件', 'Hi,在家啊没干');
})

module.exports = router;