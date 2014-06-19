/**
 * 应用入口函数
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    var cluster = require('cluster');
    var session = require('express-session');
    var clusterStore = require('strong-cluster-express-store')(session);

    if (cluster.isMaster) {
        clusterStore.setup();
        var cpuCount = require('os').cpus().length;
        $$.logger.info("将启动" + cpuCount + "个工作线程，开始进行系统初始化......");
        //启动工作线程
        for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
        cluster.on('online', function(worker) {
            $$.logger.info('工作线程:' + worker.id + ' is online.');
        });
        cluster.on('exit', function(worker, code, signal) {
            $$.logger.info('工作线程：' + worker.id + ' 挂了，将重启工作线程…………,signal:' + signal);
            cluster.fork();
        });
        //主线程开启服务器推客户端
        var jsbfPusherClient = require("./lib/push/server/jsbf/jsbf-push-client");
        app.register("jsbfPushClient", jsbfPushClient);
        app.start('jsbfPushClient');
    } else {
        var express = require('express')();
        var cookieParser = require('cookie-parser');
        express.use(cookieParser()).use(session({store: new clusterStore(), secret: 'perfmjs-push' }));
        app.register('jsbfPusherServer', require("./lib/push/server/jsbf/jsbf-push-server"));
        app.start('jsbfPusherServer');
        $$.jsbfPushServer.instance.startup(require('http').Server(express), require('socket.io'), 18000, "/jsbf");
    }
});