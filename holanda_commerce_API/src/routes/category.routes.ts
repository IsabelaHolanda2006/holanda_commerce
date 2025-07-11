import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function categoryRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
  // get
  fastify.get('/read/categories', async (_: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const [rows] = await mysql.execute('SELECT * FROM categories');
    console.log('rows: ', rows);
    res.send(rows);
  });

  // post
  fastify.post('/create/categories', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { name } = req.body as { name: string };
    const [result] = await mysql.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    console.log('result: ', result);
    res.send(result);
  });

  // put
  fastify.put('/update/categories/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const { name } = req.body as { name: string };
    const [result] = await mysql.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    res.send(result);
  });

  // delete
  fastify.delete('/delete/categories/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
    const { id } = req.params as { id: string };
    const [result] = await mysql.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.send(result);
  });
}