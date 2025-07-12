import fastify from 'fastify';
import mysql from 'mysql2/promise';

export function productsInWishlistRoutes(fastify: fastify.FastifyInstance, mysql: mysql.Connection) {
    // get
    fastify.get('/read/products_in_wishlist/:user_id', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { user_id } = req.params as { user_id: string };
        const [rows] = await mysql.execute('SELECT * FROM products_in_wishlist WHERE user_id = ?', [user_id]);
        res.send(rows);
    });

    // post
    fastify.post('/create/products_in_wishlist', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { product_id, user_id } = req.body as { product_id: string, user_id: string };
        const [rows] = await mysql.execute('INSERT INTO products_in_wishlist (product_id, user_id) VALUES (?, ?)', [product_id, user_id]);
        res.send(rows);
    });

    // delete
    fastify.delete('/delete/products_in_wishlist/:user_id/:product_id', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { user_id, product_id } = req.params as { user_id: string, product_id: string };
        console.log('API: Deleting from wishlist - user_id:', user_id, 'product_id:', product_id);
        
        try {
            const [rows] = await mysql.execute('DELETE FROM products_in_wishlist WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
            console.log('API: Delete result:', rows);
            res.send(rows);
        } catch (error) {
            console.error('API: Error deleting from wishlist:', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    });
}