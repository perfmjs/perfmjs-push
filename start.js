/**
 * 应用入口函数
 * 后台启动 forever start -a -l /www/perfmjs-push/logs/forever.log -o /www/perfmjs-push/logs/out.log -e /www/perfmjs-push/logs/err.log /www/perfmjs-push/start.js --NODE_ENV=production --NODE_CONFIG_DIR=/www/perfmjs-push/config; tail -f /www/perfmjs-push/logs/out.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    var cluster = require('cluster');
    if (cluster.isMaster) {
        var cpuCount = 1;
        $$.logger.info("将启动" + cpuCount + "个工作线程......");
        //启动工作线程
        for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
        cluster.on('online', function(worker) {
            $$.logger.info('工作线程:' + worker.id + ' is online.');
        });
        cluster.on('exit', function(worker, code, signal) {
            $$.logger.info('工作线程：' + worker.id + ' 挂了，将重启一个新的工作线程…………,signal:' + signal);
            if (worker.id < 1000) {
                cluster.fork();
            }
        });
    } else {
        app.register(require('perfmjs-redis-cluster'));
        app.register(require("./lib/push/server/kc/push-server-kc"));
        app.startAll();
        $$.kcPushServer.instance.startup({port:18000});
    }
});