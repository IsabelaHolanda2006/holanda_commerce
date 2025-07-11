CREATE TRIGGER update_product_stock_on_order_insert AFTER INSERT ON products_in_shopping_cart FOR EACH ROW
UPDATE products
SET stock = stock - NEW.quantity
WHERE id = NEW.id;

CREATE TRIGGER update_product_stock_on_order_update AFTER UPDATE ON products_in_shopping_cart FOR EACH ROW
UPDATE products
SET stock = stock + OLD.quantity - NEW.quantity
WHERE id = NEW.product_id;

CREATE TRIGGER update_product_stock_on_order_delete AFTER DELETE ON products_in_shopping_cart FOR EACH ROW
UPDATE products
SET stock = stock + OLD.quantity
WHERE id = OLD.product_id;

CREATE TRIGGER after_insert_product AFTER INSERT ON products FOR EACH ROW
BEGIN
    IF LENGTH(NEW.name) > FLOOR(RAND() * (15 - 8 + 1) + 8) THEN
        INSERT INTO products_on_categories (product_id, category_id) VALUES (NEW.id, 'trending');
    END IF;
END;

CREATE TRIGGER after_insert_product_sales AFTER INSERT ON products FOR EACH ROW
BEGIN
    IF NEW.discount_percentage > 0 THEN
        INSERT INTO products_on_categories (product_id, category_id) VALUES (NEW.id, 'sales');
    END IF;
END;

CREATE TRIGGER after_insert_product_category AFTER INSERT ON products FOR EACH ROW
INSERT INTO products_on_categories (product_id, category_id) VALUES (NEW.id, NEW.category_id);

SHOW TRIGGERS;

