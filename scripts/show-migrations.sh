#!/bin/bash

# Script to display all migrations in order for easy copy-paste to Supabase SQL Editor

echo "=================================================="
echo "Database Migrations for Production Supabase"
echo "=================================================="
echo ""
echo "Copy and paste each migration into Supabase SQL Editor in this order:"
echo ""

for file in supabase/migrations/*.sql; do
  echo "=================================================="
  echo "📄 Migration: $(basename "$file")"
  echo "=================================================="
  cat "$file"
  echo ""
  echo ""
done

echo "=================================================="
echo "✅ Done! Run these migrations in your Supabase SQL Editor"
echo "=================================================="
