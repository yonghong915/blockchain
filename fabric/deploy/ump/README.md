

# ump



## Usage



## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
### 

bash main.sh -p ump -m generate

1. 可以通过命令：echo stat|nc 127.0.0.1 2181 来查看哪个节点被选择作为follower或者leader
2. 使用echo ruok|nc 127.0.0.1 2181 测试是否启动了该Server，若回复imok表示已经启动。
3. echo dump| nc 127.0.0.1 2181 ,列出未经处理的会话和临时节点。
4. echo kill | nc 127.0.0.1 2181 ,关掉server
5. echo conf | nc 127.0.0.1 2181 ,输出相关服务配置的详细信息。
6. echo cons | nc 127.0.0.1 2181 ,列出所有连接到服务器的客户端的完全的连接 / 会话的详细信息。
7. echo envi |nc 127.0.0.1 2181 ,输出关于服务环境的详细信息（区别于 conf 命令）。
8. echo reqs | nc 127.0.0.1 2181 ,列出未经处理的请求。
9. echo wchs | nc 127.0.0.1 2181 ,列出服务器 watch 的详细信息。
10. echo wchc | nc 127.0.0.1 2181 ,通过 session 列出服务器 watch 的详细信息，它的输出是一个与 watch 相关的会话的列表。
11. echo wchp | nc 127.0.0.1 2181 ,通过路径列出服务器 watch 的详细信息。它输出一个与 session 相关的路径。

docker-compose -f docker-compose-kafka.yaml up -d zookeeper0
docker-compose -f docker-compose-kafka.yaml up -d zookeeper1
docker-compose -f docker-compose-kafka.yaml up -d zookeeper2
echo stat|nc 192.168.56.11 12181
echo stat|nc 192.168.56.11 22181
echo stat|nc 192.168.56.11 32181


docker-compose -f docker-compose-kafka.yaml up -d kafka0
docker-compose -f docker-compose-kafka.yaml up -d kafka1
docker-compose -f docker-compose-kafka.yaml up -d kafka2
docker-compose -f docker-compose-kafka.yaml up -d kafka3

docker-compose -f docker-compose-kafka.yaml up -d orderer0.org1.fyh.com
docker-compose -f docker-compose-kafka.yaml up -d orderer1.org1.fyh.com
docker-compose -f docker-compose-kafka.yaml up -d orderer2.org1.fyh.com


docker-compose -f docker-compose-kafka.yaml up -d peer0.org1.fyh.com
docker-compose -f docker-compose-kafka.yaml up -d peer1.org1.fyh.com

docker-compose -f docker-compose-kafka.yaml up -d ca0
