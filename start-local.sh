#!/bin/bash

# BetaVen Local Development Startup Script
# One-click script to run your dating app locally

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${MAGENTA}"
echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║           🚀 BetaVen Startup             ║"
echo "║       Dating App - Local Development      ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ]; then
    print_error "Not in BetaVen directory!"
    echo "Please navigate to: /Users/ven/TROY/BetaVen"
    exit 1
fi

print_success "Found BetaVen project directory"
echo ""

# Step 1: Environment Setup
print_status "Step 1: Setting up environment variables..."
if [ ! -f ".env" ]; then
    print_warning ".env file not found, creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        echo ""
        print_warning "⚠️  IMPORTANT: Edit .env file with your actual credentials!"
        echo "   Required variables:"
        echo "   - DATABASE_URL (for production) or use SQLite for local dev"
        echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
        echo "   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (optional)"
        echo ""
        read -p "Press Enter to continue with default SQLite database..."
    else
        print_error ".env.example not found!"
        exit 1
    fi
fi

# Set SQLite for local development if DATABASE_URL is not set properly
if ! grep -q "DATABASE_URL.*file:" .env 2>/dev/null; then
    print_status "Configuring SQLite for local development..."
    sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env 2>/dev/null || true
    print_success "Using SQLite database for local development"
fi

# Update schema for SQLite if needed
print_status "Checking database configuration..."
if grep -q 'provider = "postgresql"' schema.prisma; then
    print_warning "Schema is set to PostgreSQL. For local dev, we'll use SQLite."
    print_status "Creating local schema configuration..."
    
    # Create a local schema for SQLite
    sed 's/provider = "postgresql"/provider = "sqlite"/' schema.prisma > schema.local.prisma
    sed -i '' 's|url      = env("DATABASE_URL")|url      = "file:./dev.db"|' schema.local.prisma
    
    export PRISMA_SCHEMA_PATH="./schema.local.prisma"
    print_success "Using SQLite for local development"
else
    print_success "Database configuration OK"
fi

echo ""

# Step 2: Install Dependencies
print_status "Step 2: Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    print_status "Installing dependencies (this may take a few minutes)..."
    npm install --legacy-peer-deps
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

echo ""

# Step 3: Generate Prisma Client
print_status "Step 3: Generating Prisma client..."
if [ -n "$PRISMA_SCHEMA_PATH" ]; then
    npx prisma generate --schema=$PRISMA_SCHEMA_PATH
else
    npx prisma generate
fi
print_success "Prisma client generated"

echo ""

# Step 4: Database Setup
print_status "Step 4: Setting up database..."

# Check if database exists
if [ -f "dev.db" ]; then
    print_success "Database file exists"
    read -p "Reset database? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        rm -f dev.db dev.db-journal
        
        if [ -n "$PRISMA_SCHEMA_PATH" ]; then
            npx prisma migrate dev --name init --schema=$PRISMA_SCHEMA_PATH
        else
            npx prisma migrate dev --name init
        fi
        
        print_success "Database reset complete"
    fi
else
    print_status "Creating database..."
    if [ -n "$PRISMA_SCHEMA_PATH" ]; then
        npx prisma migrate dev --name init --schema=$PRISMA_SCHEMA_PATH
    else
        npx prisma migrate dev --name init
    fi
    print_success "Database created"
fi

echo ""

# Step 5: Seed Database (Optional)
if [ -f "seed.ts" ]; then
    print_status "Step 5: Seeding database (optional)..."
    read -p "Seed database with sample data? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_status "Seeding database..."
        npm run seed || print_warning "Seeding failed (this is optional)"
        print_success "Database seeded"
    else
        print_warning "Skipped database seeding"
    fi
else
    print_warning "No seed file found (optional)"
fi

echo ""

# Step 6: Start Development Server
print_status "Step 6: Starting development server..."
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ BetaVen is starting...${NC}"
echo ""
echo -e "  ${CYAN}➜${NC}  Local:   ${GREEN}http://localhost:3000${NC}"
echo -e "  ${CYAN}➜${NC}  Network: Use this URL to access from other devices"
echo ""
echo -e "${YELLOW}📝 Tips:${NC}"
echo -e "  • Press ${CYAN}Ctrl+C${NC} to stop the server"
echo -e "  • Edit files and see changes instantly (Hot Reload)"
echo -e "  • Check the terminal for errors and logs"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""

# Start the dev server
npm run dev
