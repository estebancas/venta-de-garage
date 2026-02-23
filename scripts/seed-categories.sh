#!/bin/bash

# Script to seed sample categories
# Usage: ./scripts/seed-categories.sh

set -e

SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

echo "Seeding categories..."

# Sample categories
categories=(
  '{"name":"Electronics","slug":"electronics"}'
  '{"name":"Furniture","slug":"furniture"}'
  '{"name":"Clothing","slug":"clothing"}'
  '{"name":"Books","slug":"books"}'
  '{"name":"Toys & Games","slug":"toys-games"}'
  '{"name":"Sports & Outdoors","slug":"sports-outdoors"}'
  '{"name":"Home & Garden","slug":"home-garden"}'
  '{"name":"Other","slug":"other"}'
)

for category in "${categories[@]}"; do
  echo "Adding: $category"
  curl -s -X POST "${SUPABASE_URL}/rest/v1/categories" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "$category" > /dev/null
done

echo "✓ Categories seeded successfully!"
