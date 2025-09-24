# KnoLib Docker Compose 完整部署指南

## 📋 **部署概览**

本指南将帮您在阿里云 Linux 3.2104 LTS 服务器上使用 Docker Compose 部署完整的 KnoLib 知识管理平台：

- **KnoLib 主应用** (Next.js + TypeScript) - Docker 容器
- **RSSHub 服务** (RSS 订阅功能) - Docker 容器  
- **PostgreSQL 数据库** - Docker 容器
- **Redis 缓存** - Docker 容器
- **Nginx 反向代理** - 系统服务
- **SSL 证书** - Let's Encrypt
- **监控和日志系统**

## 🏗️ **Docker 架构**

```
Internet
    ↓
Nginx (Host) → SSL 终止
    ↓
┌─────────────────────────────────────────┐
│              Docker Network             │
│  ┌─────────────┬─────────────────────┐  │
│  │ KnoLib App  │      RSSHub         │  │
│  │ (Port 3000) │   (Port 1200)       │  │
│  └─────────────┴─────────────────────┘  │
│  ┌─────────────┬─────────────────────┐  │
│  │ PostgreSQL  │       Redis         │  │
│  │ (Port 5432) │   (Port 6379)       │  │
│  └─────────────┴─────────────────────┘  │
└─────────────────────────────────────────┘
```

## 🚀 **第一阶段：系统基础配置**

### 1.1 更新系统和安装基础工具

```bash
# SSH 连接服务器
ssh root@your-server-ip

# 更新系统
dnf update -y

# 安装基础工具
dnf install -y wget curl git vim htop tree unzip firewalld

# 创建应用用户
useradd -m -s /bin/bash knolib
usermod -aG wheel knolib
echo "knolib ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/knolib
passwd knolib
```

### 1.2 配置防火墙

```bash
# 启动防火墙
systemctl start firewalld
systemctl enable firewalld

# 配置防火墙规则
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --reload
```

## 🐳 **第二阶段：安装 Docker 环境**

### 2.1 安装 Docker

```bash
# 添加阿里云 Docker 仓库
cat > /etc/yum.repos.d/docker-ce.repo << 'EOF'
[docker-ce-stable]
name=Docker CE Stable - $basearch
baseurl=http://mirrors.aliyun.com/docker-ce/linux/centos/8/$basearch/stable
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/docker-ce/linux/centos/gpg
EOF

# 安装 Docker
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 配置 Docker 镜像加速
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# 启动 Docker
systemctl start docker
systemctl enable docker
usermod -aG docker knolib

# 验证安装
docker --version
docker compose version
```

### 2.2 安装 Nginx

```bash
# 安装 Nginx
dnf install -y nginx

# 创建配置目录
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# 修改主配置文件
cat > /etc/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/atom+xml image/svg+xml;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # 限流配置
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=rss:10m rate=5r/s;

    include /etc/nginx/sites-enabled/*;
}
EOF

systemctl start nginx
systemctl enable nginx
```

## 📁 **第三阶段：创建项目结构**

```bash
# 切换到应用用户
su - knolib

# 创建项目目录结构
mkdir -p /home/knolib/{knolib-stack,logs,backups,ssl}
cd /home/knolib/knolib-stack

# 创建 Docker Compose 项目结构
mkdir -p {knolib-app,rsshub,postgres,redis,nginx}
mkdir -p data/{postgres,redis}
mkdir -p logs/{knolib,rsshub,postgres,redis}
```

## 🐳 **第四阶段：创建 Docker Compose 配置**

### 4.1 主 docker-compose.yml

