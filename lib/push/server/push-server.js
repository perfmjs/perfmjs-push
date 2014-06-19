/**
 * socket.io服务端
 * 从socket.io.client(v0.9.x)升级到socket.io.client(v1.x)可参考：https://github.com/Automattic/socket.io/wiki/Migrating-to-1.0
 * 参考#Restricting yourself to a namespace：http://socket.io/docs/
 * 压力测试：websocket-bench -a 100 -c 50 http://192.168.66.150:18000
 * Created by tony on 2014/5/21.
 */
require("perfmjs-node");
perfmjs.plugin('pushServer', function($$) {
    $$.base("base.pushServer", {
        init: function(eventProxy) {
            (this.options['eventProxy'] = eventProxy).on($$.sysconfig.events.moduleIsReady, function() {$$.logger.info("ServerSide Pusher is Ready!");});
            return this;
        },

        /**
         * 开启socket服务
         * ref to: node_modules/socket.io/node_modules/engine.io/README.md
         * @param port e.g. 18000
         * @param room e.g. "/jsbf"
         */
        startup: function(server, socketIO, port, room) {
            var self = this;
            var io_of_room = socketIO(server, {
                'path': '/socket.io',
                'origins': '*:*',
                'transports':['polling-xhr', 'polling-jsonp', 'polling', 'websocket'],
                'pingTimeout': 5000,
                'pingInterval': 10000,  //default is 60000
                //'maxHttpBufferSize': 30*1024,  //30KB, 防Dos攻击
                'allowUpgrades': true
            }).of(room);
            server.listen(port);
            $$.logger.info("Socket.io Server Started with Port: " + port  + ", and room: " + room);

//            io_of_room.use(function(socket, next) {
//                //$$.logger.info('请求信息：' + socket.request);
//                next();
//            });

            io_of_room.on('connection', function (socket) {
                self.options['socketConnCount'] += 1;
                $$.logger.info('共' + self.options['socketConnCount'] + "个客户端新连接..." + socket.id);
                socket.on("notifyAll", function(jsonResult) {
                    //TODO 权限校验，只允许同源域名或IP白名单访问该方法
                    io_of_room.emit("message", (function() {
                        try {
                            return self._specJSONResult(jsonResult);
                        } catch (err) {
                            return {};
                        }
                    })());
                });
                socket.on('disconnect', function () {
                    self.options['socketConnCount'] -= 1;
                    //$$.logger.info(self.options['socketConnCount'] + ",一个连接关闭了..." + socket.id);
                });
                if (self.options['shouldBuildInitDataOnConn']) {
                    socket.emit("message", (function() {
                        try {
                            return self._buildInitDataOnConn();
                        } catch (err) {
                            return {};
                        }
                    })());
                }
            });
        },

        /**
         * 根据业务情况，子类应继承该业务方法
         * 给每个客户端连接返回实时的初始数据
         * @returns {*}
         */
        _buildInitDataOnConn: function() {
            this.options['socketData'] = {'id':0, 'date':0};
            return this.options['socketData'];
        },

        /**
         * 根据业务情况，子类需要重写该业务方法
         * 规范socket传递中的json格式的数据
         * @param jsonResult
         */
        _specJSONResult: function(jsonResult) {
            this.options['socketData'] = jsonResult;
            return this.options['socketData'];
        },
        end: 0
    });
    $$.base.pushServer.defaults = {
        shouldBuildInitDataOnConn: true,
        socketData: {}, //需要定义成和dataChange一致的数据结构
        socketConnCount: 0,
        eventProxy: {},
        scope: 'singleton',
        end: 0
    };
});
