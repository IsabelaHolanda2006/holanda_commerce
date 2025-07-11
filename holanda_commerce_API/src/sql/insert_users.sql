-- Inserir usuário de teste
-- Senha: 123456 (criptografada com bcrypt)
INSERT INTO users (id, name, email, password, role) VALUES 
('1', 'Test User', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'); 