```bash
cd /home/knolib/knolib-stack

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:14-alpine
    container_name: knolib-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: knolib
      POSTGRES_USER: knolib
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./logs/postgres:/var/log/postgresql
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - knolib-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U knolib -d knolib"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: knolib-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - ./data/redis:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "127.0.0.1:6379:6379"
    networks:
      - knolib-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # RSSHub 服务
  rsshub:
    image: diygod/rsshub:latest
    container_name: knolib-rsshub
    restart: unless-stopped
    environment:
      NODE_ENV: production
      CACHE_TYPE: redis
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/1
      CACHE_EXPIRE: 300
      CACHE_CONTENT_EXPIRE: 3600
      LISTEN_INADDR_ANY: 1
      REQUEST_RETRY: 3
      REQUEST_TIMEOUT: 30000
      UA: RSSHub/1.0 (+https://docs.rsshub.app/; like FeedFetcher-Google)
      ACCESS_KEY: ${RSSHUB_ACCESS_KEY}
      DISALLOW_ROBOT: true
      DEBUG_INFO: true
      LOGGER_LEVEL: info
    volumes:
      - ./rsshub/routes:/app/lib/routes/knolib:ro
      - ./logs/rsshub:/app/logs
    ports:
      - "127.0.0.1:1200:1200"
    networks:
      - knolib-network
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1200/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # KnoLib 主应用
  knolib:
    build:
      context: ./knolib-app
      dockerfile: Dockerfile
    container_name: knolib-app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://knolib:${POSTGRES_PASSWORD}@postgres:5432/knolib
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      JWT_SECRET: ${JWT_SECRET}
      APP_URL: https://${DOMAIN_NAME}
      RSS_URL: https://rss.${DOMAIN_NAME}
    volumes:
      - ./knolib-app/uploads:/app/uploads
      - ./logs/knolib:/app/logs
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - knolib-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  knolib-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
EOF
```

### 4.2 环境变量配置

```bash
cat > .env << 'EOF'
# 域名配置
DOMAIN_NAME=your-domain.com

# 数据库配置
POSTGRES_PASSWORD=your-strong-postgres-password

# Redis 配置
REDIS_PASSWORD=your-strong-redis-password

# JWT 配置
JWT_SECRET=your-jwt-secret-key-here

# RSSHub 配置
RSSHUB_ACCESS_KEY=your-rsshub-access-key

# 应用配置
NODE_ENV=production
EOF

chmod 600 .env
```

### 4.3 Redis 配置文件

```bash
mkdir -p redis
cat > redis/redis.conf << 'EOF'
# Redis 配置文件
bind 0.0.0.0
port 6379
timeout 300
tcp-keepalive 60

# 内存配置
maxmemory 256mb
maxmemory-policy allkeys-lru

# 持久化配置
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# 日志配置
loglevel notice

# 安全配置
protected-mode yes

# 数据库数量
databases 16
EOF
```

## 📁 **第五阶段：创建 RSSHub 自定义路由**

```bash
mkdir -p rsshub/routes

# 创建路由入口文件
cat > rsshub/routes/router.js << 'EOF'
module.exports = function (router) {
    router.get('/articles/:category?', require('./articles'));
    router.get('/tech-solutions/:category?', require('./tech-solutions'));
    router.get('/latest', require('./latest'));
};
EOF

# 创建文章路由
cat > rsshub/routes/articles.js << 'EOF'
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const { category = 'all' } = ctx.params;
    const limit = ctx.query.limit || 20;
    
    const apiUrl = `http://knolib:3000/api/articles`;
    const params = {
        published: true,
        limit: parseInt(limit),
    };
    
    if (category !== 'all') {
        params.category = category;
    }
    
    try {
        const response = await got({
            method: 'get',
            url: apiUrl,
            searchParams: params,
            timeout: 10000,
        });
        
        const articles = response.data.data || [];
        
        const items = articles.map(article => ({
            title: article.title,
            link: `https://${process.env.DOMAIN_NAME}/knowledge/${article.category?.slug || 'general'}/${article.slug}`,
            description: article.excerpt || article.content?.substring(0, 200) + '...',
            pubDate: new Date(article.publishedAt || article.createdAt),
            category: article.tags?.map(tag => tag.name) || [],
            author: article.author?.name || 'KnoLib',
            guid: article.id,
        }));

        return {
            title: category === 'all' ? 'KnoLib - All Articles' : `KnoLib - ${category}`,
            link: `https://${process.env.DOMAIN_NAME}/knowledge${category === 'all' ? '' : '/' + category}`,
            description: 'Personal Knowledge Sharing Platform - Latest Articles',
            language: 'en',
            item: items,
        };
    } catch (error) {
        throw new Error(`Failed to fetch articles: ${error.message}`);
    }
};
EOF

