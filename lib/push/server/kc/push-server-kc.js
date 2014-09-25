/**
 * 幸运赛车服务端推送
 * Created by Administrator on 2014/6/6.
 */
require("../push-server");
perfmjs.plugin('kcPushServer', function($$) {
    $$.base("pushServer.kcPushServer", {
        init: function (eventProxy) {
            this._super('init', eventProxy);
            return this;
        },
        /**
         * 根据业务情况，子类需要重写该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @param socket
         * @param room, e.g. "klpk"
         * @returns {*}
         */
        _initDataOnConn: function(socket, room) {
            var self = this;
            this.option('redisSub').get(this.getStoredLastDataKey(room), function(err, reply) {
                if (err) {
                    $$.logger.error('error on init Data on Connection: ' + err.message);
                    return;
                }
                if (reply) {
                    try {
                        var jsonData = JSON.parse(reply);
                        if (jsonData['feature'] && jsonData['feature']['expireTime']) {
                            var expireTime = jsonData['feature']['expireTime'];
                            var leftTime = $$.utils.toNumber((expireTime - $$.utils.now())/1000);
                            jsonData['data']['leftTime'] = leftTime;
                            self._emitTextMsg(socket, room, JSON.stringify(jsonData));
                            return;
                        }
                    } catch (err) {
                        $$.logger.error('error on parse reply while initDataOnConn: ' + err.message);
                    }
                }
                if (!$$.utils.toBoolean(self.option('remoteDataUrls')[room])) {
                    $$.logger.error("room:" + room + " is undefined in option: remoteDataUrls!");
                    return;
                }
                self.getRemoteData(self.option('remoteDataUrls')[room] + '&time=' + $$.utils.now(), function(responseText) {
                    var jsonData = $$.utils.fmtJSONMsg(responseText);
                    if (jsonData.status === 'success') {
                        var unionId = jsonData.result.nextTerm + "-" + jsonData.result.openTerm + "-" + jsonData.result.result;
                        self._emitTextMsg(socket, room, JSON.stringify(self._buildJSONData({'version':unionId,'dataType':room,'data':jsonData.result})));
                    }
                });
            });
        },
        /**
         * 根据业务情况，子类应继承该业务方法
         * 规范socket传递中的json格式的数据
         * @param room, e.g. "klpk"
         * @param jsonData, e.g. {}
         */
        _specJSONData: function(room, jsonData) {
            return jsonData;
        },
        end: 0
    });
    $$.kcPushServer.defaults = {
        path: '/kc',
        rooms: ['gd11x5', '11ydj', 'gxk3', 'klpk'],
        remoteDataUrls: {
            'gd11x5':'http://www.aicai.com/lottery/kc!kc11x5.jhtml?gameIndex=305',
            '11ydj':'http://www.aicai.com/lottery/kc!kc11x5.jhtml?gameIndex=303',
            'gxk3':'http://www.aicai.com/lottery/kc!kc3.jhtml?gameIndex=316',
            'klpk':'http://sina.aicai.com/lotnew/kc/kc.htm?gameIndex=314'
        },
        shouldInitDataOnConn: true,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.kcPushServer;
    }
    /*for Node.js end*/
});