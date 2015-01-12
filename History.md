1.3.6 / 2015-01-12
* fix: 修复socket.packet的aop功能BUG

1.3.5 / 2015-01-9
* improved: 增加push-server的代码，增加发送数据包前的判断以及浏览器客户端发数据给服务端的onMessage()
* add: 增加即时竞猜的服务器器业务

1.3.4 / 2015-01-7
 * improved: 提升perfmjs-node版本到1.4.1
 * improved: 提升perfmjs-redis-cluster版本到1.1.1
 * improved: 提升socket.io版本到1.2.1
 * improved: 提升request版本到2.51.0

1.3.1 / 2014-12-25
 * improved: 提升perfmjs-node版本到1.4.0
 * add: 增加代码运行时间的profiler

1.2.4 / 2014-09-25
 * add: 增加gd11x5

1.2.3 / 2014-09-20
 * remove: 移除不稳定的依赖shred
 * add: 增加http request依赖

1.2.2 / 2014-09-19
 * improved: 提升perfmjs-node版本到1.3.5
 * improved: 提升redis版本到0.12.1

1.2.1 / 2014-09-15
==================
 * add: 增加广东11x6, 快3，快乐扑克3的推送服务
 * improved: 提升perfmjs-node版本到1.3.3

1.2.0 / 2014-09-01
==================
 * improved: 增加path以允许访问带上下文的socket.io路径，如：http://push.no100.com/klpk/socket.io/?EIO=2&transport=polling&t=1409577606338-0

1.1.4 / 2014-08-31
==================
 * improved: 提升perfmjs-node版本到1.3.2
 * improved: 提升perfmjs-redis-cluster版本到1.0.6

1.1.2 / 2014-08-22
==================
 * improved: 提升perfmjs-node版本到1.2.9

1.1.1 / 2014-08-14
==================
 * improved: 提升perfmjs-node版本到1.2.8
 * add: 增加cluster功能

1.1.0 / 2014-07-31
==================
 * improved: using redis store last push data

1.0.8 / 2014-07-25
==================
 * improved: improved startup program
 * modify: changed redis-cluster version to v1.0.2

1.0.7 / 2014-07-24
==================
 * improved: improved redis cluster function

1.0.6 / 2014-07-16
==================
 * improved: improved perfmjs-node dependency to V1.2.4

1.0.5 / 2014-07-16
==================
 * modify: modify jsbf to xysc

1.0.4 / 2014-07-09
==================
 * improved: improved dependency perfmjs-node from 1.1.8 to 1.2.0

1.0.3 / 2014-07-02
==================
 * remove: change dependency perfmjs-node from 1.1.7 to 1.1.8
 * remove: removed dependency: socket.io-client
 * remove: removed start-notify-client.js

1.0.2 / 2014-06-27
==================
 * add: add Reverse Proxy Support using Nginx 1.7.2

1.0.1 / 2014-06-26
==================
 * add: add redis dependency
 * modify: change dependency version of perfmjs-node to v1.1.7
 * improved: improve cluster function using redis as pub/sub model

0.9.8 / 2014-06-25
==================
 * add:  add redis store to socket.io

0.9.2 / 2014-06-20
==================
 * improved: upgrade socket.io from v1.0.5 to v1.0.6
 * add:  add socket.io cluster
 * improved: improve push-client reconnection function

说明：修改类型为: improved(改善功能)/add(新增功能)/remove(移除功能)/modify(修复功能内容)/fix(修改BUG)