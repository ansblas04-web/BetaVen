#!/bin/bash

# BetaVen Prerequisites Checker
# Run this first to verify your system is ready

echo "🔍 Checking BetaVen Prerequisites..."
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MISSING=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Found${NC} ($NODE_VERSION)"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install from: https://nodejs.org/ (v18 or higher recommended)"
    MISSING=1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ Found${NC} ($NPM_VERSION)"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Comes with Node.js installation"
    MISSING=1
fi

# Check Docker (optional for database)
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | sed 's/,//')
    echo -e "${GREEN}✓ Found${NC} ($DOCKER_VERSION)"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "  Optional but recommended for PostgreSQL"
    echo "  Install from: https://www.docker.com/products/docker-desktop/"
fi

# Check Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d ' ' -f3)
    echo -e "${GREEN}✓ Found${NC} ($GIT_VERSION)"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install with: brew install git"
    MISSING=1
fi

# Check if we're in the right directory
echo -n "Checking project directory... "
if [ -f "package.json" ] && [ -f "next.config.ts" ]; then
    echo -e "${GREEN}✓ Correct directory${NC}"
else
    echo -e "${RED}✗ Wrong directory${NC}"
    echo "  Please run this from: /Users/ven/TROY/BetaVen"
    MISSING=1
fi

# Check .env file
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "  Will be created from .env.example on first run"
fi

# Check node_modules
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo "  Will be installed automatically"
fi

echo ""
echo "=================================="
if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All required prerequisites are met!${NC}"
    echo ""
    echo "You can now run:"
    echo "  ./start-local.sh"
else
    echo -e "${RED}❌ Missing required prerequisites${NC}"
    echo ""
    echo "Please install the missing items above, then run this check again."
    exit 1
fi
