/**
 * 应用入口函数
 */
perfmjs.ready(function($$, app) {
    app.register("jsbfPushClient", $$.jsbfPushClient);
    app.startAll();
});