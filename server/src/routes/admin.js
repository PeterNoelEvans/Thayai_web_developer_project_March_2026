const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// --- Cone sizes ---
router.get('/cones', async (req, res) => {
  try {
    const items = await prisma.coneSize.findMany({ orderBy: { price: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load cone sizes' });
  }
});

router.post('/cones', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price required' });
    const priceCents = Math.round(parseFloat(price) * 100) || 0;
    const item = await prisma.coneSize.create({
      data: { name: String(name).trim(), price: priceCents, isActive: true },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create cone size' });
  }
});

router.patch('/cones/:id', async (req, res) => {
  try {
    const { name, price, isActive } = req.body;
    const data = {};
    if (name !== undefined) data.name = String(name).trim();
    if (price !== undefined) data.price = Math.round(parseFloat(price) * 100);
    if (isActive !== undefined) data.isActive = !!isActive;
    const item = await prisma.coneSize.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cone size' });
  }
});

router.patch('/cones/:id/unavailable', async (req, res) => {
  try {
    await prisma.coneSize.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.patch('/cones/:id/available', async (req, res) => {
  try {
    await prisma.coneSize.update({ where: { id: req.params.id }, data: { isActive: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/cones/:id', async (req, res) => {
  try {
    await prisma.coneSize.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete: this item has been used in orders.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Flavors ---
router.get('/flavors', async (req, res) => {
  try {
    const items = await prisma.flavor.findMany({ orderBy: { name: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load flavors' });
  }
});

router.post('/flavors', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price required' });
    const priceCents = Math.round(parseFloat(price) * 100) || 0;
    const item = await prisma.flavor.create({
      data: { name: String(name).trim(), price: priceCents, isActive: true },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create flavor' });
  }
});

router.patch('/flavors/:id', async (req, res) => {
  try {
    const { name, price, isActive } = req.body;
    const data = {};
    if (name !== undefined) data.name = String(name).trim();
    if (price !== undefined) data.price = Math.round(parseFloat(price) * 100);
    if (isActive !== undefined) data.isActive = !!isActive;
    const item = await prisma.flavor.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update flavor' });
  }
});

router.patch('/flavors/:id/unavailable', async (req, res) => {
  try {
    await prisma.flavor.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.patch('/flavors/:id/available', async (req, res) => {
  try {
    await prisma.flavor.update({ where: { id: req.params.id }, data: { isActive: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/flavors/:id', async (req, res) => {
  try {
    await prisma.flavor.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete: this item has been used in orders.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Toppings ---
router.get('/toppings', async (req, res) => {
  try {
    const items = await prisma.topping.findMany({ orderBy: { name: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load toppings' });
  }
});

router.post('/toppings', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price required' });
    const priceCents = Math.round(parseFloat(price) * 100) || 0;
    const item = await prisma.topping.create({
      data: { name: String(name).trim(), price: priceCents, isActive: true },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create topping' });
  }
});

router.patch('/toppings/:id', async (req, res) => {
  try {
    const { name, price, isActive } = req.body;
    const data = {};
    if (name !== undefined) data.name = String(name).trim();
    if (price !== undefined) data.price = Math.round(parseFloat(price) * 100);
    if (isActive !== undefined) data.isActive = !!isActive;
    const item = await prisma.topping.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update topping' });
  }
});

router.patch('/toppings/:id/unavailable', async (req, res) => {
  try {
    await prisma.topping.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.patch('/toppings/:id/available', async (req, res) => {
  try {
    await prisma.topping.update({ where: { id: req.params.id }, data: { isActive: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/toppings/:id', async (req, res) => {
  try {
    await prisma.topping.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete: this item has been used in orders.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Clear all unused items (no orders reference them)
router.post('/clear-unused', async (req, res) => {
  try {
    const usedFlavorIds = [...new Set((await prisma.orderItem.findMany({ select: { flavorId: true } })).map((o) => o.flavorId))];
    const usedConeIds = [...new Set((await prisma.orderItem.findMany({ select: { coneSizeId: true } })).map((o) => o.coneSizeId))];
    const usedToppingIds = [...new Set((await prisma.orderItemTopping.findMany({ select: { toppingId: true } })).map((o) => o.toppingId))];

    const flavorWhere = usedFlavorIds.length ? { id: { notIn: usedFlavorIds } } : {};
    const coneWhere = usedConeIds.length ? { id: { notIn: usedConeIds } } : {};
    const toppingWhere = usedToppingIds.length ? { id: { notIn: usedToppingIds } } : {};

    await prisma.flavor.deleteMany({ where: flavorWhere });
    await prisma.coneSize.deleteMany({ where: coneWhere });
    await prisma.topping.deleteMany({ where: toppingWhere });

    res.json({ ok: true, message: 'Unused items removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear' });
  }
});

module.exports = router;
