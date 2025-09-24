 # 🛒 云服务器购买和部署实战指南

## 🎯 **推荐配置 (性价比之王)**

### 💰 **标准配置 - 适合90%用户**
```
CPU: 2核
内存: 4GB
存储: 40GB SSD
带宽: 3-5Mbps
系统: Ubuntu 20.04 LTS
价格: ¥80-150/月
```

**为什么选择这个配置？**
- ✅ 支持20-50个并发用户
- ✅ 可存储5000+篇文章
- ✅ 响应时间1-3秒
- ✅ 成本可控，性能够用
- ✅ 可随时升级

---

## 🏪 **云服务商选择指南**

### 🥇 **阿里云** (推荐国内用户)
**优势:**
- 国内访问速度快
- 文档齐全，中文支持好
- 新用户优惠力度大
- 生态完善

**推荐配置:**
- **实例**: ecs.c5.large (2核4GB)
- **存储**: 40GB ESSD云盘
- **带宽**: 5Mbps
- **价格**: ~¥120/月

### 🥈 **腾讯云** (备选方案)
**优势:**
- 价格相对便宜
- 新用户优惠多
- 国内访问稳定

**推荐配置:**
- **实例**: S5.MEDIUM4 (2核4GB)
- **存储**: 40GB SSD云硬盘
- **带宽**: 5Mbps
- **价格**: ~¥110/月

### 🥉 **华为云** (企业用户)
**优势:**
- 企业级服务
- 安全性高
- 技术支持好

**推荐配置:**
- **实例**: s6.large.2 (2核4GB)
- **存储**: 40GB SSD
- **带宽**: 5Mbps
- **价格**: ~¥115/月

---

## 📋 **购买步骤详解**

### 🛒 **阿里云购买流程**

#### 1. 注册账号
- 访问 https://www.aliyun.com
- 注册新账号（享受新用户优惠）
- 完成实名认证

#### 2. 选择ECS实例
```
产品: 云服务器ECS
地域: 选择离用户最近的（如华东1-杭州）
实例规格: 
  - 规格族: 计算型c5
  - 实例规格: ecs.c5.large (2vCPU 4GiB)
镜像: Ubuntu 20.04 64位
存储: 
  - 系统盘: 40GB ESSD云盘
网络:
  - 专有网络VPC (默认)
  - 公网IP: 分配
  - 带宽: 按固定带宽 5Mbps
安全组: 默认安全组
```

#### 3. 配置安全组
```
入方向规则:
- HTTP: 端口80, 源地址0.0.0.0/0
- HTTPS: 端口443, 源地址0.0.0.0/0
- SSH: 端口22, 源地址0.0.0.0/0 (建议限制IP)
- 自定义: 端口3000, 源地址0.0.0.0/0 (开发测试用)
```

#### 4. 设置登录密码
- 设置root用户密码
- 密码要求: 8-30位，包含大小写字母、数字、特殊字符

#### 5. 确认订单
- 购买时长: 建议1个月先试用
- 确认配置和价格
- 完成支付

---

## 🚀 **服务器初始化**

### 1️⃣ **连接服务器**
```bash
# 使用SSH连接 (替换为您的服务器IP)
ssh root@your-server-ip

# Windows用户可使用PuTTY或Windows Terminal
```

### 2️⃣ **系统更新**
```bash
# 更新系统包
apt update && apt upgrade -y

# 安装必要工具
apt install -y curl wget git vim htop
```

### 3️⃣ **创建应用用户**
```bash
# 创建knolib用户
useradd -m -s /bin/bash knolib
usermod -aG sudo knolib

# 设置密码
passwd knolib

# 切换到knolib用户
su - knolib
```

### 4️⃣ **安装Docker**
```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 将用户添加到docker组
sudo usermod -aG docker knolib

# 重新登录使权限生效
exit
ssh knolib@your-server-ip

# 验证Docker安装
docker --version
docker-compose --version
```

