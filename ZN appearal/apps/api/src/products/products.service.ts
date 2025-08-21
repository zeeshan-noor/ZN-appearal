import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { q?: string; category?: string; skip?: number; take?: number }) {
    const { q, category, skip = 0, take = 20 } = params;
    return this.prisma.product.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q } },
                  { description: { contains: q } },
                ],
              }
            : {},
          category ? { category: { slug: category } } : {},
        ],
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  getBySlug(slug: string) {
    return this.prisma.product.findUnique({ where: { slug }, include: { category: true } });
  }

  create(data: any) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? '',
      price: Number(data.price) || 0,
      imageUrl: data.imageUrl ?? null,
      inStock: data.inStock ?? true,
      quantity: Number(data.quantity) || 0,
      specs: data.specs ? JSON.stringify(data.specs) : null,
      categoryId: data.categoryId,
    } as const;
    return this.prisma.product.create({ data: payload });
  }

  update(id: string, data: any) {
    console.log('Update data received:', data); // Debug log
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.description !== undefined) payload.description = data.description;
    if (data.price !== undefined) payload.price = Number(data.price) || 0;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.inStock !== undefined) payload.inStock = !!data.inStock;
    if (data.quantity !== undefined) payload.quantity = Number(data.quantity) || 0;
    if (data.specs !== undefined) payload.specs = data.specs ? JSON.stringify(data.specs) : null;
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
    console.log('Update payload:', payload); // Debug log
    return this.prisma.product.update({ where: { id }, data: payload });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}



