/**
 * 应用入口函数
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    var express = require('express')();
    var cookieParser = require('cookie-parser');
    express.use(cookieParser());
    app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
    app.start('jsbfPushServer');
    $$.jsbfPushServer.instance.startup(require('http').Server(express), require('socket.io'), 18000, "/jsbf");
//    //主线程开启服务器推客户端
//    app.register("jsbfPushClient", require("./lib/push/server/jsbf/jsbf-push-client"));
//    app.start('jsbfPushClient');
});