/**
 * 幸运赛车服务端推送
 * Created by Administrator on 2014/6/6.
 */
if (typeof module !== 'undefined' && module.exports) {
    require("../push-server");
}
perfmjs.plugin('xyscPushServer', function($$) {
    $$.base("pushServer.xyscPushServer", {
        init: function (eventProxy) {
            this._super('init', eventProxy);
            return this;
        },
        /**
         * 根据业务情况，子类需要重写该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @param socket
         * @param room, e.g. "xysc"
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
         * @param room, e.g. "xysc"
         * @param jsonData, e.g. {}
         */
        _specJSONData: function(room, jsonData) {
            return jsonData;
        },
        end: 0
    });
    $$.xyscPushServer.defaults = {
        remoteDataUrls: {'xysc':'http://www.aicai.com/lotnew/kc/kc.htm?gameIndex=313'},
        shouldBuildInitDataOnConn: true,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.xyscPushServer;
    }
    /*for Node.js end*/
});