# 创建技术方案路由
cat > rsshub/routes/tech-solutions.js << 'EOF'
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const { category = 'all' } = ctx.params;
    const limit = ctx.query.limit || 20;
    
    const apiUrl = `http://knolib:3000/api/tech-solutions`;
    const params = {
        published: true,
        limit: parseInt(limit),
    };
    
    if (category !== 'all') {
        params.category = category;
    }
    
    try {
        const response = await got({
            method: 'get',
            url: apiUrl,
            searchParams: params,
            timeout: 10000,
        });
        
        const solutions = response.data.data || [];
        
        const items = solutions.map(solution => ({
            title: solution.title,
            link: `https://${process.env.DOMAIN_NAME}/tech-solutions/${solution.slug}`,
            description: solution.summary || solution.content?.substring(0, 200) + '...',
            pubDate: new Date(solution.publishedAt || solution.createdAt),
            category: solution.techStack || [],
            guid: solution.id,
        }));

        return {
            title: category === 'all' ? 'KnoLib - Tech Solutions' : `KnoLib - ${category} Solutions`,
            link: `https://${process.env.DOMAIN_NAME}/tech-solutions${category === 'all' ? '' : '/' + category}`,
            description: 'KnoLib Technology Solutions and Implementations',
            language: 'en',
            item: items,
        };
    } catch (error) {
        throw new Error(`Failed to fetch tech solutions: ${error.message}`);
    }
};
EOF

# 创建最新内容路由
cat > rsshub/routes/latest.js << 'EOF'
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const limit = ctx.query.limit || 10;
    
    try {
        const [articlesResponse, solutionsResponse] = await Promise.all([
            got({
                method: 'get',
                url: 'http://knolib:3000/api/articles',
                searchParams: { published: true, limit: Math.ceil(limit / 2) },
                timeout: 10000,
            }),
            got({
                method: 'get',
                url: 'http://knolib:3000/api/tech-solutions',
                searchParams: { published: true, limit: Math.ceil(limit / 2) },
                timeout: 10000,
            }),
        ]);
        
        const articles = articlesResponse.data.data || [];
        const solutions = solutionsResponse.data.data || [];
        
        const allItems = [
            ...articles.map(article => ({
                title: `[Article] ${article.title}`,
                link: `https://${process.env.DOMAIN_NAME}/knowledge/${article.category?.slug || 'general'}/${article.slug}`,
                description: article.excerpt || '',
                pubDate: new Date(article.publishedAt || article.createdAt),
                category: ['Article', ...(article.tags?.map(tag => tag.name) || [])],
                author: article.author?.name || 'KnoLib',
                guid: `article-${article.id}`,
            })),
            ...solutions.map(solution => ({
                title: `[Tech Solution] ${solution.title}`,
                link: `https://${process.env.DOMAIN_NAME}/tech-solutions/${solution.slug}`,
                description: solution.summary || '',
                pubDate: new Date(solution.publishedAt || solution.createdAt),
                category: ['Tech Solution', ...(solution.techStack || [])],
                guid: `solution-${solution.id}`,
            })),
        ].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, limit);

        return {
            title: 'KnoLib - Latest Updates',
            link: `https://${process.env.DOMAIN_NAME}`,
            description: 'Latest articles and tech solutions from KnoLib',
            language: 'en',
            item: allItems,
        };
    } catch (error) {
        throw new Error(`Failed to fetch latest content: ${error.message}`);
    }
};
EOF
```

## 🐳 **第六阶段：创建 KnoLib Dockerfile**

```bash
# 创建 KnoLib 应用的 Dockerfile
cat > knolib-app/Dockerfile << 'EOF'
FROM node:18-alpine AS base

