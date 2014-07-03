/**
 * 应用入口函数
 */
perfmjs.ready(function($$, app) {
    app.register("ssqPushClient", $$.ssqPushClient);
    app.start('ssqPushClient');
});