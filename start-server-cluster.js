/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /tmp/push-server-forever.log -o ./logs/out.log -e logs/push-server-err.log start-server-cluster.js; tail -f ./logs/push-server-out.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
        app.register('redisCluster', require('perfmjs-redis-cluster'));
        app.register('xyscPushServer', require("./lib/push/server/kc/push-server-xysc"));
        app.startAll();
        var startNodes = [{host:'218.244.156.175',port:7000}, {host:'218.244.156.175',port:7001}, {host:'218.244.156.175',port:7002}];
        return $$.xyscPushServer.instance.startup({redisClusterNodes:startNodes, port:18000, rooms:['klpk']});
});