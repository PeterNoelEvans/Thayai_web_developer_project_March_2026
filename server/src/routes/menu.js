const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/menu - cone sizes, flavors, toppings
router.get('/', async (req, res) => {
  try {
    const [coneSizes, flavors, toppings] = await Promise.all([
      prisma.coneSize.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } }),
      prisma.flavor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
      prisma.topping.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    ]);
    res.json({ coneSizes, flavors, toppings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

module.exports = router;
