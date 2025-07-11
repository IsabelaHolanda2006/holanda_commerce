import Fastify from 'fastify';
import cors from '@fastify/cors';
import mySql from 'mysql2/promise';
import { categoryRoutes } from './routes/category.routes.ts';
import { productRoutes } from './routes/product.routes.ts';
import { transactionRoutes } from './routes/transaction.routes.ts';
import { userRoutes } from './routes/user.routes.ts';
import { shoppingCartRoutes } from './routes/shopping_cart.routes.ts';
import { productOnCategoryRoutes } from './routes/product_on_category.routes.ts';
import { authRoutes } from './routes/auth.routes.ts';
import { productsInWishlistRoutes } from './routes/products_in_wishlist.routes.ts';
import 'dotenv/config';

const connection = await mySql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});


const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

categoryRoutes(fastify, connection);
productRoutes(fastify, connection);
userRoutes(fastify, connection);
transactionRoutes(fastify, connection);
shoppingCartRoutes(fastify, connection);
productOnCategoryRoutes(fastify, connection);
authRoutes(fastify, connection);
productsInWishlistRoutes(fastify, connection);

fastify.listen({ port: 8000 }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  fastify.log.info('Server is running on port 8000');
});