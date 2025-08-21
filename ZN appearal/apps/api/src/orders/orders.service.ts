import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    shipping?: Record<string, unknown>;
  }) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: order.items.map((i) => i.productId) } },
    });
    const items = order.items.map((i) => {
      const prod = products.find((p) => p.id === i.productId)!;
      return { productId: i.productId, quantity: i.quantity, unitPrice: prod.price };
    });
    const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    return this.prisma.order.create({
      data: {
        userId: order.userId,
        total,
        items: { create: items },
        shipping: order.shipping ? JSON.stringify(order.shipping) : undefined,
      },
      include: { items: true },
    });
  }
}



