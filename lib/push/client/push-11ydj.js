/**
 * 11ydj服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
define('dj11yPushClient', ['utils', 'base', 'pushClient'], function(utils, base, pushClient) {
    base("pushClient.dj11yPushClient", {
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
    base.dj11yPushClient.defaults = {
        socketURL: 'http://push.no100.com/11ydj',
        path: '/kc',
        end: 0
    };
    return base.dj11yPushClient;
});
//启动类
require(['app', 'dj11yPushClient'], function(app, dj11yPushClient) {
    app.registerAndStart(dj11yPushClient);
});