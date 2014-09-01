perfmjs-push
=======
The Realtime Framework Server Push (base on perfmjs-node, socket.io, Redis) for Node.js  V1.2.0

Features:
=======
Base on perfmjs-node, socket.io, perfmjs-redis-cluster

Support Realtime App using Server Push, WebSocket, Polling-xhr, Polling-jsonp

Support Cluster using Pub/Sub from Redis, Reverse Proxy using Nginx 1.7.2 (as you can see http://socket.io/docs/using-multiple-nodes/)

Test Result
=======
> npm install websocket-bench@0.0.6 -g
TODO, coming soon!

FAQ
======
1 issue occured: {"code":1,"message":"Session ID unknown"}: and you can see   https://github.com/Automattic/socket.io/issues/438


How to Use
-------
> npm install

> node start-server-cluster.js

also, you can find a perfmjs-push client in here: https://github.com/perfmjs/perfmjs-push-client


License
-------

Copyright 2011 Tony

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.