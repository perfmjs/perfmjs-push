/**
 * 按模块加载加载应用所需的js和css文件
 * sources e.g. [{n:'common',f:'http://s.no100.com/perfmjs/js/core2/include-common.js',t:'js',m:'jq;dlt',d:'http://s.no100.com'}]
 * combineUrls e.g. []
 */
require(['utils', 'loader'], function(utils, loader) {
    loader.loadModules({name:'push-comm', mdCallback:function(source, module, combineUrls) {
        if (module === 'push-11ydj') {
            if (!utils.isH5Support()) {
                combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/json3.min.js';
            }
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/pushclient.min.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/push-11ydj.js';
        } else if (module === 'push-klpk') {
            if (!utils.isH5Support()) {
                combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/json3.min.js';
            }
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/pushclient.min.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/push-klpk.js';
        } else if (module === 'push-gxk3') {
            if (!utils.isH5Support()) {
                combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/json3.min.js';
            }
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/pushclient.min.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/push-gxk3.js';
        }
    }, afterLoadedCallback:function() {}});
});