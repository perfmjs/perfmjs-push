/**
 * 快乐扑克服务器推客户端
 * Created by Administrator on 2014/7/30.
 */
if (typeof module !== 'undefined' && module.exports) {
    require('../../client/push-client');
}
perfmjs.plugin('klpkPushClient', function($$) {
    $$.base("pushClient.klpkPushClient", {
        init: function(eventProxy) {
            this.option('eventProxy', eventProxy).on($$.sysconfig.events.moduleIsReady, function() {$$.logger.info("klpk Push Client is Ready!");});
            return this;
        },
        _doBusiness: function(jsonData) {
            //$$.logger.info($$.utils.debugJSON(jsonData));
            if (jsonData['version'] == '0') {
                $$.logger.info('fail');
            }
            return;
        },
        end: 0
    });
    $$.klpkPushClient.defaults = {
        socketURL: 'http://localhost:18000/klpk',
        transports: ['websocket'],  //using websocket transport
        socketMaxReconnAttempts: 999999,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.klpkPushClient;
    }
    /*for Node.js end*/
});