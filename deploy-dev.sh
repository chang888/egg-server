#deploy-dev.sh
echo Deploy Project

# 获取最新版代码
git pull


ls

docker build -t egg-server-cc .
docker run -d -p 7001:7001 egg-server-cc

echo Deploy Project End

# # 强制重新编译容器
# docker-compose down
# docker-compose up -d --force-recreate --build