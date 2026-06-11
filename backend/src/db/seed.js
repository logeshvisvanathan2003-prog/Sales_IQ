const { pool } = require('./connection');
require('dotenv').config();

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive', 'Food & Beverages', 'Office Supplies'];
const regions = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest', 'Midwest'];
const statuses = ['completed', 'pending', 'cancelled', 'refunded'];
const statusWeights = [0.65, 0.20, 0.10, 0.05];

const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Barbara','David','Elizabeth','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Dorothy','Paul','Kimberly','Andrew','Emily','Kenneth','Donna','Joshua','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa','Timothy','Deborah','Ronald','Stephanie','Edward','Rebecca','Jason','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy','Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda','Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen','Benjamin','Samantha','Samuel','Katherine','Raymond','Christine','Gregory','Debra','Frank','Rachel','Alexander','Carolyn','Patrick','Janet'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Turner','Phillips','Evans','Collins','Parker','Edwards','Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez'];

const productsByCategory = {
  'Electronics': ['iPhone 15 Pro','Samsung Galaxy S24','MacBook Air M3','Dell XPS 15','Sony WH-1000XM5','iPad Pro','Apple Watch Series 9','LG OLED TV 65"','Bose QuietComfort 45','Nintendo Switch OLED','GoPro Hero 12','Kindle Paperwhite','AirPods Pro 2','Samsung QLED 55"','PlayStation 5'],
  'Clothing': ['Nike Air Max 270','Levi\'s 501 Jeans','Adidas Ultraboost 23','Ralph Lauren Polo Shirt','North Face Jacket','Zara Summer Dress','H&M Casual Hoodie','Under Armour Shorts','Calvin Klein T-Shirt','Tommy Hilfiger Chinos','Puma Training Shoes','Gucci Leather Belt','Ray-Ban Aviator','Columbia Rain Jacket','Vans Old Skool'],
  'Home & Garden': ['Dyson V15 Vacuum','Instant Pot Duo 7-in-1','Philips Air Fryer','KitchenAid Stand Mixer','Roomba i7+','Weber Genesis Grill','Nest Smart Thermostat','Ring Video Doorbell','iRobot Braava Jet','Cuisinart Coffee Maker','Lodge Cast Iron Pan','Vitamix Blender','Keurig K-Elite','Shark Navigator Vacuum','Breville Toaster Oven'],
  'Sports': ['Peloton Bike+','TRX Training System','Bowflex SelectTech 552','Garmin Forerunner 955','Wilson Pro Staff Tennis Racket','Callaway Golf Set','Hydro Flask 40oz','Fitbit Charge 6','NordicTrack Treadmill','Yeti Cooler 65Qt','Titleist Pro V1 Golf Balls','Coleman Camping Chair','Osprey Hiking Backpack','Black Diamond Carabiner Set','Celestron Telescope'],
  'Books': ['Atomic Habits','The Psychology of Money','Dune','Project Hail Mary','Sapiens','The 48 Laws of Power','Thinking Fast and Slow','Rich Dad Poor Dad','The Alchemist','1984','The Art of War','Zero to One','Deep Work','Ikigai','The 4-Hour Work Week'],
  'Toys': ['LEGO Technic Set','Barbie Dreamhouse','Hot Wheels Ultimate Garage','Nerf Elite 2.0','Play-Doh Kitchen Creations','Monopoly Classic','Uno Card Game','Jenga Giant','Exploding Kittens','Ticket to Ride','Catan Board Game','K\'Nex Building Set','Melissa & Doug Puzzle','Remote Control Car','Science Experiment Kit'],
  'Beauty': ['Dyson Airwrap','La Mer Moisturizer','Charlotte Tilbury Palette','SK-II Facial Treatment','Tatcha Rice Wash','NARS Radiant Concealer','Sunday Riley Good Genes','Drunk Elephant Vitamin C','Mario Badescu Spray','Fenty Beauty Pro Filt\'r','Olaplex No.3','GHD Platinum Styler','Estée Lauder Serum','Clinique Moisture Surge','Benefit Brow Kit'],
  'Automotive': ['Armor All Detailing Kit','Michelin Pilot Sport 4S','Thule Roof Rack','BlackVue Dash Cam','NOCO Boost Plus Jump Starter','Chemical Guys Shampoo','Garmin Drive 55 GPS','WeatherTech Floor Liners','Optima Red Top Battery','Hella 500FF Fog Lights','Meguiar\'s Compound Kit','K&N Air Filter','Mobil 1 Synthetic Oil','3M Paint Protection Film','AutoMeter Gauge Kit'],
  'Food & Beverages': ['Lavazza Super Crema Coffee','Ghirardelli Chocolate Set','Kirkland Organic Nuts','RXBAR Protein Bars','Green Tea Sampler','Bourbon Vanilla Extract','Organic Honey 32oz','Quest Nutrition Bars','Bulletproof Coffee Kit','Trader Joe\'s Gift Set','Primal Kitchen Mayo','Perfect Keto MCT Oil','Athletic Brewing Company Pack','Chosen Foods Avocado Oil','Vital Proteins Collagen'],
  'Office Supplies': ['Herman Miller Aeron Chair','Logitech MX Master 3S','Dell 27" Monitor','Moleskine Professional Notebook','Pilot G2 Pen Set','Sharpie Markers Set','Avery Labels Variety Pack','Staedtler Mechanical Pencils','Bostitch Heavy Duty Stapler','Fellowes Paper Shredder','Brother HL-L2350DW Printer','Quartet Whiteboard 48x36','AmazonBasics File Cabinet','3M Post-it Notes Bulk','Swingline Electric Stapler']
};

