/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /www/perfmjs-push-1.0.8/logs/forever2.log -o logs/out2.log -e logs/err2.log start-server-cluster2.js; tail -f ./logs/out2.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    app.register('redisCluster', require('perfmjs-redis-cluster'));
    app.register('klpkPushServer', require("./lib/push/server/kc/push-server-klpk"));
    app.startAll();
    setTimeout(function() {
        $$.klpkPushServer.instance.startup({port:18001});
    }, 2000);
});