# 指定依赖的基础镜像，如果不存在就会从docker官方仓库Docker Hub寻找
From registry.cn-hangzhou.aliyuncs.com/sessionboy/node:7.5

# COPY指令用于拷贝宿主机的目录/文件到容器内的某个目录。接受两个参数，源目录路径和容器内目录路径。
# 将 “.”(当前目录) 下的文件拷贝到容器内的 “/jpysg” 目录
COPY . /jpysg

# 制定接下来的工作路径为 /jpysg
WORKDIR /jpysg

# 在 jpysg 目录下，运行 npm install 命令安装依赖，安装后所有的依赖都会打包进入镜像文件
RUN npm install --registry=https://registry.npm.taobao.org

# 将容器3000 端口暴露出来，允许外部链接这个端口
EXPOSE 3000

# 指定容器启动时执行“node bin/www”命令，启动node应用
ENTRYPOINT ["node","bin/www"]