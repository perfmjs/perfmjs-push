perfmjs-push
=======
The Realtime Framework Server Push (base on perfmjs-node, socket.io, Redis) for Node.js  V1.0.3

Features:
=======
Base on perfmjs-node, socket.io, stricky-session, Redis

Support Realtime App using Server Push, WebSocket, Polling-xhr, Polling-jsonp

Support Cluster using Pub/Sub from Redis, Reverse Proxy using Nginx 1.7.2 (as you can see http://socket.io/docs/using-multiple-nodes/)

Test Result
=======
TODO, coming soon!

FAQ
======
1 issue occured: {"code":1,"message":"Session ID unknown"}: and you can see   https://github.com/Automattic/socket.io/issues/438


How to Use
=======
>npm install

>node start-server-cluster.js

also, you can find a perfmjs-push cleint in here: https://github.com/perfmjs/perfmjs-push-client
