import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@znapparel.com';
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Ensure categories exist via upsert
  const categories = [
    { name: 'Knitwear Line', slug: 'knitwear' },
    { name: 'Casual & Jeans', slug: 'casual-jeans' },
    { name: 'Denim Cutting', slug: 'denim-cutting' },
    { name: 'Plotters & CAD', slug: 'plotters-cad' },
    { name: 'Shrinking & Forming', slug: 'shrinking-forming' },
    { name: 'Hemming & Finishing', slug: 'hemming-finishing' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name },
    });
  }

  // Products across categories
  const productData = [
    {
      name: 'High-Speed Overlock Machine',
      slug: 'high-speed-overlock-machine',
      description:
        'Industrial-grade overlock machine designed for knitwear with precision and durability.',
      price: 250000,
      imageUrl:
        'https://images.unsplash.com/photo-1582738412178-2f2b7366b9d7?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'knitwear',
      specs: { voltage: '220V', speed: '6500 spm' },
    },
    {
      name: 'Flatlock Seam Machine',
      slug: 'flatlock-seam-machine',
      description: 'Professional flatlock machine ideal for sportswear and stretch fabrics.',
      price: 320000,
      imageUrl:
        'https://images.unsplash.com/photo-1582738412058-93d6cb0de9f0?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'knitwear',
      specs: { voltage: '220V', speed: '5500 spm' },
    },
    {
      name: 'Denim Laser Cutter',
      slug: 'denim-laser-cutter',
      description: 'High-precision laser cutting system optimized for denim applications.',
      price: 850000,
      imageUrl:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'denim-cutting',
      specs: { bed: '1600mm', laser: 'CO2 150W' },
    },
    {
      name: 'Automatic Spreader',
      slug: 'automatic-spreader',
      description: 'Automated fabric spreading system for high throughput cutting rooms.',
      price: 590000,
      imageUrl:
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'denim-cutting',
      specs: { width: '1800mm', speed: '100 m/min' },
    },
    {
      name: 'High-Speed Plotter',
      slug: 'high-speed-plotter',
      description: 'Network high-speed plotter for CAD markers and patterns.',
      price: 420000,
      imageUrl:
        'https://images.unsplash.com/photo-1557754897-ca12c5049d8c?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'plotters-cad',
      specs: { dpi: '1200', width: '1830mm' },
    },
    {
      name: 'Fabric Shrinking Machine',
      slug: 'fabric-shrinking-machine',
      description: 'Continuous shrinking and forming machine for stable finishing.',
      price: 760000,
      imageUrl:
        'https://images.unsplash.com/photo-1568598035424-cd19a1b0a493?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'shrinking-forming',
      specs: { temp: '180°C', width: '2000mm' },
    },
    {
      name: 'Bottom Hemming Machine',
      slug: 'bottom-hemming-machine',
      description: 'Automatic bottom hemming with precise folding and consistent seams.',
      price: 280000,
      imageUrl:
        'https://images.unsplash.com/photo-1519710884002-9be21c6f5cf8?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'hemming-finishing',
      specs: { speed: '5000 spm', stitch: 'Chain' },
    },
    {
      name: '5-Thread Overlock',
      slug: 'five-thread-overlock',
      description: 'Durable 5-thread overlock for heavy-duty garments and workwear.',
      price: 300000,
      imageUrl:
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'casual-jeans',
      specs: { speed: '6000 spm', needle: 'DPx5' },
    },
    {
      name: 'Button Attaching Machine',
      slug: 'button-attaching-machine',
      description: 'Automatic button attach with programmable patterns.',
      price: 260000,
      imageUrl:
        'https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=1200&auto=format&fit=crop',
      categorySlug: 'casual-jeans',
      specs: { patterns: 50, speed: '1800 spm' },
    },
  ];

  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        specs: JSON.stringify(p.specs),
        category: { connect: { slug: p.categorySlug } },
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        specs: JSON.stringify(p.specs),
        category: { connect: { slug: p.categorySlug } },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });



