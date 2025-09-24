@echo off
REM =============================================================================
REM KnoLib Windows Deployment Script
REM =============================================================================

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=knolib
set BACKUP_DIR=.\backups
set LOG_FILE=.\deploy.log

REM Colors (Windows doesn't support colors in batch, but we can use echo)
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "NC=[0m"

REM Functions
:log
echo [%date% %time%] %~1
echo [%date% %time%] %~1 >> %LOG_FILE%
goto :eof

:error
echo [%date% %time%] ERROR: %~1
echo [%date% %time%] ERROR: %~1 >> %LOG_FILE%
exit /b 1

:info
echo [%date% %time%] %~1
echo [%date% %time%] %~1 >> %LOG_FILE%
goto :eof

REM Check prerequisites
:check_prerequisites
call :log "Checking prerequisites..."

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    call :error "Docker is not installed. Please install Docker Desktop first."
    goto :eof
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if not errorlevel 1 (
    set DOCKER_COMPOSE=docker-compose
) else (
    docker compose version >nul 2>&1
    if not errorlevel 1 (
        set DOCKER_COMPOSE=docker compose
    ) else (
        call :error "Docker Compose is not available"
        goto :eof
    )
)

REM Check if .env file exists
if not exist ".env" (
    call :info ".env file not found. Creating from .env.production.example..."
    if exist ".env.production.example" (
        copy ".env.production.example" ".env"
        call :info "Please edit .env file with your configuration before continuing."
        pause
    ) else (
        call :error ".env.production.example not found. Please create .env file manually."
        goto :eof
    )
)

call :log "Prerequisites check completed."
goto :eof

REM Create necessary directories
:create_directories
call :log "Creating necessary directories..."

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist ".\logs" mkdir ".\logs"
if not exist ".\public\uploads" mkdir ".\public\uploads"
if not exist ".\ssl" mkdir ".\ssl"

call :log "Directories created."
goto :eof

REM Backup existing data
:backup_data
call :log "Creating backup..."

%DOCKER_COMPOSE% ps | findstr "knolib-postgres" >nul
if not errorlevel 1 (
    set BACKUP_FILE=%BACKUP_DIR%\knolib_backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
    set BACKUP_FILE=!BACKUP_FILE: =0!
    
    call :info "Creating database backup: !BACKUP_FILE!"
    %DOCKER_COMPOSE% exec -T postgres pg_dump -U knolib knolib > "!BACKUP_FILE!"
    
    call :log "Backup created: !BACKUP_FILE!"
) else (
    call :info "No existing database found, skipping backup."
)
goto :eof

REM Pull latest images
:pull_images
call :log "Pulling latest Docker images..."
%DOCKER_COMPOSE% pull
call :log "Images pulled successfully."
goto :eof

REM Build application
:build_application
call :log "Building KnoLib application..."
%DOCKER_COMPOSE% build app
if errorlevel 1 (
    call :error "Failed to build application"
    goto :eof
)
call :log "Application built successfully."
goto :eof

REM Start services
:start_services
call :log "Starting services..."

REM Start database and Redis first
%DOCKER_COMPOSE% up -d postgres redis

REM Wait for database to be ready
call :info "Waiting for database to be ready..."
timeout /t 30 /nobreak >nul

REM Run database migrations
call :log "Running database migrations..."
%DOCKER_COMPOSE% run --rm app npx prisma migrate deploy
if errorlevel 1 (
    call :error "Database migration failed"
    goto :eof
)

REM Generate Prisma client
%DOCKER_COMPOSE% run --rm app npx prisma generate

REM Start all services
%DOCKER_COMPOSE% up -d

call :log "Services started successfully."
goto :eof

REM Health check
:health_check
call :log "Performing health check..."

REM Wait for application to start
timeout /t 30 /nobreak >nul

REM Check if services are running
%DOCKER_COMPOSE% ps | findstr "Up" >nul
if errorlevel 1 (
    call :error "Some services are not running properly"
    goto :eof
)

REM Check application health endpoint
for /l %%i in (1,1,10) do (
    curl -f http://localhost:3000/api/health >nul 2>&1
    if not errorlevel 1 (
        call :log "Health check passed!"
        goto :health_check_end
    )
    call :info "Health check attempt %%i/10 failed, retrying in 10 seconds..."
    timeout /t 10 /nobreak >nul
)

call :error "Health check failed after 10 attempts"
goto :eof

:health_check_end
goto :eof

REM Show deployment info
:show_info
call :log "Deployment completed successfully!"
echo.
call :info "=== KnoLib Deployment Information ==="
call :info "Application URL: http://localhost:3000"
call :info "Health Check: http://localhost:3000/api/health"
call :info "Admin Panel: http://localhost:3000/admin"
echo.
call :info "=== Useful Commands ==="
call :info "View logs: docker-compose logs -f"
call :info "Stop services: docker-compose down"
call :info "Restart services: docker-compose restart"
echo.
call :info "=== Service Status ==="
%DOCKER_COMPOSE% ps
goto :eof

REM Main deployment function
:main
call :log "Starting KnoLib deployment..."

call :check_prerequisites
if errorlevel 1 goto :end

call :create_directories
call :backup_data
call :pull_images
call :build_application
if errorlevel 1 goto :end

call :start_services
if errorlevel 1 goto :end

call :health_check
if errorlevel 1 goto :end

call :show_info

:end
pause
