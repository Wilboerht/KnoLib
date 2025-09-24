#!/bin/bash

# =============================================================================
# KnoLib Deployment Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="knolib"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        warn ".env file not found. Creating from .env.production.example..."
        if [ -f ".env.production.example" ]; then
            cp .env.production.example .env
            warn "Please edit .env file with your configuration before continuing."
            read -p "Press Enter to continue after editing .env file..."
        else
            error ".env.production.example not found. Please create .env file manually."
        fi
    fi
    
    log "Prerequisites check completed."
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
    mkdir -p "./public/uploads"
    mkdir -p "./ssl"
    
    log "Directories created."
}

# Backup existing data
backup_data() {
    log "Creating backup..."
    
    if docker-compose ps | grep -q "knolib-postgres"; then
        BACKUP_FILE="$BACKUP_DIR/knolib_backup_$(date +%Y%m%d_%H%M%S).sql"
        
        info "Creating database backup: $BACKUP_FILE"
        docker-compose exec -T postgres pg_dump -U knolib knolib > "$BACKUP_FILE" || warn "Database backup failed"
        
        # Compress backup
        gzip "$BACKUP_FILE" || warn "Backup compression failed"
        
        log "Backup created: ${BACKUP_FILE}.gz"
    else
        info "No existing database found, skipping backup."
    fi
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    docker-compose pull || warn "Failed to pull some images"
    
    log "Images pulled successfully."
}

# Build application
build_application() {
    log "Building KnoLib application..."
    
    # Build the application image
    docker-compose build app || error "Failed to build application"
    
    log "Application built successfully."
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start database and Redis first
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    info "Waiting for database to be ready..."
    sleep 30
    
    # Run database migrations
    log "Running database migrations..."
    docker-compose run --rm app npx prisma migrate deploy || error "Database migration failed"
    
    # Generate Prisma client
    docker-compose run --rm app npx prisma generate || warn "Prisma client generation failed"
    
    # Start all services
    docker-compose up -d
    
    log "Services started successfully."
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for application to start
    sleep 30
    
    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        error "Some services are not running properly"
    fi
    
    # Check application health endpoint
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log "Health check passed!"
            return 0
        fi
        info "Health check attempt $i/10 failed, retrying in 10 seconds..."
        sleep 10
    done
    
    error "Health check failed after 10 attempts"
}

# Setup admin user (optional)
setup_admin() {
    if [ "$1" = "--setup-admin" ]; then
        log "Setting up admin user..."
        
        read -p "Enter admin email: " ADMIN_EMAIL
        read -s -p "Enter admin password: " ADMIN_PASSWORD
        echo
        
        docker-compose exec app node -e "
        const { PrismaClient } = require('@prisma/client');
        const bcrypt = require('bcryptjs');
        const prisma = new PrismaClient();
        
        async function createAdmin() {
            const hashedPassword = await bcrypt.hash('$ADMIN_PASSWORD', 12);
            const admin = await prisma.user.upsert({
                where: { email: '$ADMIN_EMAIL' },
                update: { password: hashedPassword, role: 'ADMIN' },
                create: {
                    email: '$ADMIN_EMAIL',
                    password: hashedPassword,
                    name: 'Administrator',
                    role: 'ADMIN',
                    isActive: true
                }
            });
            console.log('Admin user created:', admin.email);
        }
        
        createAdmin().catch(console.error).finally(() => prisma.\$disconnect());
        " || warn "Failed to create admin user"
        
        log "Admin user setup completed."
    fi
}

# Cleanup old images and containers
cleanup() {
    if [ "$1" = "--cleanup" ]; then
        log "Cleaning up old Docker resources..."
        
        docker system prune -f || warn "Docker cleanup failed"
        docker image prune -f || warn "Image cleanup failed"
        
        log "Cleanup completed."
    fi
}

# Show deployment info
show_info() {
    log "Deployment completed successfully!"
    echo
    info "=== KnoLib Deployment Information ==="
    info "Application URL: http://localhost:3000"
    info "Health Check: http://localhost:3000/api/health"
    info "Admin Panel: http://localhost:3000/admin"
    echo
    info "=== Useful Commands ==="
    info "View logs: docker-compose logs -f"
    info "Stop services: docker-compose down"
    info "Restart services: docker-compose restart"
    info "Database backup: docker-compose exec postgres pg_dump -U knolib knolib > backup.sql"
    echo
    info "=== Service Status ==="
    docker-compose ps
}

# Main deployment function
main() {
    log "Starting KnoLib deployment..."
    
    check_prerequisites
    create_directories
    
    # Parse command line arguments
    SETUP_ADMIN=false
    CLEANUP=false
    SKIP_BACKUP=false
    
    for arg in "$@"; do
        case $arg in
            --setup-admin)
                SETUP_ADMIN=true
                ;;
            --cleanup)
                CLEANUP=true
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --setup-admin    Create admin user after deployment"
                echo "  --cleanup        Clean up old Docker resources"
                echo "  --skip-backup    Skip database backup"
                echo "  --help           Show this help message"
                exit 0
                ;;
        esac
    done
    
    # Backup existing data (unless skipped)
    if [ "$SKIP_BACKUP" = false ]; then
        backup_data
    fi
    
    pull_images
    build_application
    start_services
    health_check
    
    # Setup admin user if requested
    if [ "$SETUP_ADMIN" = true ]; then
        setup_admin --setup-admin
    fi
    
    # Cleanup if requested
    if [ "$CLEANUP" = true ]; then
        cleanup --cleanup
    fi
    
    show_info
}

# Run main function with all arguments
main "$@"
