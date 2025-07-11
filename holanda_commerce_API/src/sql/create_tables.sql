CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    fabrication_date DATE,
    expiration_date DATE,
    stock INT NOT NULL,
    discount_percentage INT NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE products_in_wishlist (
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE products_in_shopping_cart (
    id VARCHAR(255) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    user_id VARCHAR(255) NOT NULL,
    transaction_type ENUM('purchase', 'sale') NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE products_on_categories (
    product_id VARCHAR(255) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);