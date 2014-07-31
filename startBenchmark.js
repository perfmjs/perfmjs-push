/**
 * websocket性能测试
 * Created by Administrator on 2014/7/30.
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    app.register('klpkPushClient', require('./lib/push/server/kc/push-client-klpk'));
    app.startAll();
    for (var i = 1; i <= 9000; i++) {
        $$.logger.info(i);
        $$.klpkPushClient.instance._startup();
    }
});