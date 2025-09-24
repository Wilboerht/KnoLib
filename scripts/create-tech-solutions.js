/**
 * 创建技术方案数据的脚本
 */

const API_BASE = 'http://localhost:3001/api';

// 创建技术分类
async function createTechCategories() {
  const categories = [
    {
      name: 'Backend Solutions',
      slug: 'backend-solutions',
      description: 'Backend development solutions and architectures',
      icon: 'Server',
      color: '#10B981',
      order: 1
    },
    {
      name: 'DevOps & Infrastructure',
      slug: 'devops-infrastructure',
      description: 'DevOps practices and infrastructure solutions',
      icon: 'Cloud',
      color: '#F59E0B',
      order: 2
    },
    {
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Mobile app development solutions',
      icon: 'Smartphone',
      color: '#8B5CF6',
      order: 3
    },
    {
      name: 'Data & Analytics',
      slug: 'data-analytics',
      description: 'Data processing and analytics solutions',
      icon: 'BarChart3',
      color: '#EF4444',
      order: 4
    }
  ];

  for (const category of categories) {
    try {
      const response = await fetch(`${API_BASE}/tech-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`❌ Failed to create category ${category.name}:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Error creating category ${category.name}:`, error.message);
    }
  }
}

// 创建技术方案
async function createTechSolutions() {
  // 首先获取所有分类
  const categoriesResponse = await fetch(`${API_BASE}/tech-categories`);
  const categoriesResult = await categoriesResponse.json();
  const categories = categoriesResult.data;

  const solutions = [
    // Frontend Solutions
    {
      title: 'Vue.js Enterprise Dashboard',
      slug: 'vue-enterprise-dashboard',
      content: `# Vue.js Enterprise Dashboard

## 项目概述

这是一个基于 Vue.js 3 和 TypeScript 构建的企业级仪表板解决方案，采用现代化的开发工具链和最佳实践。

## 核心特性

### 🎯 技术栈
- **Vue 3** - 使用 Composition API
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Element Plus** - UI 组件库

### 📊 功能模块

#### 1. 用户认证系统
\`\`\`typescript
// auth.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  return { user, token, isAuthenticated, login }
})
\`\`\`

这个解决方案为企业级应用提供了完整的前端架构基础。`,
      summary: '基于 Vue.js 3 和 TypeScript 的企业级仪表板解决方案，包含完整的认证系统、数据可视化和状态管理。',
      categorySlug: 'frontend-solutions',
      techStack: ['Vue.js', 'TypeScript', 'Vite', 'Pinia', 'Element Plus', 'ECharts'],
      projectType: 'Dashboard',
      difficulty: 'INTERMEDIATE',
      featured: true,
      published: true
    },
    {
      title: 'Next.js Full-Stack E-commerce',
      slug: 'nextjs-ecommerce-platform',
      content: `# Next.js Full-Stack E-commerce Platform

## 项目概述

基于 Next.js 14 构建的全栈电商平台，集成了现代化的支付系统、库存管理和用户体验优化。

## 技术架构

### 前端技术栈
- **Next.js 14** - App Router + Server Components
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **React Hook Form** - 表单管理

### 后端技术栈
- **Next.js API Routes** - 服务端 API
- **Prisma** - ORM 数据库管理
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话管理
- **Stripe** - 支付处理

## 核心功能

### 1. 产品管理系统
\`\`\`typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const products = await prisma.product.findMany({
    where: category ? { categoryId: category } : {},
    include: {
      category: true,
      images: true,
      reviews: {
        select: { rating: true }
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ products })
}
\`\`\`

### 2. 购物车管理
\`\`\`typescript
// hooks/useCart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }),
    { name: 'cart-storage' }
  )
)
\`\`\`

### 3. 支付集成
\`\`\`typescript
// app/api/checkout/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image]
          },
          unit_amount: item.price * 100
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: \`\${process.env.NEXT_PUBLIC_URL}/success\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/cart\`
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}
\`\`\`

## 性能优化

### 1. 图片优化
\`\`\`typescript
import Image from 'next/image'

const ProductImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
    priority={props.priority}
    {...props}
  />
)
\`\`\`

### 2. 数据缓存
\`\`\`typescript
import { unstable_cache } from 'next/cache'

export const getProducts = unstable_cache(
  async (category?: string) => {
    return await prisma.product.findMany({
      where: category ? { categoryId: category } : {},
      include: { category: true, images: true }
    })
  },
  ['products'],
  { revalidate: 3600 }
)
\`\`\`

这个解决方案提供了完整的电商平台开发框架。`,
      summary: '基于 Next.js 14 的全栈电商平台，集成支付系统、库存管理和现代化用户体验。',
      categorySlug: 'frontend-solutions',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      projectType: 'E-commerce',
      difficulty: 'ADVANCED',
      featured: true,
      published: true
    },
    {
      title: 'Angular Progressive Web App',
      slug: 'angular-pwa-solution',
      content: `# Angular Progressive Web App

## 项目概述

使用 Angular 17 构建的渐进式 Web 应用（PWA），具备离线功能、推送通知和原生应用体验。

## 技术特性

### 核心技术
- **Angular 17** - 最新版本框架
- **Angular Material** - UI 组件库
- **Service Worker** - 离线支持
- **RxJS** - 响应式编程
- **NgRx** - 状态管理

### PWA 功能
- 离线访问
- 推送通知
- 应用安装
- 后台同步

## 核心实现

### 1. Service Worker 配置
\`\`\`typescript
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h"
      }
    }
  ]
}
\`\`\`

### 2. 推送通知服务
\`\`\`typescript
// services/notification.service.ts
import { Injectable } from '@angular/core'
import { SwPush } from '@angular/service-worker'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private swPush: SwPush) {}

  async subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      console.log('Service Worker not enabled')
      return
    }

    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      })

      // 发送订阅信息到服务器
      await this.sendSubscriptionToServer(subscription)
    } catch (error) {
      console.error('Failed to subscribe to notifications', error)
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    return fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })
  }
}
\`\`\`

### 3. 离线数据同步
\`\`\`typescript
// services/sync.service.ts
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private isOnline = new BehaviorSubject(navigator.onLine)
  private pendingRequests: any[] = []

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline.next(true)
      this.syncPendingRequests()
    })

    window.addEventListener('offline', () => {
      this.isOnline.next(false)
    })
  }

  addPendingRequest(request: any) {
    this.pendingRequests.push(request)
    localStorage.setItem('pendingRequests', JSON.stringify(this.pendingRequests))
  }

  private async syncPendingRequests() {
    const requests = JSON.parse(localStorage.getItem('pendingRequests') || '[]')

    for (const request of requests) {
      try {
        await fetch(request.url, request.options)
      } catch (error) {
        console.error('Failed to sync request', error)
      }
    }

    localStorage.removeItem('pendingRequests')
    this.pendingRequests = []
  }
}
\`\`\`

这个解决方案提供了完整的 PWA 开发框架。`,
      summary: '使用 Angular 17 构建的渐进式 Web 应用，具备离线功能、推送通知和原生应用体验。',
      categorySlug: 'frontend-solutions',
      techStack: ['Angular', 'TypeScript', 'Angular Material', 'Service Worker', 'NgRx'],
      projectType: 'PWA',
      difficulty: 'INTERMEDIATE',
      featured: false,
      published: true
    },

    // Backend Solutions
    {
      title: 'Node.js Microservices Architecture',
      slug: 'nodejs-microservices-architecture',
      content: `# Node.js Microservices Architecture

## 项目概述

基于 Node.js 和 Express.js 构建的微服务架构解决方案，采用容器化部署和服务网格管理。

## 技术架构

### 核心技术栈
- **Node.js** - 运行时环境
- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **MongoDB** - 文档数据库
- **Redis** - 缓存和消息队列
- **Docker** - 容器化
- **Kubernetes** - 容器编排

### 服务架构
\`\`\`
API Gateway
    ├── User Service
    ├── Product Service
    ├── Order Service
    ├── Payment Service
    └── Notification Service
\`\`\`

## 核心实现

### 1. API Gateway
\`\`\`typescript
// gateway/src/app.ts
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()

// 安全中间件
app.use(helmet())

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// 服务代理配置
const services = {
  '/api/users': 'http://user-service:3001',
  '/api/products': 'http://product-service:3002',
  '/api/orders': 'http://order-service:3003',
  '/api/payments': 'http://payment-service:3004'
}

// 创建代理中间件
Object.entries(services).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [\`^\${path}\`]: ''
    }
  }))
})

export default app
\`\`\`

### 2. 用户服务
\`\`\`typescript
// user-service/src/controllers/userController.ts
import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { validateUser } from '../validators/userValidator'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async createUser(req: Request, res: Response) {
    try {
      const { error, value } = validateUser(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message })
      }

      const user = await this.userService.createUser(value)
      res.status(201).json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await this.userService.getUserById(id)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
\`\`\`

### 3. 服务间通信
\`\`\`typescript
// shared/src/messageQueue.ts
import amqp from 'amqplib'

export class MessageQueue {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL!)
      this.channel = await this.connection.createChannel()
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error)
    }
  }

  async publishEvent(exchange: string, routingKey: string, data: any) {
    if (!this.channel) {
      throw new Error('Channel not initialized')
    }

    await this.channel.assertExchange(exchange, 'topic', { durable: true })

    const message = Buffer.from(JSON.stringify(data))
    this.channel.publish(exchange, routingKey, message, { persistent: true })
  }

  async subscribeToEvent(exchange: string, routingKey: string, callback: (data: any) => void) {
    if (!this.channel) {
      throw new Error('Channel not initialized')
    }

    await this.channel.assertExchange(exchange, 'topic', { durable: true })
    const queue = await this.channel.assertQueue('', { exclusive: true })

    await this.channel.bindQueue(queue.queue, exchange, routingKey)

    this.channel.consume(queue.queue, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString())
        callback(data)
        this.channel!.ack(msg)
      }
    })
  }
}
\`\`\`

## Docker 配置

### Dockerfile
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  api-gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - product-service

  user-service:
    build: ./user-service
    environment:
      - MONGODB_URL=mongodb://mongo:27017/users
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
\`\`\`

这个解决方案提供了完整的微服务架构框架。`,
      summary: '基于 Node.js 的微服务架构解决方案，包含 API 网关、服务间通信和容器化部署。',
      categorySlug: 'backend-solutions',
      techStack: ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Redis', 'Docker', 'RabbitMQ'],
      projectType: 'Microservices',
      difficulty: 'ADVANCED',
      featured: true,
      published: true
    },
    {
      title: 'Python FastAPI REST API',
      slug: 'python-fastapi-rest-api',
      content: `# Python FastAPI REST API

## 项目概述

使用 FastAPI 构建的高性能 REST API，集成了自动文档生成、数据验证和异步处理。

## 技术特性

### 核心技术栈
- **FastAPI** - 现代 Python Web 框架
- **SQLAlchemy** - ORM 数据库管理
- **Pydantic** - 数据验证
- **PostgreSQL** - 关系型数据库
- **Redis** - 缓存系统
- **Celery** - 异步任务队列

## 核心实现

### 1. 应用结构
\`\`\`python
# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import get_db
from .routers import users, products, orders
from .auth import get_current_user

app = FastAPI(
    title="E-commerce API",
    description="A modern e-commerce REST API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to E-commerce API"}
\`\`\`

### 2. 数据模型
\`\`\`python
# models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
\`\`\`

### 3. API 路由
\`\`\`python
# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import UserCreate, UserResponse
from ..services import UserService
from ..auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    user_service = UserService(db)

    if user_service.get_user_by_email(user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return user_service.create_user(user)

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_service = UserService(db)
    user = user_service.get_user(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
\`\`\`

### 4. 数据验证
\`\`\`python
# schemas/user.py
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True
\`\`\`

### 5. 异步任务
\`\`\`python
# tasks/email.py
from celery import Celery
import smtplib
from email.mime.text import MIMEText

celery_app = Celery('tasks', broker='redis://localhost:6379')

@celery_app.task
def send_welcome_email(email: str, username: str):
    msg = MIMEText(f"Welcome {username}! Thanks for joining our platform.")
    msg['Subject'] = 'Welcome to our platform'
    msg['From'] = 'noreply@example.com'
    msg['To'] = email

    with smtplib.SMTP('localhost', 587) as server:
        server.send_message(msg)

    return f"Email sent to {email}"
\`\`\`

这个解决方案提供了完整的 FastAPI 开发框架。`,
      summary: '使用 FastAPI 构建的高性能 REST API，集成自动文档生成、数据验证和异步处理。',
      categorySlug: 'backend-solutions',
      techStack: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Redis', 'Celery'],
      projectType: 'REST API',
      difficulty: 'INTERMEDIATE',
      featured: false,
      published: true
    },

    // DevOps & Infrastructure
    {
      title: 'Kubernetes CI/CD Pipeline',
      slug: 'kubernetes-cicd-pipeline',
      content: `# Kubernetes CI/CD Pipeline

## 项目概述

基于 Kubernetes 的完整 CI/CD 流水线解决方案，集成了 GitOps、自动化测试和监控告警。

## 技术架构

### 核心组件
- **Kubernetes** - 容器编排平台
- **GitLab CI/CD** - 持续集成/部署
- **ArgoCD** - GitOps 部署工具
- **Helm** - Kubernetes 包管理
- **Prometheus** - 监控系统
- **Grafana** - 可视化面板

## 流水线配置

### 1. GitLab CI/CD 配置
\`\`\`yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy-staging
  - deploy-production

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  DOCKER_IMAGE: \$DOCKER_REGISTRY/\$CI_PROJECT_PATH
  KUBECONFIG: /tmp/kubeconfig

test:
  stage: test
  image: node:18
  script:
    - npm install
    - npm run test
    - npm run lint
  coverage: '/Coverage: \\d+\\.\\d+%/'

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build -t \$DOCKER_IMAGE:\$CI_COMMIT_SHA .
    - docker push \$DOCKER_IMAGE:\$CI_COMMIT_SHA
  only:
    - main
    - develop

deploy-staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - helm upgrade --install myapp ./helm-chart
        --set image.tag=\$CI_COMMIT_SHA
        --set environment=staging
        --namespace staging
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - develop

deploy-production:
  stage: deploy-production
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - helm upgrade --install myapp ./helm-chart
        --set image.tag=\$CI_COMMIT_SHA
        --set environment=production
        --namespace production
  environment:
    name: production
    url: https://myapp.com
  when: manual
  only:
    - main
\`\`\`

### 2. Helm Chart 配置
\`\`\`yaml
# helm-chart/values.yaml
replicaCount: 3

image:
  repository: registry.gitlab.com/myproject/myapp
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: myapp.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - myapp.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
\`\`\`

### 3. ArgoCD 应用配置
\`\`\`yaml
# argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://gitlab.com/myproject/myapp-config
    targetRevision: HEAD
    path: helm-chart
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

### 4. 监控配置
\`\`\`yaml
# monitoring/prometheus-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: myapp-alerts
spec:
  groups:
    - name: myapp
      rules:
        - alert: HighErrorRate
          expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "High error rate detected"
            description: "Error rate is above 10% for 5 minutes"

        - alert: HighMemoryUsage
          expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High memory usage"
            description: "Memory usage is above 90%"
\`\`\`

### 5. 安全扫描
\`\`\`yaml
# security/trivy-scan.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: trivy-scan
spec:
  template:
    spec:
      containers:
        - name: trivy
          image: aquasec/trivy:latest
          command:
            - trivy
            - image
            - --exit-code
            - "1"
            - --severity
            - HIGH,CRITICAL
            - \$DOCKER_IMAGE:\$CI_COMMIT_SHA
      restartPolicy: Never
\`\`\`

## 最佳实践

1. **GitOps 工作流**: 所有部署通过 Git 仓库管理
2. **多环境管理**: 开发、测试、生产环境隔离
3. **自动化测试**: 单元测试、集成测试、安全扫描
4. **监控告警**: 全面的应用和基础设施监控
5. **回滚策略**: 快速回滚机制

这个解决方案提供了企业级的 DevOps 实践框架。`,
      summary: '基于 Kubernetes 的完整 CI/CD 流水线解决方案，集成 GitOps、自动化测试和监控告警。',
      categorySlug: 'devops-infrastructure',
      techStack: ['Kubernetes', 'GitLab CI/CD', 'ArgoCD', 'Helm', 'Prometheus', 'Grafana'],
      projectType: 'CI/CD Pipeline',
      difficulty: 'ADVANCED',
      featured: true,
      published: true
    },
    {
      title: 'Terraform Infrastructure as Code',
      slug: 'terraform-infrastructure-code',
      content: `# Terraform Infrastructure as Code

## 项目概述

使用 Terraform 管理云基础设施的完整解决方案，支持多云部署和环境管理。

## 技术特性

### 核心工具
- **Terraform** - 基础设施即代码
- **AWS/Azure/GCP** - 云服务提供商
- **Terragrunt** - Terraform 包装器
- **Vault** - 密钥管理
- **Ansible** - 配置管理

## 项目结构

\`\`\`
terraform/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── s3/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── shared/
    ├── variables.tf
    └── outputs.tf
\`\`\`

### 1. VPC 模块
\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "\${var.environment}-public-\${count.index + 1}"
    Type = "public"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "\${var.environment}-private-\${count.index + 1}"
    Type = "private"
  }
}
\`\`\`

### 2. EKS 集群模块
\`\`\`hcl
# modules/eks/main.tf
resource "aws_eks_cluster" "main" {
  name     = "\${var.environment}-eks-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = var.public_access_cidrs
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]

  tags = {
    Environment = var.environment
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "\${var.environment}-node-group"
  node_role_arn   = aws_iam_role.node_group.arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }

  instance_types = var.instance_types
  capacity_type  = "ON_DEMAND"

  depends_on = [
    aws_iam_role_policy_attachment.node_group_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_group_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_group_AmazonEC2ContainerRegistryReadOnly,
  ]
}
\`\`\`

### 3. 环境配置
\`\`\`hcl
# environments/prod/main.tf
terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket = "mycompany-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-west-2"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "../../modules/vpc"

  environment      = "prod"
  vpc_cidr        = "10.0.0.0/16"
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.20.0/24"]
}

module "eks" {
  source = "../../modules/eks"

  environment         = "prod"
  subnet_ids         = module.vpc.all_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  kubernetes_version = "1.28"

  desired_capacity = 3
  min_capacity     = 2
  max_capacity     = 10
  instance_types   = ["t3.medium"]
}
\`\`\`

### 4. Terragrunt 配置
\`\`\`hcl
# terragrunt.hcl
remote_state {
  backend = "s3"
  config = {
    bucket = "mycompany-terraform-state"
    key    = "\${path_relative_to_include()}/terraform.tfstate"
    region = "us-west-2"

    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
EOF
}
\`\`\`

这个解决方案提供了完整的基础设施即代码框架。`,
      summary: '使用 Terraform 管理云基础设施的完整解决方案，支持多云部署和环境管理。',
      categorySlug: 'devops-infrastructure',
      techStack: ['Terraform', 'AWS', 'Kubernetes', 'Terragrunt', 'Vault'],
      projectType: 'Infrastructure',
      difficulty: 'ADVANCED',
      featured: false,
      published: true
    },

    // Data & Analytics
    {
      title: 'Real-time Data Pipeline with Apache Kafka',
      slug: 'realtime-data-pipeline-kafka',
      content: `# Real-time Data Pipeline with Apache Kafka

## 项目概述

基于 Apache Kafka 构建的实时数据处理管道，支持大规模数据流处理和实时分析。

## 技术架构

### 核心组件
- **Apache Kafka** - 分布式流处理平台
- **Apache Spark** - 大数据处理引擎
- **Apache Flink** - 流处理框架
- **ClickHouse** - 列式数据库
- **Elasticsearch** - 搜索引擎
- **Grafana** - 数据可视化

## 系统架构

\`\`\`
Data Sources → Kafka → Stream Processing → Storage → Visualization
     ↓              ↓           ↓              ↓           ↓
  Web Apps      Producers   Spark/Flink   ClickHouse   Grafana
  Mobile Apps   Consumers      Jobs        Elasticsearch Kibana
  IoT Devices   Topics      Real-time      Data Lake    Dashboards
\`\`\`

### 1. Kafka 配置
\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: true

  schema-registry:
    image: confluentinc/cp-schema-registry:latest
    depends_on:
      - kafka
    ports:
      - "8081:8081"
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka:29092
\`\`\`

### 2. 数据生产者
\`\`\`python
# producers/event_producer.py
from kafka import KafkaProducer
import json
import time
import random
from datetime import datetime

class EventProducer:
    def __init__(self, bootstrap_servers=['localhost:9092']):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None
        )

    def send_user_event(self, user_id, event_type, properties=None):
        event = {
            'user_id': user_id,
            'event_type': event_type,
            'timestamp': datetime.utcnow().isoformat(),
            'properties': properties or {}
        }

        self.producer.send(
            topic='user-events',
            key=str(user_id),
            value=event
        )

    def send_system_metrics(self):
        metrics = {
            'timestamp': datetime.utcnow().isoformat(),
            'cpu_usage': random.uniform(0, 100),
            'memory_usage': random.uniform(0, 100),
            'disk_usage': random.uniform(0, 100),
            'network_io': random.randint(1000, 10000)
        }

        self.producer.send('system-metrics', value=metrics)

    def close(self):
        self.producer.close()

# 使用示例
if __name__ == "__main__":
    producer = EventProducer()

    # 模拟用户事件
    for i in range(1000):
        producer.send_user_event(
            user_id=random.randint(1, 100),
            event_type=random.choice(['page_view', 'click', 'purchase']),
            properties={'page': f'/page-{random.randint(1, 10)}'}
        )
        time.sleep(0.1)

    producer.close()
\`\`\`

### 3. Spark 流处理
\`\`\`python
# processors/spark_streaming.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

# 创建 Spark Session
spark = SparkSession.builder \\
    .appName("KafkaStreamProcessor") \\
    .config("spark.sql.streaming.checkpointLocation", "/tmp/checkpoint") \\
    .getOrCreate()

# 定义事件 Schema
event_schema = StructType([
    StructField("user_id", IntegerType()),
    StructField("event_type", StringType()),
    StructField("timestamp", StringType()),
    StructField("properties", MapType(StringType(), StringType()))
])

# 从 Kafka 读取数据流
df = spark \\
    .readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "localhost:9092") \\
    .option("subscribe", "user-events") \\
    .load()

# 解析 JSON 数据
parsed_df = df.select(
    from_json(col("value").cast("string"), event_schema).alias("data")
).select("data.*")

# 实时聚合分析
aggregated_df = parsed_df \\
    .withWatermark("timestamp", "10 minutes") \\
    .groupBy(
        window(col("timestamp"), "5 minutes"),
        col("event_type")
    ) \\
    .count() \\
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("event_type"),
        col("count")
    )

# 输出到控制台（可以改为输出到数据库）
query = aggregated_df \\
    .writeStream \\
    .outputMode("update") \\
    .format("console") \\
    .trigger(processingTime="30 seconds") \\
    .start()

query.awaitTermination()
\`\`\`

### 4. ClickHouse 存储
\`\`\`sql
-- 创建事件表
CREATE TABLE user_events (
    user_id UInt32,
    event_type String,
    timestamp DateTime,
    properties Map(String, String),
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY date
ORDER BY (user_id, timestamp);

-- 创建聚合表
CREATE TABLE event_stats (
    date Date,
    hour UInt8,
    event_type String,
    count UInt64
) ENGINE = SummingMergeTree()
PARTITION BY date
ORDER BY (date, hour, event_type);

-- 创建物化视图
CREATE MATERIALIZED VIEW event_stats_mv TO event_stats AS
SELECT
    toDate(timestamp) as date,
    toHour(timestamp) as hour,
    event_type,
    count() as count
FROM user_events
GROUP BY date, hour, event_type;
\`\`\`

### 5. 实时监控
\`\`\`python
# monitoring/kafka_monitor.py
from kafka.admin import KafkaAdminClient, ConfigResource, ConfigResourceType
from kafka import KafkaConsumer
import time

class KafkaMonitor:
    def __init__(self, bootstrap_servers=['localhost:9092']):
        self.admin_client = KafkaAdminClient(
            bootstrap_servers=bootstrap_servers
        )

    def get_topic_metrics(self, topic_name):
        consumer = KafkaConsumer(
            topic_name,
            bootstrap_servers=['localhost:9092'],
            auto_offset_reset='latest',
            enable_auto_commit=False
        )

        # 获取分区信息
        partitions = consumer.partitions_for_topic(topic_name)

        metrics = {}
        for partition in partitions:
            tp = TopicPartition(topic_name, partition)
            consumer.assign([tp])

            # 获取最新偏移量
            latest_offset = consumer.end_offsets([tp])[tp]

            # 获取当前消费者组偏移量
            committed = consumer.committed(tp)
            lag = latest_offset - (committed or 0)

            metrics[f'partition_{partition}'] = {
                'latest_offset': latest_offset,
                'committed_offset': committed,
                'lag': lag
            }

        return metrics

    def monitor_continuously(self, topics, interval=30):
        while True:
            for topic in topics:
                metrics = self.get_topic_metrics(topic)
                print(f"Topic: {topic}, Metrics: {metrics}")

            time.sleep(interval)

# 使用示例
monitor = KafkaMonitor()
monitor.monitor_continuously(['user-events', 'system-metrics'])
\`\`\`

这个解决方案提供了完整的实时数据处理框架。`,
      summary: '基于 Apache Kafka 的实时数据处理管道，支持大规模数据流处理和实时分析。',
      categorySlug: 'data-analytics',
      techStack: ['Apache Kafka', 'Apache Spark', 'ClickHouse', 'Python', 'Elasticsearch'],
      projectType: 'Data Pipeline',
      difficulty: 'ADVANCED',
      featured: true,
      published: true
    },
    {
      title: 'Flutter Cross-Platform Mobile App',
      slug: 'flutter-cross-platform-app',
      content: `# Flutter Cross-Platform Mobile App

## 项目概述

使用 Flutter 开发的跨平台移动应用，支持 iOS、Android 和 Web 平台，采用现代化的架构模式。

## 技术特性

### 核心技术栈
- **Flutter** - 跨平台 UI 框架
- **Dart** - 编程语言
- **Bloc/Cubit** - 状态管理
- **GetIt** - 依赖注入
- **Dio** - HTTP 客户端
- **Hive** - 本地数据库

## 项目架构

\`\`\`
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   └── utils/
├── features/
│   ├── auth/
│   ├── home/
│   └── profile/
├── shared/
│   ├── widgets/
│   └── themes/
└── main.dart
\`\`\`

### 1. 应用入口
\`\`\`dart
// main.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import 'core/di/injection_container.dart';
import 'core/themes/app_theme.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'shared/router/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 初始化依赖注入
  await initializeDependencies();

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final _appRouter = AppRouter();

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => GetIt.instance<AuthBloc>()),
        BlocProvider(create: (_) => GetIt.instance<HomeBloc>()),
      ],
      child: MaterialApp.router(
        title: 'Flutter Demo',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        routerConfig: _appRouter.config(),
      ),
    );
  }
}
\`\`\`

### 2. 状态管理 (Bloc)
\`\`\`dart
// features/auth/presentation/bloc/auth_bloc.dart
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;

  AuthBloc({
    required LoginUseCase loginUseCase,
    required LogoutUseCase logoutUseCase,
  })  : _loginUseCase = loginUseCase,
        _logoutUseCase = logoutUseCase,
        super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await _loginUseCase(LoginParams(
      email: event.email,
      password: event.password,
    ));

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(AuthSuccess(user)),
    );
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _logoutUseCase();
    emit(AuthInitial());
  }
}
\`\`\`

### 3. 网络层
\`\`\`dart
// core/network/api_client.dart
import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient({String? baseUrl}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl ?? 'https://api.example.com',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.addAll([
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: true,
      ),
      AuthInterceptor(),
    ]);
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }

  Future<Response> put(String path, {dynamic data}) {
    return _dio.put(path, data: data);
  }

  Future<Response> delete(String path) {
    return _dio.delete(path);
  }
}

class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // 添加认证 token
    final token = GetIt.instance<TokenStorage>().getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer \$token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token 过期，跳转到登录页
      GetIt.instance<AuthBloc>().add(LogoutRequested());
    }
    handler.next(err);
  }
}
\`\`\`

### 4. 本地存储
\`\`\`dart
// core/storage/local_storage.dart
import 'package:hive_flutter/hive_flutter.dart';

class LocalStorage {
  static const String _boxName = 'app_storage';
  late Box _box;

  Future<void> init() async {
    await Hive.initFlutter();
    _box = await Hive.openBox(_boxName);
  }

  Future<void> setString(String key, String value) async {
    await _box.put(key, value);
  }

  String? getString(String key) {
    return _box.get(key);
  }

  Future<void> setBool(String key, bool value) async {
    await _box.put(key, value);
  }

  bool? getBool(String key) {
    return _box.get(key);
  }

  Future<void> remove(String key) async {
    await _box.delete(key);
  }

  Future<void> clear() async {
    await _box.clear();
  }
}
\`\`\`

### 5. 自定义组件
\`\`\`dart
// shared/widgets/custom_button.dart
import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final ButtonStyle? style;

  const CustomButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.style,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: style ?? Theme.of(context).elevatedButtonTheme.style,
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Text(text),
      ),
    );
  }
}
\`\`\`

### 6. 主题配置
\`\`\`dart
// core/themes/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.dark,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
    );
  }
}
\`\`\`

这个解决方案提供了完整的 Flutter 应用开发框架。`,
      summary: '使用 Flutter 开发的跨平台移动应用，支持 iOS、Android 和 Web，采用现代化架构模式。',
      categorySlug: 'mobile-development',
      techStack: ['Flutter', 'Dart', 'Bloc', 'Dio', 'Hive'],
      projectType: 'Mobile App',
      difficulty: 'INTERMEDIATE',
      featured: false,
      published: true
    }
  ];

  for (const solution of solutions) {
    try {
      // 找到对应的分类 ID
      const category = categories.find(cat => cat.slug === solution.categorySlug);
      if (!category) {
        console.log(`❌ Category not found: ${solution.categorySlug}`);
        continue;
      }

      const solutionData = {
        ...solution,
        categoryId: category.id
      };
      delete solutionData.categorySlug;

      const response = await fetch(`${API_BASE}/tech-solutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solutionData),
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Created solution: ${solution.title}`);
      } else {
        console.log(`❌ Failed to create solution ${solution.title}:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Error creating solution ${solution.title}:`, error.message);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 开始创建技术分类...');
  await createTechCategories();
  
  console.log('\n🚀 开始创建技术方案...');
  await createTechSolutions();
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
