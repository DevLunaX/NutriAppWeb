# NutriApp Backend

REST API backend for NutriApp using Node.js, Express, and Prisma with SQLite.

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

4. Push the database schema (creates SQLite database):
   ```bash
   npm run prisma:push
   ```

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:4000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload (nodemon) |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run seed` | Seed database with sample patients |

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |

### Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients |
| GET | `/api/patients/:id` | Get a patient by ID |
| GET | `/api/patients/search?term=` | Search patients by name, email, or phone |
| POST | `/api/patients` | Create a new patient |
| PUT | `/api/patients/:id` | Update a patient |
| DELETE | `/api/patients/:id` | Delete a patient |

### Patient Schema

```json
{
  "id": "uuid",
  "full_name": "string (required)",
  "email": "string",
  "phone": "string",
  "birth_date": "datetime",
  "gender": "string",
  "weight": "float",
  "height": "float",
  "allergies": "string",
  "medical_notes": "string",
  "photo_path": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Environment Variables

The `.env` file contains the following configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database file path |
| `PORT` | `4000` | Server port |
| `CORS_ORIGIN` | `http://localhost:4200` | Allowed CORS origin (Angular frontend) |

## Security Notes

⚠️ **This configuration is for local development only.**

For production environments:
- Migrate from SQLite to PostgreSQL or another production-ready database
- Add proper input validation and sanitization
- Implement authentication and authorization (JWT, OAuth, etc.)
- Use HTTPS
- Set appropriate CORS policies
- Add rate limiting
- Use environment variables for sensitive configuration
