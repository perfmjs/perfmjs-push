/**
 * 幸运赛车服务端推送
 * Created by Administrator on 2014/6/6.
 */
require("../push-server");
perfmjs.plugin('klpkPushServer', function($$) {
    $$.base("pushServer.klpkPushServer", {
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
            if (!$$.utils.toBoolean(this.option('remoteDataUrls')[room])) {
                $$.logger.info("room is undefined in option: remoteDataUrls!");
            }
            this.getRemoteData(this.option('remoteDataUrls')[room] + '&time=' + $$.utils.now(), function(responseText) {
                var jsonData = $$.utils.fmtJSONMsg(responseText);
                if (jsonData.status === 'success') {
                    var unionId = jsonData.result.nextTerm + "-" + jsonData.result.openTerm + "-" + jsonData.result.result;
                    self._emitTextMsg(socket, room, JSON.stringify(self._buildJSONData({'version':unionId,'dataType':room,'data':jsonData.result})));
                }
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
    $$.klpkPushServer.defaults = {
        rooms: ['klpk'],
        redisClusterNodes: [{host:'192.168.66.47',port:7000}, {host:'192.168.66.47',port:7001}, {host:'192.168.66.47',port:7002}],
        remoteDataUrls: {'klpk':'http://sina.aicai.com/lotnew/kc/kc.htm?time=1405581063067&gameIndex=314'},
        shouldInitDataOnConn: true,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.klpkPushServer;
    }
    /*for Node.js end*/
});