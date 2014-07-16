/**
 * 幸运赛车服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
perfmjs.plugin('xyscPushClient', function($$) {
    $$.base("pushClient.xyscPushClient", {
        /**
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param jsonData
         * @private
         */
        _doBusiness: function(jsonData) {
            document.getElementById("renderId").innerHTML = '新数据来了' + $$.utils.debugJSON(jsonData);
        },
        end: 0
    });
    $$.xyscPushClient.defaults = {
        socketURL: 'http://nodejs.no100.com/xysc',
        end: 0
    };
});