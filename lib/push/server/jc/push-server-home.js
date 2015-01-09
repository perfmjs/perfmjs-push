/**
 * quiz服务端推送
 */
require("../push-server");
perfmjs.plugin('quizHome', function($$) {
	$$.base("pushServer.quizHome", {
		init : function(eventProxy) {
			this._super('init', eventProxy);
			this.createHanlderMap();
			return this;
		},
		createHanlderMap : function() {
			/* room home begin */
			var handlerHome = {};
			handlerHome.init = function(data, socket) {
				
			}
			handlerHome.odds = function(data, socket) {

			}
			var handlerHomeRedis = {};
			handlerHomeRedis.odds = function(data, socket) {
				
			}
			/* room home end */
			/* room guess begin */
			var handlerGuess = {};
			handlerGuess.init = function(data, socket) {
                if (!socket._data) {
                    socket._data = {};
                }
                socket._data.raceId = data.raceId;
			}
			handlerGuess.odds = function(data, socket) {

			}
			var handlerGuessRedis = {};
			handlerGuessRedis.odds = function(data, socket) {
			}
			/* room guess end */
			this.clientHandlers={};
			this.clientHandlers.home=handlerHome;
			this.clientHandlers.guess=handlerGuess;
			this.redisHandlers={};
			this.redisHandlers.home=handlerHomeRedis;
			this.redisHandlers.guess=handlerGuessRedis;
		},
        /**
         * 处理每个客户端连接发过来的数据
         * @param socket
         * @param data
         * @param room
         * @private
         */
        _onMessage: function(socket, data, room) {
            //$$.logger.info("server receives from CLIENT1111111111111111111111111, room:" + room);
            var handler, self = this, jsonObj = data;
            if(typeof(data) === "string"){
                jsonObj = JSON.parse(data);
            }
            var a = jsonObj.a;
            //$$.logger.info("a:" + a);
            if (self.clientHandlers) {
                if (room == "home") {
                    handler = self.clientHandlers.home[a];
                } else if (room == "guess") {
                    handler = self.clientHandlers.guess[a];
                }
                if (handler) {
                    handler.apply(self, [jsonObj.d, this]);
                }
            }
        },
        /**
         * 判断是否要执行socket.packet方法发送数据给浏览器端
         * @param data
         * @param room
         * @return 返回true则应执行socket.packet方法，否则返回false或undefined则不应执行socket.packet方法
         * @private
         */
        _shouldDoPacket: function(data, room) {
            var socket=this;
            var msg = arguments[0];
            //$$.logger.info("roommmmmmmmmmmmmmmmmmmmmmmmmmmmmm:" + room);
            if (room == "home") {
                return true;
            } else if (room == "guess") {
                msg+="";
                if (msg) {
                    var _msg = msg.replace(/.*\/guess,/, "");
                    if (_msg) {
                        var msgJson = JSON.parse(_msg);
                        if (msgJson[1]) {
                            msgObj = msgJson[1];
                            if (msgObj.a == "odds") {
                                if (msgObj.d && msgObj.d.race) {
                                    var raceId = msgObj.d.race[0]; // 从redis推过来的raceId
                                    if (!socket._data) {
                                        socket._data = {};
                                    }
                                    var bettingRaceId = socket._data.raceId; // 竞猜的raceId
                                    if (bettingRaceId == raceId) {
                                        // 发送消息
                                        //$$.logger.info("Id匹配,推到页面,"+"bettingRaceId:" + bettingRaceId + ",raceId:" + raceId);
                                        return true;
                                    } else {
                                        //$$.logger.info("Id不匹配,不推到页面,"+"bettingRaceId:" + bettingRaceId + ",raceId:" + raceId);
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return true;
        },
		/**
		 * 根据业务情况，子类应继承该业务方法 规范socket传递中的json格式的数据
		 * 
		 * @param room,
		 *            e.g. "home"
		 * @param jsonData,
		 *            e.g. {}
		 */
		_specJSONData : function(room, jsonData) {
			return jsonData;
		},
		end : 0
	});
	$$.quizHome.defaults = {
		path : '/jc',
		rooms : ["home", "guess"],
		remoteDataUrls : {},
		shouldInitDataOnConn : false,
		end : 0
	};
	/* for Node.js begin */
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = perfmjs.quizHome;
	}
	/* for Node.js end */
});
