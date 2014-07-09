/**
 * socket.io服务端
 * FIXME： 开了"自由门"翻墙软件的时候，firefox狂刷请求
 * FIXME: 开了cluster功能后，打开firefox,ie6两个浏览器里的连接后，狂刷chome里的连接的时候,ie6和chome里的连接都会中断且过很久才能接收到数据或再也接收不到数据了
 * FIXME: NGINX里的ip_hash策略在这时候长连接有问题：其中一个节点没启动
 * @see /node_modules/socket.io/node_modules/engine.io/lib/server.js#Server.prototype.handleRequest
 * 从socket.io.client(v0.9.x)升级到socket.io.client(v1.x)可参考：https://github.com/Automattic/socket.io/wiki/Migrating-to-1.0
 * 参考#Restricting yourself to a namespace：http://socket.io/docs/
 * 压力测试：websocket-bench -a 100 -c 50 http://192.168.66.150:18000
 * Created by tony on 2014/5/21.
 */
require("perfmjs-node");
perfmjs.plugin('pushServer', function($$) {
    $$.base("pushServer", {
        init: function(eventProxy) {
            (this.options['eventProxy'] = eventProxy).on($$.sysconfig.events.moduleIsReady, function() {$$.logger.info("ServerSide Pusher is Ready!");});
            return this;
        },

        /**
         * 开启socket服务
         * ref to: node_modules/socket.io/node_modules/engine.io/README.md
         * @param options, e.g. {redisSubPort:6379, redisSubHost: 'ali.no100.com', port:18000,rooms:['jsbf','ssq']}
         */
        startup: function(options) {
            options = $$.utils.extend({}, options);
            var self = this, redis = require('redis'),
            server = require('socket.io').listen(options.port, {
                'path': '/socket.io',
                'origins': '*:*',
                'transports':['polling', 'websocket'], //'transports':['polling-jsonp', 'polling-xhr', 'polling', 'websocket'],
                'pingTimeout': 10000,
                'pingInterval': 30000,  //default is 60000毫秒
                //'maxHttpBufferSize': 30*1024,  //30KB, 防Dos攻击
                'allowUpgrades': true,
                'cookie': 'sid'
            });

            $$.utils.forEach(options.rooms, function(room, index) {
                $$.logger.info("Socket.io Server Started with Port: " + options.port  + ", and room: " + room);
                server.of("/" + room).on('connection', function (socket) {
                    //add redis subscribe client
                    var redisSub;
                    try {
                        redisSub = redis.createClient(options.redisSubPort, options.redisSubHost);
                        redisSub.subscribe(self.options['channelPrefix'] + room);
                        redisSub.on("message", function (channel, message) {
                            //TODO 权限校验，只允许同源域名或IP白名单访问该方法
                            socket.emit("message", (function() {
                                try {
                                    return self._specJSONData(room, JSON.parse(message));
                                } catch (err) {
                                    return self._buildJSONData();
                                }
                            })());
                        });
                    } catch (err) {}
                    socket.on('disconnect', function () {
                        if (redisSub) {
                            redisSub.unsubscribe(self.options['channelPrefix'] + room);
                            redisSub.quit();
                            redisSub.end();
                        }
                    });
                    if (self.options['shouldBuildInitDataOnConn']) {
                        socket.emit("message", (function() {
                            try {
                                return self._buildInitDataOnConn(room);
                            } catch (err) {
                                return self._buildJSONData();
                            }
                        })());
                    }
                });
            });
            return server;
        },

        /**
         * 根据业务情况，子类应继承该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @param namespace, e.g. "jsbf"
         * @returns {*}
         */
        _buildInitDataOnConn: function(namespace) {
            return this._buildJSONData({'version':'0','dataType':namespace||'common','data':{}});
        },

        /**
         * 根据业务情况，子类需要重写该业务方法
         * 规范socket传递中的json格式的数据
         * @param namespace, e.g. "jsbf"
         * @param jsonData
         */
        _specJSONData: function(namespace, jsonData) {
            return jsonData;
        },

        /**
         * 构建规范的推送消息的数据结构, 注意: <<version, dataType, data>>三个字段是必填字段
         * dataType maybe: 'jsbf'|'ssq'|'jc'|'common'
         * changeType maybe: '0'-新增数据|'1'-修改数据|'-1':删除数据
         * status maybe: 'success'|'fail'
         * @param options, e.g. {'version':'0', 'dataType':'common','data':{}};
         * @returns {*}
         * @private
         */
        _buildJSONData: function(options) {
            return $$.utils.extend({'version':'0','dataType':'common','data':{},'changeType':'0','feature':{},'status':'success'}, options);
        },
        end: 0
    });
    $$.pushServer.defaults = {
        channelPrefix: '/realtimeApp/',
        shouldBuildInitDataOnConn: true,
        eventProxy: {},
        scope: 'singleton',
        end: 0
    };
});
