# Database Setup Guide

## Overview
This project uses PostgreSQL with Prisma ORM for database management. The database stores network configuration data for the ORCA AI Agents Explorer.

## Database Configuration

### Environment Variables
Update your `.env` file with your actual database credentials:

```env
DATABASE_URL="postgresql://postgres.vbvqakiuprnrgbdlirrl:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vbvqakiuprnrgbdlirrl:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## Database Schema

### NetworkConfig Table
```sql
CREATE TABLE "network_configs" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "smartContractAppID" TEXT NOT NULL
);
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install prisma @prisma/client
```

### 2. Update Database Password
Edit `.env` file and replace `[YOUR-PASSWORD]` with your actual password.

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migration
```bash
npx prisma migrate dev --name init
```

### 5. Seed Initial Data (Optional)
```bash
npx prisma db seed
```

## Database Operations

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name migration_name
```

## API Endpoints

### GET /api/network-configs
Returns all network configurations from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "testnet",
    "smartContractAppID": "1234567890"
  },
  {
    "id": 2,
    "name": "mainnet", 
    "smartContractAppID": "0987654321"
  }
]
```

## Sample Data
To populate the database with initial data, run these SQL commands:

```sql
INSERT INTO "network_configs" ("name", "smartContractAppID") VALUES 
('testnet', '1234567890'),
('mainnet', '0987654321');
```

## File Structure
```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration files
├── lib/
│   └── prisma.ts             # Prisma client instance
└── app/api/network-configs/
    └── route.ts              # API endpoint
```

## Troubleshooting

### Authentication Error
- Verify your database password in `.env`
- Check database connection settings
- Ensure database server is accessible

### Migration Issues
- Run `npx prisma migrate reset` to reset database
- Check PostgreSQL version compatibility
- Verify database permissions

### Connection Pool Issues
- Use `DIRECT_URL` for migrations
- Use `DATABASE_URL` for application queries
- Check connection limits on your database provider