/**
 * 应用入口函数, FIXME 集群有点问题待完善
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    var cluster = require('cluster');
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var bodyParser = require('body-parser');
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
//        //主线程开启服务器推客户端
//        app.register("jsbfPushClient", require("./lib/push/server/jsbf/jsbf-push-client"));
//        app.start('jsbfPushClient');
    } else {
        app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
        app.start('jsbfPushServer');
        var serverApp = express();
//        var store = new clusterStore();
        var store = new (require('socket.io-clusterhub'));
        serverApp.use(cookieParser()).use(session({store: store, secret: 'perfmjs-push'})).use(bodyParser());
        var sticky = require('sticky-session');
        $$.jsbfPushServer.instance.startup(sticky(require('http').Server(require('express')())), require('socket.io'), 18000, "/jsbf");
    }
});