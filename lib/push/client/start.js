/**
 * 应用入口函数
 */
require(['perfmjs', 'app', 'klpkPushClient'], function($$, app, klpkPushClient) {
    app.register("klpkPushClient", klpkPushClient);
    app.start('klpkPushClient');
});