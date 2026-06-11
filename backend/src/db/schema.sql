-- ===========================
-- Sales Dashboard Schema v2
-- ===========================

DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('completed','pending','cancelled','refunded')),
  transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_txn_date ON transactions(transaction_date DESC);
CREATE INDEX idx_txn_category ON transactions(category);
CREATE INDEX idx_txn_region ON transactions(region);
CREATE INDEX idx_txn_status ON transactions(status);
CREATE INDEX idx_txn_customer ON transactions(customer_name);
CREATE INDEX idx_txn_amount ON transactions(amount);
CREATE INDEX idx_txn_date_cat ON transactions(transaction_date, category);
CREATE INDEX idx_txn_date_reg ON transactions(transaction_date, region);
CREATE INDEX idx_txn_search ON transactions USING gin(
  to_tsvector('english', customer_name || ' ' || product_name || ' ' || category || ' ' || region)
);
