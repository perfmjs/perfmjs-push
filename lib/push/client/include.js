/**
 * 按模块加载加载应用所需的js和css文件
 * sources e.g. [{n:'common',f:'http://s.no100.com/perfmjs/js/core2/include-common.js',t:'js',m:'jq;dlt',d:'http://s.no100.com'}]
 * combineUrls e.g. []
 * import loadres.js
 */
!(function() {
	perfmjs.includeres.loadModules({name:'socketio-comm', type:'js', mdCallback:function(source, module, combineUrls) {
		//按模块加载资源文件
		if (module === 'socketio') {
            if (!perfmjs.utils.isH5Supported()) {
                combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/json3.min.js';
            }
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/socket.io.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/push-client.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/jsbf-push-client.js';
            combineUrls[combineUrls.length] = 'http://nodeclient.no100.com/start.js';
		}
	}, afterLoadedCallback:function() {
    }});
})();