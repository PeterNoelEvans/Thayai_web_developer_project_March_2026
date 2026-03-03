const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
const CONES_DIR = path.join(UPLOAD_DIR, 'cones');
const FLAVORS_DIR = path.join(UPLOAD_DIR, 'flavors');
const TOPPING_DIR = path.join(UPLOAD_DIR, 'toppings');

[UPLOAD_DIR, CONES_DIR, FLAVORS_DIR, TOPPING_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);
    cb(null, allowed);
  },
});

const DIRS = { cone: CONES_DIR, flavor: FLAVORS_DIR, topping: TOPPING_DIR };
const SUBPATHS = { cone: 'cones', flavor: 'flavors', topping: 'toppings' };

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const type = req.body.type || 'cone';
    const slug = (req.body.slug || req.file.originalname).replace(/\s+/g, '-').toLowerCase().replace(/\.(jpe?g|png|webp|gif)$/i, '');
    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `${slug}${ext}`;
    const dir = DIRS[type] || CONES_DIR;
    const subpath = SUBPATHS[type] || 'cones';
    fs.writeFileSync(path.join(dir, filename), req.file.buffer);
    const relPath = `/uploads/${subpath}/${filename}`;

    if (type === 'cone' && req.body.coneSizeId) {
      await prisma.coneSize.update({
        where: { id: req.body.coneSizeId },
        data: { imageUrl: relPath },
      });
      return res.json({ url: relPath, coneSizeId: req.body.coneSizeId });
    }
    if (type === 'flavor' && req.body.flavorId) {
      await prisma.flavor.update({
        where: { id: req.body.flavorId },
        data: { imageUrl: relPath },
      });
      return res.json({ url: relPath, flavorId: req.body.flavorId });
    }
    if (type === 'topping' && req.body.toppingId) {
      await prisma.topping.update({
        where: { id: req.body.toppingId },
        data: { imageUrl: relPath },
      });
      return res.json({ url: relPath, toppingId: req.body.toppingId });
    }

    res.json({ url: relPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
