/**
 * gxk3服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
define('gxk3PushClient', ['utils', 'base', 'pushClient'], function(utils, base, pushClient) {
    base("pushClient.gxk3PushClient", {
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
            document.getElementById("renderId").innerHTML = '新数据来了' + utils.debugJSON(jsonData);
        },
        end: 0
    });
    base.gxk3PushClient.defaults = {
        socketURL: 'http://push.no100.com/gxk3',
        path: '/kc',
        end: 0
    };
    return base.gxk3PushClient;
});
//启动类
require(['app', 'gxk3PushClient'], function(app, gxk3PushClient) {
    app.registerAndStart(gxk3PushClient);
});