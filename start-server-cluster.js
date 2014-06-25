/**
 * 应用入口函数, FIXME 集群有点问题待完善
 */
require("perfmjs-node");
perfmjs.ready(function($$, app) {
    var sticky = require('sticky-session');
    sticky(function () {
        app.register('jsbfPushServer', require("./lib/push/server/jsbf/jsbf-push-server"));
        app.start('jsbfPushServer');
       return $$.jsbfPushServer.instance.startup({port:18000, room:"/jsbf"});
    });
});