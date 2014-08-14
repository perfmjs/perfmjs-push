/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /www/perfmjs-push-1.1.0/logs/forever.log -o logs/out.log -e logs/err.log start-server-cluster.js; tail -f ./logs/out.log
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
            if (worker.id < 100) {
                cluster.fork();
            }
        });
    } else {
        app.register('redisCluster', require('perfmjs-redis-cluster'));
        app.register('klpkPushServer', require("./lib/push/server/kc/push-server-klpk"));
        app.startAll();
        $$.klpkPushServer.instance.startup({port:18000});
    }
});