#!/usr/bin/env node
/**
 * Seed: creates only settings (nowServingQueueNumber, nextQueueNumber).
 * Cone sizes, flavors, and toppings are added by staff via the Staff page.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding...');

  await prisma.setting.upsert({
    where: { key: 'nowServingQueueNumber' },
    update: { value: '0' },
    create: { key: 'nowServingQueueNumber', value: '0' },
  });

  await prisma.setting.upsert({
    where: { key: 'nextQueueNumber' },
    update: { value: '1' },
    create: { key: 'nextQueueNumber', value: '1' },
  });

  console.log('Seeded settings. Add cone sizes, flavors, and toppings via the Staff page.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
