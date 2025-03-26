import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: adminPassword,
      virtual_capital: 1000000.00, // $1M for admin
    },
  });
  console.log('Admin user created:', admin.username);

  // Create test user
  const testPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password_hash: testPassword,
      virtual_capital: 100000.00, // $100k for test user
    },
  });
  console.log('Test user created:', testUser.username);

  // Sample tech stocks with AI exposure
  const stocks = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      industry: 'Semiconductors',
      market_cap: BigInt(2500000000000), // $2.5T
      description: 'NVIDIA Corporation designs and manufactures computer graphics processors, chipsets, and related multimedia software. The Company\'s products are used in the gaming, professional visualization, datacenter, and automotive markets.',
      ai_impact_score: 9.8,
      ai_score_rationale: 'NVIDIA is a leader in AI hardware with its GPUs being the primary choice for training and running AI models. The company has seen massive growth due to AI adoption.',
      last_price: 950.25,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      market_cap: BigInt(3100000000000), // $3.1T
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.',
      ai_impact_score: 8.9,
      ai_score_rationale: 'Microsoft has heavily invested in OpenAI and is integrating AI across its product suite. Azure AI services and Copilot are driving new revenue streams.',
      last_price: 415.50,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      industry: 'Internet Content & Information',
      market_cap: BigInt(2000000000000), // $2T
      description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
      ai_impact_score: 8.5,
      ai_score_rationale: 'Google has been an AI pioneer with DeepMind and is now focusing on Gemini models. Search, YouTube, and cloud services all benefit from AI integration.',
      last_price: 175.25,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      sector: 'Technology',
      industry: 'Internet Content & Information',
      market_cap: BigInt(1200000000000), // $1.2T
      description: 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
      ai_impact_score: 7.8,
      ai_score_rationale: 'Meta has invested heavily in AI for content moderation, recommendation systems, and advertising. Their AI research lab is also developing generative models.',
      last_price: 485.20,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices, Inc.',
      sector: 'Technology',
      industry: 'Semiconductors',
      market_cap: BigInt(280000000000), // $280B
      description: 'Advanced Micro Devices, Inc. operates as a semiconductor company worldwide. It operates in Computing and Graphics; and Enterprise, Embedded, and Semi-Custom segments.',
      ai_impact_score: 7.5,
      ai_score_rationale: 'AMD is competing in the AI chip market with MI300 accelerators. While not as dominant as NVIDIA, they are gaining market share in AI computing.',
      last_price: 172.80,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      market_cap: BigInt(2900000000000), // $2.9T
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories.',
      ai_impact_score: 6.2,
      ai_score_rationale: 'Apple is integrating AI features into iOS and macOS, with a focus on on-device processing. Their AI strategy is more privacy-focused than competitors.',
      last_price: 188.25,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      market_cap: BigInt(1800000000000), // $1.8T
      description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through three segments: North America, International, and Amazon Web Services (AWS).',
      ai_impact_score: 8.0,
      ai_score_rationale: 'Amazon leverages AI across e-commerce, AWS, and devices. AWS offers comprehensive AI/ML services, while their retail operations benefit from AI-driven recommendations.',
      last_price: 178.75,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      market_cap: BigInt(750000000000), // $750B
      description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
      ai_impact_score: 7.2,
      ai_score_rationale: 'Tesla is developing AI for autonomous driving with its FSD system. They are also building custom AI chips and training infrastructure for their vehicles.',
      last_price: 235.10,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'CRM',
      name: 'Salesforce, Inc.',
      sector: 'Technology',
      industry: 'Software—Application',
      market_cap: BigInt(280000000000), // $280B
      description: 'Salesforce, Inc. provides customer relationship management technology that brings companies and customers together worldwide. The company offers Service Cloud, a service that enables companies to deliver personalized customer service and support.',
      ai_impact_score: 6.8,
      ai_score_rationale: 'Salesforce has integrated AI across its CRM platform with Einstein. Their Data Cloud and AI features help businesses leverage customer data more effectively.',
      last_price: 285.75,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
    {
      symbol: 'ADBE',
      name: 'Adobe Inc.',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      market_cap: BigInt(240000000000), // $240B
      description: 'Adobe Inc. operates as a diversified software company worldwide. It operates through three segments: Digital Media, Digital Experience, and Publishing and Advertising.',
      ai_impact_score: 6.5,
      ai_score_rationale: 'Adobe has integrated generative AI into Creative Cloud with Firefly. Their content creation tools now leverage AI for enhanced productivity and creativity.',
      last_price: 525.30,
      last_price_update: new Date(),
      last_score_update: new Date(),
    },
  ];

  // Insert stocks
  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: stock,
      create: stock,
    });
    console.log(`Stock created: ${stock.symbol} (${stock.name})`);
  }

  // Create a sample news article for each stock
  for (const stock of stocks) {
    const newsArticle = await prisma.news.create({
      data: {
        stock_symbol: stock.symbol,
        headline: `${stock.name} Announces New AI Initiatives`,
        url: `https://example.com/news/${stock.symbol.toLowerCase()}-ai-initiatives`,
        source: 'Tech News Daily',
        publish_date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Random date within last week
        summary: `${stock.name} has announced new artificial intelligence initiatives that could significantly impact its business operations and market position.`,
        ai_keywords: 'artificial intelligence, machine learning, innovation',
      },
    });
    console.log(`News article created for ${stock.symbol}`);
  }

  // Create a watchlist for the test user
  const watchlist = await prisma.watchlist.create({
    data: {
      user_id: testUser.id,
      name: 'AI High Performers',
      items: {
        create: [
          { stock_symbol: 'NVDA' },
          { stock_symbol: 'MSFT' },
          { stock_symbol: 'GOOGL' },
          { stock_symbol: 'AMD' },
        ],
      },
    },
  });
  console.log(`Watchlist created for ${testUser.username}`);

  // Create some mock trades for the test user
  const trades = [
    {
      user_id: testUser.id,
      stock_symbol: 'NVDA',
      trade_type: 'BUY',
      shares: 10,
      trade_price: 900.50,
      total_cost: 9005.00,
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    {
      user_id: testUser.id,
      stock_symbol: 'MSFT',
      trade_type: 'BUY',
      shares: 15,
      trade_price: 400.25,
      total_cost: 6003.75,
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    },
    {
      user_id: testUser.id,
      stock_symbol: 'NVDA',
      trade_type: 'BUY',
      shares: 5,
      trade_price: 925.75,
      total_cost: 4628.75,
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      user_id: testUser.id,
      stock_symbol: 'MSFT',
      trade_type: 'SELL',
      shares: 5,
      trade_price: 415.50,
      total_cost: 2077.50,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ];

  for (const trade of trades) {
    await prisma.trade.create({
      data: trade,
    });
    console.log(`Trade created: ${trade.trade_type} ${trade.shares} shares of ${trade.stock_symbol}`);
  }

  // Update portfolio based on trades
  await prisma.portfolio.upsert({
    where: {
      user_id_stock_symbol: {
        user_id: testUser.id,
        stock_symbol: 'NVDA',
      },
    },
    update: {
      shares: 15,
      average_cost_basis: 908.92, // (900.50*10 + 925.75*5) / 15
    },
    create: {
      user_id: testUser.id,
      stock_symbol: 'NVDA',
      shares: 15,
      average_cost_basis: 908.92,
    },
  });

  await prisma.portfolio.upsert({
    where: {
      user_id_stock_symbol: {
        user_id: testUser.id,
        stock_symbol: 'MSFT',
      },
    },
    update: {
      shares: 10,
      average_cost_basis: 400.25,
    },
    create: {
      user_id: testUser.id,
      stock_symbol: 'MSFT',
      shares: 10,
      average_cost_basis: 400.25,
    },
  });

  console.log('Portfolio entries created for test user');

  // Create some alerts for the test user
  const alerts = [
    {
      user_id: testUser.id,
      stock_symbol: 'NVDA',
      alert_type: 'PRICE_ABOVE',
      threshold_value: 1000.00,
      is_active: true,
    },
    {
      user_id: testUser.id,
      stock_symbol: 'MSFT',
      alert_type: 'PRICE_BELOW',
      threshold_value: 380.00,
      is_active: true,
    },
    {
      user_id: testUser.id,
      stock_symbol: 'GOOGL',
      alert_type: 'SCORE_ABOVE',
      threshold_value: 9.0,
      is_active: true,
    },
  ];

  for (const alert of alerts) {
    await prisma.alert.create({
      data: alert,
    });
    console.log(`Alert created for ${alert.stock_symbol}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });