---

````markdown
# Restaurant QR Ordering System

A full-stack web application that allows restaurant customers to scan a QR code at their table, browse a digital menu, and place orders directly from their phones. Staff can manage incoming orders through a dashboard.

Built with:
- Node.js
- Express.js
- PostgreSQL
- (Frontend framework of choice: React / Vanilla / etc.)

---

## 1. Project Overview

This system allows:

- Customers to scan a QR code at a table
- Multiple customers to join the same table session
- Customers to browse menu items
- Customers to submit orders
- Staff to manage order status in real time

The system is designed with clear separation between:
- Frontend (Client)
- Backend (API)
- Database (PostgreSQL)

---

## 2. Architecture

Client (Customer Phone / Staff Dashboard)
        ↓
Node/Express API
        ↓
PostgreSQL Database

Important Rule:
Frontend never communicates directly with the database.
All business logic is handled by the API.

---

## 3. Core Concepts

### Table Session

A table session represents a group of customers sitting at one table.

- Only one OPEN session per table
- Multiple customers can join the same session
- Orders are linked to the session

### Order Lifecycle

Order statuses:

DRAFT → SUBMITTED → CONFIRMED → PREPARING → READY → SERVED
                          ↓
                       CANCELLED

Status transitions are controlled by the backend.

---

## 4. Database Structure (High-Level)

Main tables:

- restaurants
- tables
- table_sessions
- participants
- menu_categories
- menu_items
- modifier_groups
- modifier_options
- orders
- order_items
- users (staff)

Key Rules:

- Money is stored as integers (price_cents)
- Order items snapshot name and price
- Only one OPEN session per table

---

## 5. API Endpoints (Core)

### Customer

POST /api/sessions/join  
GET  /api/sessions/:sessionId/menu  
POST /api/orders  
GET  /api/sessions/:sessionId/orders  

### Staff

GET   /api/staff/orders?status=SUBMITTED  
PATCH /api/staff/orders/:orderId/status  

All endpoints return JSON.

---

## 6. Development Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd restaurant-ordering-app
````

### 2. Install dependencies

```bash
cd server
npm install
```

### 3. Setup environment variables

Create a `.env` file in `/server`:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_db
```

### 4. Run database migrations

(Depends on migration tool used: Prisma / Knex / custom SQL)

Example:

```bash
npm run migrate
```

### 5. Start development server

```bash
npm run dev
```

---

## 7. Git Workflow

Main Branches:

* main → production-ready code
* dev → integration branch

Feature workflow:

1. Create feature branch:
   feature/<name>-<module>

2. Push branch

3. Create Pull Request into dev

4. Code review

5. Merge

Never push directly to main.

---

## 8. Team Responsibilities

* Database & Schema Owner
* Session & QR Flow Owner
* Menu & UI Owner
* Cart & Order Submission Owner
* Staff Dashboard Owner
* Integration & Testing Owner

Each module should be developed independently but follow the shared API contract.

---

## 9. Project Rules

* Use UUIDs for all IDs
* Never hardcode status strings
* Validate all input on the backend
* No direct database access from frontend
* Keep business logic inside service layer

---

## 10. Future Improvements

* Real-time updates (WebSockets)
* Payment integration
* Admin dashboard
* Inventory management
* Multi-restaurant support
* Role-based permissions

---

## 11. License

Educational project.

```

---

If you would like, I can also provide:

- A more advanced **professional production-style README**
- Or a simplified student-friendly README
- Or a version that includes exact PostgreSQL schema snippets
- Or a version tailored specifically for your M4 girls project presentation

Tell me which tone you prefer.
```
