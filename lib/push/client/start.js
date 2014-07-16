/**
 * 应用入口函数
 */
perfmjs.ready(function($$, app) {
    app.register("xyscPushClient", $$.xyscPushClient);
    app.start('xyscPushClient');
});