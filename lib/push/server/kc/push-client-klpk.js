/**
 * 幸运赛车服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
if (typeof module !== 'undefined' && module.exports) {
    require('../../client/push-client');
}
perfmjs.plugin('klpkPushClient', function($$) {
    $$.base("pushClient.klpkPushClient", {
        /**
         * 连接的时候执行实始化操作
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param socketConn
         * @private
         */
        _initConn: function(socketConn) {
            var self = this;
            setInterval(function() {
                var redisPub = require("redis").createClient(6379, 'ali.no100.com');
                redisPub.publish("/realtimeApp/kc", (function() {
                    try {
                        var version = $$.utils.now().toString();
                        $$.logger.info("notifyAll:kc-push-client#version=" + version);
                        return JSON.stringify(self._buildJSONData({'version':$$.utils.now().toString(),'dataType':'jsbf','data':{}}));
                    } catch (err) {
                        return self._buildJSONData();
                    }
                })());
                redisPub.quit();
            }, 5000);
        },
        end: 0
    });
    $$.klpkPushClient.defaults = {
        socketURL: 'http://nodejs.no100.com/kc',
        transports: [],  //using websocket transport
        socketMaxReconnAttempts: 999999,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.klpkPushClient;
    }
    /*for Node.js end*/
});