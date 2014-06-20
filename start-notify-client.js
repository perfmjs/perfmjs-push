/**
 * 应用入口函数
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    //主线程开启服务器推客户端
    var jsbfPushClient = require("./lib/push/server/jsbf/jsbf-push-client");
    app.register("jsbfPushClient", jsbfPushClient);
    app.start('jsbfPushClient');
});