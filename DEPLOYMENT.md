# Thayai Deployment & Workflow

## Folder layout

| Folder | Purpose |
|--------|---------|
| `/mnt/LMS-database/repos/Thayai-dev` | Development – code here, push to GitHub |
| `/mnt/LMS-database/repos/Thayai-production` | Production – pull from GitHub, run via Cloudflare tunnel |

## Git workflow

```
Thayai-dev (dev branch)  →  push  →  GitHub  →  PR → main  →  pull  →  Thayai-production
```

### Steps

1. **Develop in Thayai-dev**
   ```bash
   cd /mnt/LMS-database/repos/Thayai-dev
   git checkout dev
   # ... make changes ...
   git add .
   git commit -m "feat: your message"
   git push origin dev
   ```

2. **Create PR on GitHub**
   - Open PR: `dev` → `main`
   - Review and merge

3. **Deploy to production**
   ```bash
   cd /mnt/LMS-database/repos/Thayai-production
   git pull origin main
   npm install
   cd server && npm install
   # Restart your process (pm2, systemd, etc.)
   ```

## Database

Thayai uses a separate PostgreSQL database from your LMS:

- **Database name:** `thayai_db`
- **Create:** `createdb thayai_db`
- **Connection:** Use `DATABASE_URL` in `.env` (see server/.env.example)

## Ports

| Service | Port | Notes |
|---------|------|-------|
| LMS | 3000, 3101 | Already in use |
| **Thayai API** | **3200** | Default for this project |

## Environment setup

### Dev

```bash
cd /mnt/LMS-database/repos/Thayai-dev/server
cp .env.example .env
# Edit .env with your values
```

### Production

```bash
cd /mnt/LMS-database/repos/Thayai-production/server
cp .env.example .env
# Edit .env with production values
```

## Cloudflare tunnel

Configure your tunnel to point to `localhost:3200` when serving Thayai production.

## Hat Yai deployment

When moving to Hat Yai:

1. Clone the repo on the server
2. Set up PostgreSQL and `thayai_db`
3. Configure `.env` with production values
4. Run migrations: `npm run migrate`
5. Point Cloudflare tunnel or reverse proxy to the Thayai API port
