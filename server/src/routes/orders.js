const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - create order
router.post('/', async (req, res) => {
  try {
    const { items } = req.body; // [{ coneSizeId, flavorId, qty, toppingIds: [] }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items required' });
    }

    const setting = await prisma.setting.findUnique({ where: { key: 'nextQueueNumber' } });
    const queueNumber = parseInt(setting?.value ?? '1', 10);

    let totalPrice = 0;
    const orderItemsData = [];

    for (const it of items) {
      const coneSize = await prisma.coneSize.findUnique({ where: { id: it.coneSizeId } });
      const flavor = await prisma.flavor.findUnique({ where: { id: it.flavorId } });
      if (!coneSize || !coneSize.isActive) return res.status(400).json({ error: `Invalid cone size: ${it.coneSizeId}` });
      if (!flavor || !flavor.isActive) return res.status(400).json({ error: `Invalid flavor: ${it.flavorId}` });

      const qty = Math.max(1, parseInt(it.qty, 10) || 1);
      let itemTotal = (coneSize.price + flavor.price) * qty;

      const toppingsData = [];
      if (it.toppingIds && Array.isArray(it.toppingIds)) {
        for (const tid of it.toppingIds) {
          const topping = await prisma.topping.findUnique({ where: { id: tid } });
          if (topping && topping.isActive) {
            toppingsData.push({ toppingId: tid, qty: 1, unitPrice: topping.price });
            itemTotal += topping.price;
          }
        }
      }

      totalPrice += itemTotal;
      orderItemsData.push({
        coneSizeId: coneSize.id,
        flavorId: flavor.id,
        qty,
        conePrice: coneSize.price,
        flavorPrice: flavor.price,
        toppings: toppingsData,
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.create({
        data: {
          queueNumber,
          status: 'waiting',
          totalPrice,
          orderItems: {
            create: orderItemsData.map((o) => ({
              coneSizeId: o.coneSizeId,
              flavorId: o.flavorId,
              qty: o.qty,
              conePrice: o.conePrice,
              flavorPrice: o.flavorPrice,
              toppings: o.toppings.length
                ? { create: o.toppings.map((t) => ({ toppingId: t.toppingId, qty: t.qty, unitPrice: t.unitPrice })) }
                : undefined,
            })),
          },
        },
      });

      await tx.setting.upsert({
        where: { key: 'nextQueueNumber' },
        update: { value: String(queueNumber + 1) },
        create: { key: 'nextQueueNumber', value: String(queueNumber + 1) },
      });

      return ord;
    });

    res.status(201).json({
      orderId: order.id,
      queueNumber: order.queueNumber,
      totalPrice: order.totalPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders - list orders (for staff), ?status=waiting|serving|done
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const where = status ? { status } : {};
    const orders = await prisma.order.findMany({
      where,
      orderBy: { queueNumber: 'asc' },
      include: {
        orderItems: {
          include: {
            coneSize: true,
            flavor: true,
            toppings: { include: { topping: true } },
          },
        },
      },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// GET /api/orders/next - oldest waiting order (must be before /:id)
router.get('/next', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { status: 'waiting' },
      orderBy: { queueNumber: 'asc' },
      include: {
        orderItems: {
          include: {
            coneSize: true,
            flavor: true,
            toppings: { include: { topping: true } },
          },
        },
      },
    });
    res.json(order || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load next order' });
  }
});

// GET /api/orders/:id - ticket lookup
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        orderItems: {
          include: {
            coneSize: true,
            flavor: true,
            toppings: { include: { topping: true } },
          },
        },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load order' });
  }
});

// POST /api/orders/:id/call - call next (set serving, update nowServingQueueNumber)
router.post('/:id/call', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'waiting') {
      return res.status(400).json({ error: 'Order is not waiting' });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: req.params.id },
        data: { status: 'serving' },
      }),
      prisma.setting.upsert({
        where: { key: 'nowServingQueueNumber' },
        update: { value: String(order.queueNumber) },
        create: { key: 'nowServingQueueNumber', value: String(order.queueNumber) },
      }),
    ]);

    res.json({ ok: true, queueNumber: order.queueNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to call order' });
  }
});

// POST /api/orders/:id/done - mark order as done
router.post('/:id/done', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'done' },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

module.exports = router;
