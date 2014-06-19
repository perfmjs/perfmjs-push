/**
 * 即时比分服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
if (typeof module !== 'undefined' && module.exports) {
    require('../../client/push-client');
}
perfmjs.plugin('jsbfPushClient', function($$) {
    $$.base("base.pushClient.jsbfPushClient", {
        /**
         * 连接的时候执行实始化操作
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param socketConn
         * @private
         */
        _initConn: function(socketConn) {
            setInterval(function() {
                socketConn.emit('notifyAll', (function() {
                    try {
                        return {'id': -8888, 'date': (new Date).getTime()};
                    } catch (err) {$$.logger.error(err);}
                })());
            }, 8000);
        },
        end: 0
    }, $$.base.pushClient.prototype, $$.base.pushClient.defaults);
    $$.base.pushClient.jsbfPushClient.defaults = {
        socketURL: 'http://localhost:18000/jsbf',
        transports: ['websocket'],
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.jsbfPushClient;
    }
    /*for Node.js end*/
});