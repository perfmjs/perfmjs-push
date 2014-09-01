/**
 * 按模块加载加载应用所需的js和css文件
 * sources e.g. [{n:'common',f:'http://s.no100.com/perfmjs/js/core2/include-common.js',t:'js',m:'jq;dlt',d:'http://s.no100.com'}]
 * combineUrls e.g. []
 */
require(['utils', 'loader'], function(utils, loader) {
    loader.loadModules({name:'push-comm', type:'js', mdCallback:function(source, module, combineUrls) {
        if (module === 'push') {
            if (!utils.isH5Support()) {
                combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/json3.min.js';
            }
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/pushclient.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/push-klpk.js';
        }
    }, afterLoadedCallback:function() {
        require(['app', 'klpkPushClient'], function(app, klpkPushClient) {
            app.registerAndStart(klpkPushClient);
        });
    }});
});