import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.products.list({ q, category, skip: Number(skip) || 0, take: Number(take) || 20 });
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.products.getBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.products.create(body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, join(process.cwd(), 'uploads')),
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.products.update(id, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }
}



