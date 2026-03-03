Prisma is a good choice here—especially because **you already know it**, and it will reduce “SQL syntax friction” for students while keeping the data model clear.

Yes, I would still use **Express** with Prisma for this project. It gives you the simplest, most teachable separation:

* Express = routes + request/response + serving pages
* Prisma = database model + queries + safety

Here is a **minimal step-by-step build sequence** tailored to **Node + Express + Prisma + PostgreSQL**, and aligned to your queue + order plan.

## Minimal build sequence (Express + Prisma + PostgreSQL)

### Step 1 — Create the project

1. `mkdir icecream-queue`
2. `npm init -y`
3. `npm i express`
4. `npm i -D nodemon` (optional)

Create `server.js` and confirm Express runs.

---

### Step 2 — Add Prisma and connect PostgreSQL

1. `npm i prisma @prisma/client`
2. `npx prisma init`
3. In `.env`, set `DATABASE_URL="postgresql://..."`
4. Decide DB name (e.g., `icecream_queue`)

---

### Step 3 — Create the Prisma schema (minimum models)

Create models for:

* `MenuItem`
* `Order`
* `OrderItem`
* `Setting` (for `nowServingQueueNumber`)

Then:

* `npx prisma migrate dev --name init`

---

### Step 4 — Seed menu items (with image URLs)

Add a `prisma/seed.js` that inserts:

* 6–12 menu items with `name`, `price`, `imageUrl`, `isActive`

Run seed.

This immediately unlocks frontend work.

---

### Step 5 — Serve static pages (customer/staff/display)

In Express:

* serve `/public` as static

Create three minimal pages:

* `public/index.html` (customer menu + cart)
* `public/staff.html`
* `public/display.html`

At first, hard-code a sample menu array in the frontend so they can build UI quickly.

---

### Step 6 — Build API: Get menu

Create route:

* `GET /api/menu` → returns active menu items from Prisma

Update the frontend to fetch and render menu items from the API.

---

### Step 7 — Build API: Create order (core feature)

Create route:

* `POST /api/orders`

Server does:

1. Validate items not empty
2. Load menu items/prices from DB (never trust frontend price)
3. Calculate totals
4. Generate queue number
5. Create `Order` + `OrderItem` rows (use a Prisma transaction)
6. Return `{ orderId, queueNumber, totalPrice }`

Frontend:

* When user clicks Order, POST items
* Show “Ticket” (queue number + summary)

---

### Step 8 — Build “ticket lookup” (optional but useful)

Route:

* `GET /api/orders/:id` → order + items + status

Ticket page can poll this (later) if you want status updates.

---

### Step 9 — Staff: “Next order” and “Call Next”

Routes:

* `GET /api/orders/next` → oldest `waiting` order
* `POST /api/orders/:id/call` →

  * set that order to `serving`
  * update Setting `nowServingQueueNumber`

Staff page:

* shows next waiting order and a button “Call Next”

---

### Step 10 — Public display: “Now Serving”

Route:

* `GET /api/now-serving` → returns `nowServingQueueNumber`

Display page:

* polls every 3–5 seconds

---

## The simplest Prisma schema (conceptual)

Keep it small:

* `MenuItem`: id, name, price, imageUrl, isActive
* `Order`: id, queueNumber, status, createdAt, totalPrice
* `OrderItem`: id, orderId, menuItemId, qty, unitPrice
* `Setting`: key, value (store now-serving)

This is enough for a working system.

---

## One teaching recommendation

Have students build in this order:

1. customer menu page renders from DB
2. create order works and returns queue number
3. staff page can call next
4. display updates

That sequence creates visible progress early, which reduces planning paralysis.

---

If you want, I can provide a **minimal Prisma `schema.prisma`** and a matching **Express route skeleton** (just enough code to compile) that your students can copy directly.
