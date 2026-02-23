#!/bin/bash

# Script to create an admin user in Supabase
# Usage: ./scripts/create-admin.sh <email> <password>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if arguments are provided
if [ $# -ne 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo "Usage: $0 <email> <password>"
    echo "Example: $0 admin@example.com mySecurePassword123"
    exit 1
fi

EMAIL="$1"
PASSWORD="$2"

# Validate email format (basic)
if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo -e "${RED}Error: Invalid email format${NC}"
    exit 1
fi

# Validate password length
if [ ${#PASSWORD} -lt 6 ]; then
    echo -e "${RED}Error: Password must be at least 6 characters${NC}"
    exit 1
fi

# Supabase local development URL and anon key
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

echo -e "${YELLOW}Creating admin user...${NC}"
echo "Email: $EMAIL"

# Create the user via Supabase Auth API
RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

# Check if the response contains an access_token (success indicator)
if echo "$RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✓ Admin user created successfully!${NC}"
    echo ""
    echo "Login credentials:"
    echo "  Email:    $EMAIL"
    echo "  Password: $PASSWORD"
    echo ""
    echo "You can now login at: http://localhost:3000/admin"
else
    echo -e "${RED}✗ Failed to create user${NC}"
    echo "Response from Supabase:"
    echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    exit 1
fi
