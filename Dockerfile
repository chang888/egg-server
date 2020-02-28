# 拉取要创建的新镜像的 base image（基础镜像），类似于面向对象里边的基础类
FROM node:8.11.3-alpine

# 设置时区
ENV TIME_ZONE=Asia/Shanghai

# 在容器内运行命令
RUN \
  mkdir -p /usr/src/app \
  && apk add --no-cache tzdata \
  && echo "${TIME_ZONE}" > /etc/timezone \ 
  && ln -sf /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime 

# 创建 docker 工作目录
WORKDIR /Users/zhengjinbin/code/egg-server

# 拷贝，把本机当前目录下的 package.json 拷贝到 Image 的 /usr/src/app/ 文件夹下
COPY package.json  /Users/zhengjinbin/code/app/

# 使用 npm 安装 app 所需要的所有依赖
# RUN npm i

RUN npm i --registry=https://registry.npm.taobao.org

# 拷贝本地的所有文件到路径中去
COPY .  /Users/zhengjinbin/code/app

# 暴露端口。如果程序是一个服务器，会监听一个或多个端口，可以用 EXPOSE 来表示这个端口
EXPOSE 7001

# 给容器指定一个执行入口
CMD npm run start