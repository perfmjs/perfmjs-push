/**
 * 应用入口函数
 * 后台启动 /usr/local/node/bin/forever start -a -l /tmp/push-client-forever.log -o ./logs/out.log -e logs/push-client-err.log start-notify-client.js; tail -f ./logs/push-client-out.log
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    setInterval(function() {
        var redisPub = require("redis").createClient(6379, 'ali.no100.com');
        redisPub.publish("/realtimeApp/jsbf", (function () {
            var version = $$.utils.now().toString();
            $$.logger.info("notifyAll:jsbf-push-client#version=" + version);
            return JSON.stringify({'version': $$.utils.now().toString(), 'dataType': 'jsbf', 'data': {}});
        })());
        redisPub.quit();
    }, 5000);
});