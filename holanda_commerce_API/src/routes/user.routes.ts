import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function userRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
    // get
    fastify.get('/read/users', async (_: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const [rows] = await mysql.execute('SELECT * FROM users');
        res.send(rows);
    });

    // put
    fastify.put('/update/users/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const { id } = req.params as { id: string };
        const { name, email, password, role } = req.body as { name: string, email: string, password: string, role: string };
        const [result] = await mysql.execute('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [name, email, password, role, id]);
        res.send(result);
    });

    // delete
    fastify.delete('/delete/users/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const { id } = req.params as { id: string };
        const [result] = await mysql.execute('DELETE FROM users WHERE id = ?', [id]);
        res.send(result);
    });
}