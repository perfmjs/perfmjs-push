/**
 * 快乐扑克服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
define('klpkPushClient', ['perfmjs', 'pushClient'], function($$, pushClient) {
    $$.base("pushClient.klpkPushClient", {
        init: function(eventProxy) {
            this.options['eventProxy'] =  eventProxy;
            this._startup();
            return this;
        },
        /**
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param jsonData
         * @private
         */
        _doBusiness: function(jsonData) {
            document.getElementById("renderId").innerHTML = '新数据来了' + $$.utils.debugJSON(jsonData);
        },
        end: 0
    });
    $$.klpkPushClient.defaults = {
        socketURL: 'http://nodejs.no100.com/klpk',
        end: 0
    };
    return $$.klpkPushClient;
});