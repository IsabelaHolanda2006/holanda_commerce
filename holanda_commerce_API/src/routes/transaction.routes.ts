import Fastify from 'fastify';
import mySql from 'mysql2/promise';

export function transactionRoutes(fastify: Fastify.FastifyInstance, mysql: mySql.Connection) {
    // get
    fastify.get('/read/transactions', async (_: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const [rows] = await mysql.execute('SELECT * FROM transactions');
        res.send(rows);
    });

    // post
    fastify.post('/create/transactions', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const { user_id, transaction_type, total_amount } = req.body as { user_id: string, transaction_type: string, total_amount: number };
        const [result] = await mysql.execute('INSERT INTO transactions (user_id, transaction_type, total_amount) VALUES (?, ?, ?)', [user_id, transaction_type, total_amount]);
        res.send(result);
    });

    // put
    fastify.put('/update/transactions/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const { id } = req.params as { id: string };
        const { user_id, transaction_type, total_amount } = req.body as { user_id: string, transaction_type: string, total_amount: number };
        const [result] = await mysql.execute('UPDATE transactions SET user_id = ?, transaction_type = ?, total_amount = ? WHERE id = ?', [user_id, transaction_type, total_amount, id]);
        res.send(result);
    });

    // delete
    fastify.delete('/delete/transactions/:id', async (req: Fastify.FastifyRequest, res: Fastify.FastifyReply) => {
        const { id } = req.params as { id: string };
        const [result] = await mysql.execute('DELETE FROM transactions WHERE id = ?', [id]);
        res.send(result);
    });
}