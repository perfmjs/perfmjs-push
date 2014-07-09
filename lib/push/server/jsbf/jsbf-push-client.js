/**
 * 即时比分服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
if (typeof module !== 'undefined' && module.exports) {
    require('../../client/push-client');
}
perfmjs.plugin('jsbfPushClient', function($$) {
    $$.base("pushClient.jsbfPushClient", {
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
                redisPub.publish("/realtimeApp/jsbf", (function() {
                    try {
                        var version = $$.utils.now().toString();
                        $$.logger.info("notifyAll:jsbf-push-client#version=" + version);
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
    $$.jsbfPushClient.defaults = {
        socketURL: 'http://nodejs.no100.com/jsbf',
        transports: undefined,  //using websocket transport
        socketMaxReconnAttempts: 999999,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.jsbfPushClient;
    }
    /*for Node.js end*/
});