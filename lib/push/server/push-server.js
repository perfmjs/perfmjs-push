/**
 * socket.io服务端
 * FIXME： 开了"自由门"翻墙软件的时候，firefox狂刷请求
 * FIXME: 开了cluster功能后，打开firefox,ie6两个浏览器里的连接后，狂刷chome里的连接的时候,ie6和chome里的连接都会中断且过很久才能接收到数据或再也接收不到数据了
 * FIXME: NGINX里的ip_hash策略在这时候长连接有问题：其中一个节点没启动
 * @see /node_modules/socket.io/node_modules/engine.io/lib/server.js#Server.prototype.handleRequest
 * 从socket.io.client(v0.9.x)升级到socket.io.client(v1.x)可参考：https://github.com/Automattic/socket.io/wiki/Migrating-to-1.0
 * 参考#Restricting yourself to a room：http://socket.io/docs/
 * 压力测试：websocket-bench -a 100 -c 50 http://192.168.66.150:18000
 * Created by tony on 2014/5/21.
 */
require("perfmjs-node");
perfmjs.plugin('pushServer', function($$) {
    $$.base("pushServer", {
        init: function(eventProxy) {
            this.option('eventProxy', eventProxy).on($$.sysconfig.events.moduleIsReady, function() {$$.logger.info("ServerSide Pusher is Ready!");});
            this.option('redisSub', $$.redisCluster.instance.initStartupOptions(this.option('redisClusterNodes')));
            this.option('shred',  new (require("shred"))());
            return this;
        },
        /**
         * 开启socket服务
         * ref to: node_modules/socket.io/node_modules/engine.io/README.md
         * @param options, e.g. {redisSubPort:6379, redisSubHost: 'ali.no100.com', port:18000,rooms:['kc','ssq']}
         */
        startup: function(options) {
            options = $$.utils.extend({}, options);
            var self = this,
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
            $$.utils.forEach(this.option('rooms'), function(room, index) {
                $$.logger.info("Socket.IO Server Started with Port: " + options.port  + ", and room: " + room);
                server.of("/" + room).on('connection', function (socket) {
                    var redisClient;
                    try {
                        self.option('redisSub').subscribe(self.getPublishKey(room), function(err, reply, redis) {
                            if (err) {
                                $$.logger.error('error Occurred at redis subscribe: ' + err.message);
                                return;
                            }
                            redisClient = redis;
                            redis.on("message", function (channel, message) {
                                //TODO 权限校验，只允许同源域名或IP白名单访问该方法
                                self._emitTextMsg(socket, room, message);
                            });
                        });
                    } catch (err) {}
                    socket.on('disconnect', function () {
                        //redisClient池化以后就不用关闭连接了
                        //if (redisClient) {
                        //    redisClient.unsubscribe(self.option('redisChannelPrefix') + room);
                        //    redisClient.quit();
                        //    redisClient.end();
                        //}
                    });
                    socket.on('error', function(err) {
                        $$.logger.error("Socket.IO error occurred:" + err.message);
                    });
                    if (self.option('shouldInitDataOnConn')) {
                        self._initDataOnConn(socket, room);
                    }
                });
            });
            return server;
        },
        /**
         * 获取发布Redis的key
         * @param room e.g. 'ssq'
         * @returns {string}
         */
        getPublishKey: function(room) {
            return this.option('redisChannelPrefix') + "publish/" + room;
        },
        /**
         * 获取远程服务器数据,如果连接timeout则3秒后重新请求
         * @param remoteDataUrl
         * @param callback
         */
        getRemoteData: function(remoteDataUrl, callback) {
            var self = this;
            this.option('shred').get({
                url: remoteDataUrl,
                headers: {Accept: "application/json"}, timeout:{minutes: 0, seconds: 10}, //time out in 1 minute and 10 seconds
                on: {
                    response: function(response) {
                        callback(response.content.body);
                    }, timeout: function(request) {
                        $$.logger.info( '请求Timeout,3秒后重新请求, remoteDataUrl=' + self.option('remoteDataUrl'));
                        setTimeout(function() {
                            self.getRemoteData(remoteDataUrl, callback);
                        }, 3000);
                    }
                }
            });
        },
        /**
         * 根据业务情况，子类需要重写该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @param socket
         * @param room, e.g. "kc"
         * @returns {*}
         */
        _initDataOnConn: function(socket, room) {
            //noop
        },
        /**
         * 根据业务情况，子类需要重写该业务方法
         * 规范socket传递中的json格式的数据
         * @param room, e.g. "kc"
         * @param jsonData, e.g. {}
         */
        _specJSONData: function(room, jsonData) {
            return jsonData;
        },
        /**
         * 构建规范的推送消息的数据结构, 注意: <<version, dataType, data>>三个字段是必填字段
         * dataType maybe: 'kc'|'ssq'|'jc'|'common'
         * changeType maybe: '0'-新增数据|'1'-修改数据|'-1':删除数据
         * status maybe: 'success'|'fail'
         * @param options, e.g. {'version':'0', 'dataType':'common','data':{}};
         * @returns {*}
         * @private
         */
        _buildJSONData: function(options) {
            return $$.utils.extend({'version':'0','dataType':'common','data':{},'changeType':'0','feature':{},'status':'success'}, options);
        },
        /**
         * 推送数据
         * @param socket
         * @param room
         * @param jsonTextMsg
         * @private
         */
        _emitTextMsg: function(socket, room, jsonTextMsg) {
            var self = this;
            socket.emit("message", (function() {
                try {
                    return self._specJSONData(room, JSON.parse(jsonTextMsg));
                } catch (err) {
                    return self._buildJSONData();
                }
            })());
        },
        end: 0
    });
    $$.pushServer.defaults = {
        shred: {},
        rooms:['xxxx'],
        remoteDataUrls: {'xxxx':'http://xxx.com/yyy'},
        redisSub: {},
        redisClusterNodes: [{host:'*.*.*.*',port:1000}, {host:'*.*.*.*',port:1001}, {host:'*.*.*.*',port:1002}],
        redisChannelPrefix: '/realtimeApp/',
        shouldInitDataOnConn: true,
        eventProxy: {},
        scope: 'singleton',
        end: 0
    };
});
