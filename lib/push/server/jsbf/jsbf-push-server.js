/**
 * 即时比分服务端推送
 * Created by Administrator on 2014/6/6.
 */
if (typeof module !== 'undefined' && module.exports) {
    require("../push-server");
}
perfmjs.plugin('jsbfPushServer', function($$) {
    $$.base("pushServer.jsbfPushServer", {
        init: function (eventProxy) {
            this._super('init', eventProxy);
            return this;
        },

        /**
         * 根据业务情况，子类需要重写该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @param namespace, e.g. "jsbf"
         * @returns {*}
         */
        _buildInitDataOnConn: function(namespace) {
            return this._buildJSONData({'version':'0','dataType':namespace||'common','data':{}});
        },

        /**
         * 根据业务情况，子类应继承该业务方法
         * 规范socket传递中的json格式的数据
         * @param namespace, e.g. "jsbf"
         * @param jsonData
         */
        _specJSONData: function(namespace, jsonData) {
            return jsonData;
        },
        end: 0
    });
    $$.jsbfPushServer.defaults = {
        shouldBuildInitDataOnConn: true,
        end: 0
    };
    /*for Node.js begin*/
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = perfmjs.jsbfPushServer;
    }
    /*for Node.js end*/
});