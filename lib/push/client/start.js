/**
 * 应用入口函数
 */
perfmjs.ready(function($$, app) {
    app.register("klpkPushClient", $$.klpkPushClient);
    app.start('klpkPushClient');
});