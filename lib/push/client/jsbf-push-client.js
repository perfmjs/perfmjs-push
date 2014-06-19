/**
 * 即时比分服务器推客户端
 * Created by Administrator on 2014/6/6.
 */
perfmjs.plugin('jsbfPushClient', function($$) {
    $$.base("base.pushClient.jsbfPushClient", {
        /**
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param jsonResult
         * @private
         */
        _doBusiness: function(jsonResult) {
            if (~~jsonResult.id < 1) {
                document.getElementById("renderId").innerHTML = "新数据来了：date=" + jsonResult.date + "/id=" + jsonResult.id;
                return;
            }
            document.getElementById("renderId").innerHTML = "新数据来了：date=" + jsonResult.date + "/id=" + jsonResult.id + "/issueList=" + jsonResult.result.issueList.join(',') + "/msg=" + jsonResult.msg;
        },
        end: 0
    }, $$.base.pushClient.prototype, $$.base.pushClient.defaults);
    $$.base.pushClient.jsbfPushClient.defaults = {
        socketURL: 'http://nodejs.no100.com/jsbf',
        end: 0
    };
});