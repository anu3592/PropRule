import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@proprules.com' },
    update: {},
    create: {
      email: 'admin@proprules.com',
      password: passwordHash,
      name: 'Admin User',
      role: 'admin',
      points: 1000
    },
  });

  // Create Firms
  const ftmo = await prisma.firm.upsert({
    where: { slug: 'ftmo' },
    update: {},
    create: {
      name: 'FTMO',
      slug: 'ftmo',
      logo: 'https://cdn.iconscout.com/icon/free/png-256/free-ftmo-3628795-3030100.png', 
      country: 'Czech Republic',
      founded_year: 2015,
      assets: ['Forex', 'Commodities', 'Indices', 'Crypto', 'Bonds', 'Equities'],
      platforms: ['MT4', 'MT5', 'cTrader', 'DXtrade'],
      max_allocation: 400000,
      description: 'FTMO is one of the most established and reliable prop firms in the industry.',
      rating: 4.9,
      review_count: 1250,
      is_verified: true,
      rules: {
        create: {
          news_trading: true,
          ea_bots: true,
          overnight_holds: false,
          weekend_holds: false,
          consistency_rule: false,
          min_trading_days: 4
        }
      }
    },
  });

  const apex = await prisma.firm.upsert({
    where: { slug: 'apex-trader-funding' },
    update: {},
    create: {
      name: 'Apex Trader Funding',
      slug: 'apex-trader-funding',
      country: 'USA',
      founded_year: 2021,
      assets: ['Futures'],
      platforms: ['Tradovate', 'Rithmic', 'NinjaTrader'],
      max_allocation: 3000000,
      description: 'Apex Trader Funding offers futures funding with flexible rules.',
      rating: 4.8,
      review_count: 890,
      is_verified: true,
      rules: {
        create: {
          news_trading: true,
          ea_bots: true,
          weekend_holds: false,
          min_trading_days: 7
        }
      }
    },
  });

  // Create Challenges
  await prisma.challenge.createMany({
    data: [
      { firm_id: ftmo.id, type: '2-Step', account_size: 100000, steps: 2, profit_target: [10, 5], daily_loss: [5], max_loss: [10], profit_split: '80%', price: 540 },
      { firm_id: ftmo.id, type: '2-Step', account_size: 200000, steps: 2, profit_target: [10, 5], daily_loss: [5], max_loss: [10], profit_split: '80%', price: 1080 },
      { firm_id: apex.id, type: '1-Step', account_size: 50000, steps: 1, profit_target: [6], daily_loss: [0], max_loss: [5], profit_split: '90%', price: 167 },
    ]
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      { firm_id: ftmo.id, user_id: adminUser.id, trading_conditions: 5, customer_care: 5, user_friendliness: 5, payout_process: 5, overall_rating: 5, review_text: 'Excellent firm. Payouts are always on time.', experience_type: 'paid out', is_verified: true, status: 'approved' },
      { firm_id: apex.id, user_id: adminUser.id, trading_conditions: 4, customer_care: 4, user_friendliness: 4, payout_process: 5, overall_rating: 4.25, review_text: 'Great for futures, trailing drawdown can be tricky.', experience_type: 'funded', is_verified: true, status: 'approved' },
    ]
  });

  // Create Payouts
  await prisma.payout.createMany({
    data: [
      { firm_id: ftmo.id, trader_username: 'Trader123', amount: 15000, payout_date: new Date('2026-10-15'), method: 'Crypto', market_type: 'Forex' },
      { firm_id: apex.id, trader_username: 'FutureKing', amount: 8500, payout_date: new Date('2026-10-18'), method: 'Deel', market_type: 'Futures' },
    ]
  });

  // Create Offers
  await prisma.offer.createMany({
    data: [
      { firm_id: ftmo.id, promo_code: 'PROPRULES10', discount_percentage: 10, description: '10% Off All Challenges', is_active: true, expiry_date: new Date('2027-12-31') },
      { firm_id: apex.id, promo_code: 'SAVE80', discount_percentage: 80, description: '80% Off Flash Sale', is_active: true, expiry_date: new Date('2026-12-31') },
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
