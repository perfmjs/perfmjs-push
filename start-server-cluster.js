/**
 * 应用入口函数
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    require('sticky-session')(function () {
        app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
        app.start('jsbfPushServer');
       return $$.jsbfPushServer.instance.startup({redisSubPort:6379, redisSubHost: 'ali.no100.com', port:18000, rooms:['jsbf', 'ssq']});
    });
});