# 安装依赖
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
EOF

# 创建 .dockerignore
cat > knolib-app/.dockerignore << 'EOF'
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*.local
EOF
```

## 🌐 **第七阶段：配置 Nginx 反向代理**

```bash
# 切换回 root 用户
exit

# 创建 KnoLib 主站点配置
cat > /etc/nginx/sites-available/knolib << 'EOF'
# KnoLib 主站点
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 配置
    ssl_certificate /home/knolib/ssl/fullchain.pem;
    ssl_certificate_key /home/knolib/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # 日志
    access_log /home/knolib/logs/nginx-access.log;
    error_log /home/knolib/logs/nginx-error.log;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API 限流
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 主应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 健康检查
    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:3000/health;
        proxy_set_header Host $host;
    }
}
EOF

# 创建 RSSHub 站点配置
cat > /etc/nginx/sites-available/rsshub << 'EOF'
# RSSHub 服务
server {
    listen 80;
    server_name rss.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rss.your-domain.com;

    # SSL 配置
    ssl_certificate /home/knolib/ssl/fullchain.pem;
    ssl_certificate_key /home/knolib/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 日志
    access_log /home/knolib/logs/rsshub-access.log;
    error_log /home/knolib/logs/rsshub-error.log;

    # RSS 限流
    location / {
        limit_req zone=rss burst=10 nodelay;

        proxy_pass http://127.0.0.1:1200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # RSS 缓存
        proxy_cache_valid 200 1h;
        proxy_cache_key $scheme$proxy_host$request_uri;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/knolib /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/rsshub /etc/nginx/sites-enabled/

# 测试配置
nginx -t
```

## 🔐 **第八阶段：配置 SSL 证书**

```bash
# 安装 Certbot
dnf install -y certbot python3-certbot-nginx

# 获取 SSL 证书（替换为您的域名）
certbot certonly --webroot -w /var/www/html \
  -d your-domain.com \
  -d www.your-domain.com \
  -d rss.your-domain.com

# 复制证书到应用目录
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/knolib/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/knolib/ssl/
chown knolib:knolib /home/knolib/ssl/*

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx" | crontab -

# 重启 Nginx
systemctl restart nginx
```

## 🚀 **第九阶段：部署和管理脚本**

```bash
# 切换到 knolib 用户
su - knolib
cd /home/knolib/knolib-stack

# 创建部署脚本
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting KnoLib Docker deployment..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查 Docker 服务
check_docker() {
    if ! systemctl is-active --quiet docker; then
        log_error "Docker is not running"
        exit 1
    fi
    log_info "Docker is running"
}

# 备份数据库
backup_database() {
    if docker compose ps postgres | grep -q "Up"; then
        log_info "Creating database backup..."
        BACKUP_FILE="/home/knolib/backups/knolib_$(date +%Y%m%d_%H%M%S).sql"
        docker compose exec -T postgres pg_dump -U knolib knolib > $BACKUP_FILE
        log_info "Database backup created: $BACKUP_FILE"
    fi
}

# 部署应用
deploy_stack() {
    log_info "Pulling latest images..."
    docker compose pull

    log_info "Building KnoLib application..."
    docker compose build knolib

    log_info "Starting services..."
    docker compose up -d

    log_info "Waiting for services to be healthy..."
    sleep 30

    # 运行数据库迁移
    log_info "Running database migrations..."
    docker compose exec knolib npx prisma migrate deploy

    log_info "Deployment completed!"
}

# 检查服务健康状态
check_health() {
    log_info "Checking service health..."

    services=("postgres" "redis" "rsshub" "knolib")
    for service in "${services[@]}"; do
        if docker compose ps $service | grep -q "Up (healthy)"; then
            log_info "$service is healthy"
        else
            log_warn "$service is not healthy"
        fi
    done
}

# 主函数
main() {
    check_docker
    backup_database
    deploy_stack
    check_health

    log_info "🎉 Deployment completed successfully!"
    log_info "KnoLib: https://your-domain.com"
    log_info "RSSHub: https://rss.your-domain.com"
}

main "$@"
EOF

chmod +x deploy.sh

# 创建管理脚本
cat > manage.sh << 'EOF'
#!/bin/bash

case "$1" in
    start)
        echo "🚀 Starting KnoLib stack..."
        docker compose up -d
        ;;
    stop)
        echo "🛑 Stopping KnoLib stack..."
        docker compose down
        ;;
    restart)
        echo "🔄 Restarting KnoLib stack..."
        docker compose restart
        ;;
    logs)
        service=${2:-}
        if [ -n "$service" ]; then
            docker compose logs -f $service
        else
            docker compose logs -f
        fi
        ;;
    status)
        echo "📊 KnoLib stack status:"
        docker compose ps
        ;;
    backup)
        echo "💾 Creating backup..."
        BACKUP_FILE="/home/knolib/backups/knolib_$(date +%Y%m%d_%H%M%S).sql"
        docker compose exec -T postgres pg_dump -U knolib knolib > $BACKUP_FILE
        echo "Backup created: $BACKUP_FILE"
        ;;
    update)
        echo "🔄 Updating KnoLib stack..."
        docker compose pull
        docker compose up -d
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs [service]|status|backup|update}"
        echo ""
        echo "Examples:"
        echo "  $0 start          # Start all services"
        echo "  $0 logs knolib    # View KnoLib logs"
        echo "  $0 status         # Show service status"
        echo "  $0 backup         # Create database backup"
        exit 1
        ;;
esac
EOF

chmod +x manage.sh
```

## 📊 **第十阶段：监控和日志**

```bash
# 创建监控脚本
cat > monitor.sh << 'EOF'
#!/bin/bash

LOG_FILE="/home/knolib/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

log() { echo "[$DATE] $1" >> $LOG_FILE; }

# 检查 Docker 服务
check_docker_services() {
    services=("knolib-postgres" "knolib-redis" "knolib-rsshub" "knolib-app")

    for service in "${services[@]}"; do
        if ! docker ps --filter "name=$service" --filter "status=running" | grep -q $service; then
            log "ERROR: $service container is not running"
            # 尝试重启
            cd /home/knolib/knolib-stack
            docker compose restart ${service#knolib-}
            log "INFO: Attempted to restart $service"
        fi
    done
}

# 检查应用健康状态
check_app_health() {
    # 检查 KnoLib 应用
    if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log "ERROR: KnoLib application health check failed"
        cd /home/knolib/knolib-stack
        docker compose restart knolib
    fi

    # 检查 RSSHub
    if ! curl -f http://localhost:1200/ > /dev/null 2>&1; then
        log "ERROR: RSSHub health check failed"
        cd /home/knolib/knolib-stack
        docker compose restart rsshub
    fi
}

# 检查磁盘空间
check_disk_space() {
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        log "WARNING: Disk usage is ${DISK_USAGE}%"
        # 清理 Docker 镜像和容器
        docker system prune -f
        # 清理旧日志
        find /home/knolib/logs -name "*.log" -mtime +7 -delete
        find /home/knolib/backups -name "*.sql" -mtime +30 -delete
    fi
}

# 检查 Docker 资源使用
check_docker_resources() {
    # 检查容器内存使用
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | while read line; do
        if echo "$line" | grep -q "knolib"; then
            log "INFO: $line"
        fi
    done
}

# 主监控函数
main() {
    log "INFO: Starting Docker health check..."
    check_docker_services
    check_app_health
    check_disk_space
    check_docker_resources
    log "INFO: Docker health check completed"
}

main
EOF

chmod +x monitor.sh

# 添加到 crontab（每5分钟检查一次）
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/knolib/knolib-stack/monitor.sh") | crontab -

# 创建日志轮转配置
exit  # 切换回 root 用户

cat > /etc/logrotate.d/knolib-docker << 'EOF'
/home/knolib/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 knolib knolib
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
        docker compose -f /home/knolib/knolib-stack/docker-compose.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF
```

## ✅ **第十一阶段：验证和测试**

```bash
# 切换到 knolib 用户
su - knolib
cd /home/knolib/knolib-stack

# 验证配置文件
docker compose config

# 启动所有服务
./deploy.sh

# 检查服务状态
./manage.sh status

# 查看日志
./manage.sh logs

# 测试应用
curl http://localhost:3000/health
curl http://localhost:1200/

# 测试 Nginx 代理
curl -I https://your-domain.com
curl -I https://rss.your-domain.com
```

## 🔧 **常用管理命令**

### 日常管理
```bash
# 启动所有服务
./manage.sh start

# 停止所有服务
./manage.sh stop

# 重启服务
./manage.sh restart

# 查看状态
./manage.sh status

# 查看日志
./manage.sh logs knolib    # 查看 KnoLib 日志
./manage.sh logs rsshub    # 查看 RSSHub 日志
./manage.sh logs           # 查看所有日志

# 备份数据库
./manage.sh backup

# 更新服务
./manage.sh update
```

### Docker 命令
```bash
# 查看容器状态
docker compose ps

# 进入容器
docker compose exec knolib bash
docker compose exec postgres psql -U knolib -d knolib

# 查看容器日志
docker compose logs -f knolib
docker compose logs -f rsshub

# 重建容器
docker compose build --no-cache knolib
docker compose up -d --force-recreate knolib
```

### 故障排除
```bash
# 检查 Docker 网络
docker network ls
docker network inspect knolib-stack_knolib-network

# 检查容器健康状态
docker compose ps
docker inspect knolib-app --format='{{.State.Health.Status}}'

# 清理 Docker 资源
docker system prune -f
docker volume prune -f

# 重新部署
docker compose down
docker compose up -d
```

## 📋 **部署清单**

### 已配置的服务：
- ✅ Docker & Docker Compose
- ✅ PostgreSQL (Docker 容器)
- ✅ Redis (Docker 容器)
- ✅ RSSHub (Docker 容器)
- ✅ KnoLib App (Docker 容器)
- ✅ Nginx (系统服务，反向代理)
- ✅ SSL 证书 (Let's Encrypt)
- ✅ 防火墙配置
- ✅ 监控脚本
- ✅ 日志管理
- ✅ 自动化部署脚本

### 需要您配置的：
1. **替换域名**：将所有 `your-domain.com` 替换为实际域名
2. **修改密码**：更改 `.env` 文件中的所有密码
3. **DNS 解析**：配置域名指向服务器 IP
4. **项目代码**：将 KnoLib 代码放入 `knolib-app` 目录

### 部署步骤：
```bash
# 1. 上传 KnoLib 项目代码到 knolib-app 目录
scp -r ./knolib-project/* knolib@your-server:/home/knolib/knolib-stack/knolib-app/

# 2. 修改环境变量
vim /home/knolib/knolib-stack/.env

# 3. 运行部署脚本
ssh knolib@your-server
cd /home/knolib/knolib-stack
./deploy.sh
```

## 🎯 **优势特点**

- **容器化部署**：所有服务都运行在 Docker 容器中，易于管理和扩展
- **服务隔离**：每个服务独立运行，互不影响
- **健康检查**：内置健康检查机制，自动重启故障服务
- **数据持久化**：数据库和文件存储持久化到宿主机
- **负载均衡**：支持多实例部署和负载均衡
- **监控告警**：完整的监控和日志系统
- **一键部署**：自动化部署和管理脚本

---

**注意**：请确保将文档中的所有占位符替换为实际值，并在生产环境部署前进行充分测试。