---

## 📦 **部署KnoLib**

### 1️⃣ **下载项目**
```bash
# 克隆项目
git clone https://github.com/your-username/knolib.git
cd knolib

# 或者上传项目文件
# scp -r ./knolib knolib@your-server-ip:/home/knolib/
```

### 2️⃣ **配置环境变量**
```bash
# 复制环境变量模板
cp .env.production.example .env

# 编辑配置文件
vim .env
```

**重要配置项:**
```bash
# 数据库密码 (设置强密码)
POSTGRES_PASSWORD=your-strong-password-here

# JWT密钥 (生成随机字符串)
JWT_SECRET=your-jwt-secret-key-here

# NextAuth密钥
NEXTAUTH_SECRET=your-nextauth-secret-here

# 应用URL (替换为您的域名或IP)
NEXTAUTH_URL=http://your-server-ip:3000
NEXT_PUBLIC_BASE_URL=http://your-server-ip:3000
```

### 3️⃣ **运行部署脚本**
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署 (包含管理员账户创建)
./deploy.sh --setup-admin

# 等待部署完成...
```

### 4️⃣ **验证部署**
```bash
# 检查服务状态
./manage.sh status

# 查看日志
./manage.sh logs

# 健康检查
curl http://localhost:3000/api/health
```

---

## 🌐 **域名配置 (可选)**

### 1️⃣ **购买域名**
- 阿里云域名: https://wanwang.aliyun.com
- 腾讯云域名: https://dnspod.cloud.tencent.com
- Godaddy: https://godaddy.com

### 2️⃣ **DNS解析配置**
```
记录类型: A
主机记录: @ (或www)
记录值: your-server-ip
TTL: 600
```

### 3️⃣ **配置SSL证书**
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 申请SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 **监控和维护**

### 🔍 **性能监控**
```bash
# 查看系统资源使用
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看Docker容器状态
docker stats
```

### 💾 **备份策略**
```bash
# 手动备份
./manage.sh backup

# 设置自动备份 (每天凌晨2点)
crontab -e
# 添加: 0 2 * * * cd /home/knolib/knolib && ./manage.sh backup
```

### 🔄 **更新应用**
```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh

# 或者只更新服务
./manage.sh update
```

---

## 💡 **优化建议**

### ⚡ **性能优化**
1. **启用Redis缓存**
2. **配置CDN加速静态资源**
3. **优化数据库索引**
4. **启用Gzip压缩**

### 🔒 **安全加固**
1. **修改SSH默认端口**
2. **禁用root登录**
3. **配置防火墙**
4. **定期更新系统**

### 💰 **成本优化**
1. **监控资源使用率**
2. **按需调整配置**
3. **使用预留实例优惠**
4. **清理无用资源**

---

## 🆘 **常见问题**

### ❓ **部署失败怎么办？**
```bash
# 查看详细日志
./manage.sh logs

# 重新部署
./deploy.sh

# 检查端口占用
netstat -tlnp | grep :3000
```

### ❓ **访问不了怎么办？**
1. 检查安全组是否开放端口
2. 检查防火墙设置
3. 确认服务是否正常运行
4. 检查域名DNS解析

### ❓ **性能不够怎么办？**
1. 升级服务器配置
2. 优化数据库查询
3. 启用缓存
4. 使用CDN

---

## ✅ **部署成功检查清单**

- [ ] 服务器购买完成
- [ ] SSH连接正常
- [ ] Docker安装成功
- [ ] 项目部署完成
- [ ] 服务运行正常
- [ ] 健康检查通过
- [ ] 管理员账户创建
- [ ] 域名解析配置 (可选)
- [ ] SSL证书配置 (可选)
- [ ] 备份策略设置

**🎉 恭喜！您的KnoLib知识管理平台已成功部署到云服务器！**

**访问地址**: http://your-server-ip:3000 或 https://your-domain.com
