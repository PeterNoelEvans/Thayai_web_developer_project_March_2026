const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/now-serving - current queue number being served
router.get('/', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'nowServingQueueNumber' },
    });
    const queueNumber = parseInt(setting?.value ?? '0', 10);
    res.json({ nowServingQueueNumber: queueNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load now serving' });
  }
});

module.exports = router;
