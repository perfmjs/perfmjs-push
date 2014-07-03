/**
 * 服务器推client助手类,保持IE客户端连接5次/分钟的连接请求
 * 注意：每个页面只允许有一个服务器推客户端连接存在
 * 参考：http://socket.io/docs/
 * 　　　https://github.com/Automattic/socket.io-client
 * Created by tony on 2014/5/21.
 */
if (typeof module !== 'undefined' && module.exports) {
    require('perfmjs-node');
}
perfmjs.plugin('pushClient', function($$) {
    $$.base("base.pushClient", {
        init: function(eventProxy) {
            this.options['eventProxy'] = eventProxy;
            this._startup();
            return this;
        },

        /**
         * 启动长连接业务服务
         * @private
         */
        _startup: function() {
          var self = this;
          if (this.options['socketEnabled']) {
              this._openSocketConnect(this.options['socketURL'], this.options['path']);
              this.options['socketFirstRetryInterval'] = setInterval(function () {
                  if (self.options['socketConnectedCount'] > 0 || self.options['socketReconnCount'] > self.options['socketMaxReconnAttempts']) {
                      if (typeof self.options['socketFirstRetryInterval'] !== 'undefined') {
                          clearInterval(self.options['socketFirstRetryInterval']);
                      }
                      return;
                  }
                  self._openSocketConnect(self.options['socketURL'], self.options['path']);
              }, this.options['socketFirstRetryDelay']);
          }
        },

        /**
         * 打开socket连接
         * @param url，e.g. 'http://nodejs.no100.com/jsbf'
         * @param path, e.g. '/socket.io'
         * @private
         */
        _openSocketConnect: function(url, path) {
            this.options['socketReconnCount'] += 1;
            var self = this, socketConn = ((typeof module !== 'undefined' && module.exports)?require('socket.io-client'):io).connect(url, {
                'path': path,
                'forceNew': true,
                'transports': self.options['transports'],
                'upgrade': true,
                'rememberUpgrade': true,
                'priorWebsocketSuccess': true,
                'reconnection': false,
                //'reconnectionDelay': 10*1000,
                //'reconnectionDelayMax': 5*60*1000, //重连间隔最多为５分钟
                //'reconnectionAttempts': 50, //最多重连50次
                'timeout': 10000
            });
            socketConn.on("connect", function() {
                self.options['socketReconnCount'] = 0;
                self.options['socketConnectedCount'] += 1;
                if (typeof self.options['socketReconnInterval'] !== 'undefined') {
                    clearInterval(self.options['socketReconnInterval']);
                }
                self._initConn(socketConn);
            });
            socketConn.on("message", function (jsonData) {
                try {
                    self._doBusiness(jsonData);
                } catch (err) {}
            });
            socketConn.on("disconnect", function() {
                socketConn.destroy();
                socketConn.close();
                //断开后重新连接
                self._openSocketConnect(url, path);
                self.options['socketReconnInterval'] = setInterval(function() {
                    if (self.options['socketReconnCount'] > self.options['socketMaxReconnAttempts']) {
                        if (typeof self.options['socketReconnInterval'] !== 'undefined') {
                            clearInterval(self.options['socketReconnInterval']);
                        }
                        return;
                    }
                    self._openSocketConnect(url, path);
                }, self.options['socketReconnDelay']);
            });
        },

        /**
         * 连接的时候执行实始化操作
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param socketConn
         * @private
         */
        _initConn: function(socketConn) {
        },

        /**
         * 据据业务情况，子类需要重写该业务处理逻辑
         * @param jsonData
         * @private
         */
        _doBusiness: function(jsonData) {
        },

        /**
         * 构建规范的推送消息的数据结构, 注意: <<version, dataType, data>>三个字段是必填字段
         * changeType maybe: '0'-新增数据|'1'-修改数据|'-1':删除数据
         * dataType maybe: 'jsbf'|'ssq'|'jc'
         * @param options, e.g. {'version':$$.utils.now().toString(),'dataType':'jsbf','result':{}}
         * @returns {*}
         * @private
         */
        _buildJSONData: function(options) {
            return $$.utils.extend({'version':'0','dataType':'common','data':{},'changeType':'0','feature':{}}, options);
        },
        end: 0
    });
    $$.base.pushClient.defaults = {
        socketEnabled: true,
        socketURL: 'http://xxx.yyy.com/namespace',
        path: '/socket.io',
        transports: ['polling', 'websocket'],
        socketFirstRetryInterval: undefined,
        socketFirstRetryDelay: 10*1000,
        socketReconnInterval: undefined,
        socketReconnDelay: 10*1000,
        socketReconnCount: 0,
        socketConnectedCount: 0,
        socketMaxReconnAttempts: 120, //最大重连30次（即重连20分钟）
        eventProxy: {},
        scope: 'singleton',
        end: 0
    };
});