const priceRanges = {
  'Electronics': [99, 2499],
  'Clothing': [19, 399],
  'Home & Garden': [29, 899],
  'Sports': [29, 1999],
  'Books': [8, 45],
  'Toys': [9, 199],
  'Beauty': [19, 499],
  'Automotive': [19, 699],
  'Food & Beverages': [9, 149],
  'Office Supplies': [9, 1299]
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function weightedRandom(items, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return items[i];
  }
  return items[items.length - 1];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransactionId(index) {
  return `TXN-${String(index + 1).padStart(6, '0')}`;
}

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seed...');
    
    await client.query('BEGIN');
    
    // Create schema
    await client.query(`
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id VARCHAR(50) UNIQUE NOT NULL,
        customer_id UUID REFERENCES customers(id),
        customer_name VARCHAR(255) NOT NULL,
        product_id UUID REFERENCES products(id),
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled', 'refunded')),
        transaction_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
      CREATE INDEX IF NOT EXISTS idx_transactions_region ON transactions(region);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_transactions_customer_name ON transactions(customer_name);
      CREATE INDEX IF NOT EXISTS idx_transactions_amount ON transactions(amount);
    `);
    
    console.log('✅ Schema created');
    
    // Generate 500 unique customers
    const CUSTOMER_COUNT = 500;
    const customerIds = [];
    const customerNames = [];
    const emailSet = new Set();
    
    console.log(`👤 Generating ${CUSTOMER_COUNT} customers...`);
    
    for (let i = 0; i < CUSTOMER_COUNT; i++) {
      const firstName = firstNames[randomInt(0, firstNames.length - 1)];
      const lastName = lastNames[randomInt(0, lastNames.length - 1)];
      const name = `${firstName} ${lastName}`;
      let email;
      do {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@${['gmail.com','yahoo.com','outlook.com','hotmail.com','company.com'][randomInt(0,4)]}`;
      } while (emailSet.has(email));
      emailSet.add(email);
      
      const res = await client.query(
        'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id',
        [name, email]
      );
      customerIds.push(res.rows[0].id);
      customerNames.push(name);
    }
    
    console.log('✅ Customers created');
    
    // Generate products
    const productIds = {};
    const productData = {};
    
    console.log('📦 Generating products...');
    
    for (const category of categories) {
      productIds[category] = [];
      productData[category] = {};
      const prods = productsByCategory[category];
      const [minP, maxP] = priceRanges[category];
      
      for (const pName of prods) {
        const price = parseFloat(randomBetween(minP, maxP).toFixed(2));
        const res = await client.query(
          'INSERT INTO products (name, category, base_price) VALUES ($1, $2, $3) RETURNING id',
          [pName, category, price]
        );
        productIds[category].push(res.rows[0].id);
        productData[category][res.rows[0].id] = { name: pName, price };
      }
    }
    
    console.log('✅ Products created');
    
    // Generate 12,000 transactions in batches
    const TRANSACTION_COUNT = 12000;
    const BATCH_SIZE = 500;
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-12-31');
    
    console.log(`💳 Generating ${TRANSACTION_COUNT} transactions in batches of ${BATCH_SIZE}...`);
    
    let txnIndex = 0;
    
    while (txnIndex < TRANSACTION_COUNT) {
      const batchSize = Math.min(BATCH_SIZE, TRANSACTION_COUNT - txnIndex);
      const values = [];
      const placeholders = [];
      
      for (let i = 0; i < batchSize; i++) {
        const customerIndex = randomInt(0, customerIds.length - 1);
        const customerId = customerIds[customerIndex];
        const customerName = customerNames[customerIndex];
        const category = categories[randomInt(0, categories.length - 1)];
        const region = regions[randomInt(0, regions.length - 1)];
        const productCatIds = productIds[category];
        const productId = productCatIds[randomInt(0, productCatIds.length - 1)];
        const product = productData[category][productId];
        const priceVariation = 0.85 + Math.random() * 0.3;
        const amount = parseFloat((product.price * priceVariation).toFixed(2));
        const status = weightedRandom(statuses, statusWeights);
        const txnDate = randomDate(startDate, endDate);
        const txnId = generateTransactionId(txnIndex + i);
        
        const offset = i * 9;
        placeholders.push(`($${offset+1},$${offset+2},$${offset+3},$${offset+4},$${offset+5},$${offset+6},$${offset+7},$${offset+8},$${offset+9})`);
        values.push(txnId, customerId, customerName, productId, product.name, category, region, amount, status, txnDate);
        // Fix: push txnDate separately
        values[values.length - 1] = txnDate; // redundant but clear
      }

      // Rebuild properly
      const vals2 = [];
      const ph2 = [];
      for (let i = 0; i < batchSize; i++) {
        const customerIndex = randomInt(0, customerIds.length - 1);
        const customerId = customerIds[customerIndex];
        const customerName = customerNames[customerIndex];
        const category = categories[randomInt(0, categories.length - 1)];
        const region = regions[randomInt(0, regions.length - 1)];
        const productCatIds = productIds[category];
        const productId = productCatIds[randomInt(0, productCatIds.length - 1)];
        const product = productData[category][productId];
        const priceVariation = 0.85 + Math.random() * 0.3;
        const amount = parseFloat((product.price * priceVariation).toFixed(2));
        const status = weightedRandom(statuses, statusWeights);
        const txnDate = randomDate(startDate, endDate);
        const txnId = generateTransactionId(txnIndex + i);
        
        const offset = i * 10;
        ph2.push(`($${offset+1},$${offset+2},$${offset+3},$${offset+4},$${offset+5},$${offset+6},$${offset+7},$${offset+8},$${offset+9},$${offset+10})`);
        vals2.push(txnId, customerId, customerName, productId, product.name, category, region, amount, status, txnDate);
      }
      
      await client.query(
        `INSERT INTO transactions (transaction_id, customer_id, customer_name, product_id, product_name, category, region, amount, status, transaction_date) VALUES ${ph2.join(',')}`,
        vals2
      );
      
      txnIndex += batchSize;
      process.stdout.write(`\r  Progress: ${txnIndex}/${TRANSACTION_COUNT} transactions`);
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ All transactions created!');
    console.log('🎉 Database seeding complete!');
    
    // Summary
    const summary = await client.query('SELECT COUNT(*) FROM transactions');
    console.log(`📊 Total transactions: ${summary.rows[0].count}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
