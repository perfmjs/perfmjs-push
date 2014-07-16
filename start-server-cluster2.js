/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /tmp/push-server-forever.log -o ./logs/out.log -e logs/push-server-err.log start-server-cluster.js; tail -f ./logs/push-server-out.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
//    require('sticky-session')(function () {
        app.register('xyscPushServer', require("./lib/push/server/jsbf/push-server-xysc"));
        app.start('xyscPushServer');
        return $$.xyscPushServer.instance.startup({redisSubPort:6379, redisSubHost: '192.168.66.47', port:18001, rooms:['xysc']});
//    });
});