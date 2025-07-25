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

const prefix = '/api';

const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: ['http://localhost:3000', 'https://holanda-commerce.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

fastify.register(async (fastify) => {
  categoryRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  productRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  userRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  transactionRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  shoppingCartRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  productOnCategoryRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  authRoutes(fastify, connection);
}, { prefix: prefix });

fastify.register(async (fastify) => {
  productsInWishlistRoutes(fastify, connection);
}, { prefix: prefix });

const host = '0.0.0.0';
const port = parseInt(process.env.PORT!) || 8000;

fastify.listen({ port, host }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  fastify.log.info(`Server is running on port ${port} and host ${host}`);
});