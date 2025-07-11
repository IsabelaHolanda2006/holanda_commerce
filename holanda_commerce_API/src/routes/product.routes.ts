import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function productRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
  // get
  fastify.get('/read/products', async (_: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const [rows] = await mysql.execute('SELECT * FROM products');
    console.log('rows: ', rows);
    res.send(rows);
  });

  fastify.get('/read/products/name/:name', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { name } = req.params as { name: string };
    const [rows] = await mysql.execute('SELECT * FROM products WHERE name LIKE ?', [`%${name}%`]);
    res.send(rows);
  });

  fastify.get('/read/products/id/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const [rows] = await mysql.execute('SELECT * FROM products WHERE id = ?', [id]);
    res.send(rows);
  });

  // post
  fastify.post('/create/products', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { name, price, fabrication_date, expiration_date, stock, discount_percentage, description, image_url, category_id } = req.body as { name: string, price: number, fabrication_date: string, expiration_date: string, stock: number, discount_percentage: number, description: string, image_url: string, category_id: string };
    const [result] = await mysql.execute('INSERT INTO products (name, price, fabrication_date, expiration_date, stock, discount_percentage, description, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, price, fabrication_date, expiration_date, stock, discount_percentage, description, image_url, category_id]);
    res.send(result);
  });

  // put
  fastify.put('/update/products/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const { name, price, fabrication_date, expiration_date, stock, discount_percentage, description, image_url, category_id } = req.body as { name: string, price: number, fabrication_date: string, expiration_date: string, stock: number, discount_percentage: number, description: string, image_url: string, category_id: string };
    const [result] = await mysql.execute('UPDATE products SET name = ?, price = ?, fabrication_date = ?, expiration_date = ?, stock = ?, discount_percentage = ?, description = ?, image_url = ?, category_id = ? WHERE id = ?', [name, price, fabrication_date, expiration_date, stock, discount_percentage, description, image_url, category_id, id]);
    res.send(result);
  });

  // delete
  fastify.delete('/delete/products/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const [result] = await mysql.execute('DELETE FROM products WHERE id = ?', [id]);
    res.send(result);
  });
}