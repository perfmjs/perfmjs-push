/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /tmp/push-server-forever.log -o ./logs/out.log -e logs/push-server-err.log start-server-cluster.js; tail -f ./logs/push-server-out.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    require('sticky-session')(function () {
        app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
        app.start('jsbfPushServer');
       return $$.jsbfPushServer.instance.startup({redisSubPort:6379, redisSubHost: 'ali.no100.com', port:18000, rooms:['jsbf']});
    });
});