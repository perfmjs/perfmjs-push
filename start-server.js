/**
 * 应用入口函数
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
    app.start('jsbfPushServer');
    $$.jsbfPushServer.instance.startup({port:18000, room:"/jsbf"});
});