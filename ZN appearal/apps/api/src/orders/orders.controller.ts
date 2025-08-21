import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

class CreateOrderDto {
  userId!: string;
  items!: Array<{ productId: string; quantity: number }>;
  shipping?: Record<string, unknown>;
}

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.orders.create(body);
  }
}



