import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function shoppingCartRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
  // get
  fastify.get('/read/shopping_cart/:user_id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { user_id } = req.params as { user_id: string };
    const [rows] = await mysql.execute('SELECT * FROM products_in_shopping_cart where user_id = ?', [user_id]);
    res.send(rows);
  });

  // post
  fastify.post('/create/shopping_cart', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { user_id, product_id, quantity } = req.body as { user_id: string, product_id: string, quantity: number };
    const [result] = await mysql.execute('INSERT INTO products_in_shopping_cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);
    res.send(result);
  });

  // put
  fastify.put('/update/shopping_cart/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const { user_id, product_id, quantity } = req.body as { user_id: string, product_id: string, quantity: number };
    const [result] = await mysql.execute('UPDATE products_in_shopping_cart SET user_id = ?, product_id = ?, quantity = ? WHERE id = ?', [user_id, product_id, quantity, id]);
    res.send(result);
  });

  // delete
  fastify.delete('/delete/shopping_cart/:user_id/:product_id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { user_id, product_id  } = req.params as {  user_id: string, product_id: string };
    const [result] = await mysql.execute('DELETE FROM products_in_shopping_cart WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
    res.send(result);
  });
}