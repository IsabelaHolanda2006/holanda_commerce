import fastify from 'fastify';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authRoutes(fastify: fastify.FastifyInstance, mysql: mysql.Connection) {
    fastify.post('/auth/login', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { email, password } = req.body as { email: string, password: string};

        if (!email || !password) {
            return sendError(res, 'Invalid information');
        }

        try {
            const [existingUsers] = await mysql.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];
            const user = existingUsers[0];

            if (!user) {
                return sendError(res, 'Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return sendError(res, 'Invalid credentials');
            }

            const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET!, { expiresIn: '7d' });
            res.send({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            console.error('Login error:', error);
            return sendError(res, 'Internal server error', 500);
        }
    });

    fastify.post('/auth/register', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { name, email, password } = req.body as { name: string, email: string, password: string };

        if (!name || !email || !password) {
            return sendError(res, 'Invalid information');
        }

        try {
            const [existingUsers] = await mysql.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];
            const user = existingUsers[0];

            if (user) {
                return sendError(res, 'User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await mysql.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'user']);
            res.send({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Register error:', error);
            return sendError(res, 'Internal server error', 500);
        }
    });

    fastify.post('/auth/update-password', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const { email, newPassword } = req.body as { email: string, newPassword: string };

        if (!email || !newPassword) {
            return sendError(res, 'Invalid information');
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            const [result] = await mysql.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, email]
            ) as [any, any];

            if (result.affectedRows > 0) {
                res.send({ message: 'Password updated successfully' });
            } else {
                return sendError(res, 'User not found');
            }
        } catch (error) {
            console.error('Update password error:', error);
            return sendError(res, 'Internal server error', 500);
        }
    });

    fastify.get('/auth/me', async (req: fastify.FastifyRequest, res: fastify.FastifyReply) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 'Unauthorized');
        }
        
        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as { id: string, name: string, email: string, role: string };

            const [users] = await mysql.execute('SELECT * FROM users WHERE id = ?', [decoded.id]) as [any[], any];
            const user = users[0];

            if (!user) {
                return sendError(res, 'User not found');
            }

            res.send({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            });
        } catch (error) {
            console.error('Auth me error:', error);
            return sendError(res, 'Invalid token');
        }
    });
}

function sendError(res: fastify.FastifyReply, error: string, status: number = 401) {
    return res.status(status).send({ error: error });
}