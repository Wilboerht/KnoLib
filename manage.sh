#!/bin/bash

# =============================================================================
# KnoLib Management Script
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Check if Docker Compose is available
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        error "Docker Compose is not available"
    fi
}

# Start services
start_services() {
    log "🚀 Starting KnoLib services..."
    check_docker_compose
    $DOCKER_COMPOSE up -d
    log "Services started successfully!"
}

# Stop services
stop_services() {
    log "🛑 Stopping KnoLib services..."
    check_docker_compose
    $DOCKER_COMPOSE down
    log "Services stopped successfully!"
}

# Restart services
restart_services() {
    log "🔄 Restarting KnoLib services..."
    check_docker_compose
    $DOCKER_COMPOSE restart
    log "Services restarted successfully!"
}

# Show service status
show_status() {
    log "📊 KnoLib service status:"
    check_docker_compose
    $DOCKER_COMPOSE ps
    
    echo
    info "=== Health Check ==="
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "✅ Application is healthy"
    else
        warn "❌ Application health check failed"
    fi
}

# Show logs
show_logs() {
    check_docker_compose
    
    if [ -n "$2" ]; then
        log "📋 Showing logs for service: $2"
        $DOCKER_COMPOSE logs -f "$2"
    else
        log "📋 Showing logs for all services (Press Ctrl+C to exit)"
        $DOCKER_COMPOSE logs -f
    fi
}

# Create database backup
create_backup() {
    log "💾 Creating database backup..."
    check_docker_compose
    
    # Create backup directory if it doesn't exist
    mkdir -p ./backups
    
    BACKUP_FILE="./backups/knolib_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if $DOCKER_COMPOSE exec -T postgres pg_dump -U knolib knolib > "$BACKUP_FILE"; then
        # Compress backup
        gzip "$BACKUP_FILE"
        log "✅ Backup created: ${BACKUP_FILE}.gz"
    else
        error "❌ Backup failed"
    fi
}

# Restore database from backup
restore_backup() {
    if [ -z "$2" ]; then
        error "Please specify backup file: $0 restore <backup-file>"
    fi
    
    BACKUP_FILE="$2"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        error "Backup file not found: $BACKUP_FILE"
    fi
    
    log "🔄 Restoring database from: $BACKUP_FILE"
    check_docker_compose
    
    # Check if file is compressed
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        zcat "$BACKUP_FILE" | $DOCKER_COMPOSE exec -T postgres psql -U knolib -d knolib
    else
        cat "$BACKUP_FILE" | $DOCKER_COMPOSE exec -T postgres psql -U knolib -d knolib
    fi
    
    log "✅ Database restored successfully"
}

# Update services
update_services() {
    log "🔄 Updating KnoLib services..."
    check_docker_compose
    
    # Pull latest images
    $DOCKER_COMPOSE pull
    
    # Rebuild and restart
    $DOCKER_COMPOSE up -d --build
    
    log "✅ Services updated successfully"
}

# Clean up Docker resources
cleanup_docker() {
    log "🧹 Cleaning up Docker resources..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    if [ "$2" = "--volumes" ]; then
        warn "Removing unused volumes (this may delete data!)"
        docker volume prune -f
    fi
    
    # Remove unused networks
    docker network prune -f
    
    log "✅ Cleanup completed"
}

# Run database migrations
run_migrations() {
    log "🔄 Running database migrations..."
    check_docker_compose
    
    $DOCKER_COMPOSE exec app npx prisma migrate deploy
    
    log "✅ Migrations completed"
}

# Access database shell
database_shell() {
    log "🗄️ Opening database shell..."
    check_docker_compose
    
    $DOCKER_COMPOSE exec postgres psql -U knolib -d knolib
}

# Access application shell
app_shell() {
    log "🖥️ Opening application shell..."
    check_docker_compose
    
    $DOCKER_COMPOSE exec app /bin/sh
}

# Show help
show_help() {
    echo "KnoLib Management Script"
    echo
    echo "Usage: $0 <command> [options]"
    echo
    echo "Commands:"
    echo "  start                    Start all services"
    echo "  stop                     Stop all services"
    echo "  restart                  Restart all services"
    echo "  status                   Show service status"
    echo "  logs [service]           Show logs (optionally for specific service)"
    echo "  backup                   Create database backup"
    echo "  restore <file>           Restore database from backup"
    echo "  update                   Update services to latest version"
    echo "  migrate                  Run database migrations"
    echo "  cleanup [--volumes]      Clean up Docker resources"
    echo "  db-shell                 Open database shell"
    echo "  app-shell                Open application shell"
    echo "  help                     Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start                 # Start all services"
    echo "  $0 logs app              # Show application logs"
    echo "  $0 backup                # Create database backup"
    echo "  $0 restore backup.sql.gz # Restore from backup"
    echo "  $0 cleanup --volumes     # Clean up including volumes"
}

# Main function
main() {
    case "$1" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$@"
            ;;
        backup)
            create_backup
            ;;
        restore)
            restore_backup "$@"
            ;;
        update)
            update_services
            ;;
        migrate)
            run_migrations
            ;;
        cleanup)
            cleanup_docker "$@"
            ;;
        db-shell)
            database_shell
            ;;
        app-shell)
            app_shell
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Unknown command: $1\n\nUse '$0 help' to see available commands."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
