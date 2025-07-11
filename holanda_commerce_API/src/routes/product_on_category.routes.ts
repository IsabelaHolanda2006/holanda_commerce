import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function productOnCategoryRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
  fastify.get('/read/products/category/:category_id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { category_id } = req.params as { category_id: string };
    const [rows] = await mysql.execute('SELECT products.* FROM products JOIN products_on_categories product_on_category ON products.id = product_on_category.product_id WHERE product_on_category.category_id = ?', [category_id]);
    res.send(rows);
  });
}