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
    },
  });

  // Create Firms
  const ftmo = await prisma.firm.upsert({
    where: { slug: 'ftmo' },
    update: {},
    create: {
      name: 'FTMO',
      slug: 'ftmo',
      logo: 'Logo', 
      country: 'Czech Republic',
      founded_year: 2015,
      assets: ['Forex', 'Commodities', 'Indices', 'Crypto', 'Bonds', 'Equities'],
      platforms: ['MT4', 'MT5', 'cTrader', 'DXtrade'],
      max_allocation: 400000,
      description: 'FTMO is one of the most established and reliable prop firms in the industry.',
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
      description: 'Apex Trader Funding offers futures funding with flexible rules and multiple accounts.',
    },
  });

  const fundingPips = await prisma.firm.upsert({
    where: { slug: 'funding-pips' },
    update: {},
    create: {
      name: 'Funding Pips',
      slug: 'funding-pips',
      country: 'UAE',
      founded_year: 2022,
      assets: ['Forex', 'Crypto', 'Indices', 'Metals'],
      platforms: ['MT4', 'MT5'],
      max_allocation: 300000,
      description: 'Funding Pips is a newer firm known for fast payouts and tight spreads.',
    },
  });

  // Create Firm Rules
  await prisma.firmRule.createMany({
    skipDuplicates: true,
    data: [
      { firm_id: ftmo.id, category: 'news_trading', value: 'Allowed with restrictions', is_allowed: true, description: 'Not allowed 2 mins before/after on regular accounts, allowed on Swing accounts.' },
      { firm_id: ftmo.id, category: 'weekend_holding', value: 'Not Allowed', is_allowed: false, description: 'Only allowed on Swing accounts.' },
      { firm_id: ftmo.id, category: 'eas', value: 'Allowed', is_allowed: true, description: 'Must be your own code.' },
      
      { firm_id: apex.id, category: 'news_trading', value: 'Allowed', is_allowed: true, description: 'Trading during news is fully allowed.' },
      { firm_id: apex.id, category: 'weekend_holding', value: 'Not Allowed', is_allowed: false, description: 'All positions must be closed before the weekend.' },
    ],
  });

  // Create Challenges
  await prisma.challenge.createMany({
    skipDuplicates: true,
    data: [
      { firm_id: ftmo.id, name: '100k Evaluation', account_size: 100000, challenge_type: '2-Step', fee: 540, fee_currency: 'EUR', profit_target_pct: '10% / 5%', max_daily_loss_pct: 5, max_total_loss_pct: 10, profit_split_pct: 80, scaling_plan: true },
      { firm_id: ftmo.id, name: '200k Evaluation', account_size: 200000, challenge_type: '2-Step', fee: 1080, fee_currency: 'EUR', profit_target_pct: '10% / 5%', max_daily_loss_pct: 5, max_total_loss_pct: 10, profit_split_pct: 80, scaling_plan: true },
      { firm_id: apex.id, name: '50k Full', account_size: 50000, challenge_type: '1-Step', fee: 167, fee_currency: 'USD', profit_target_pct: '6%', max_daily_loss_pct: null, max_total_loss_pct: 5, profit_split_pct: 90, scaling_plan: false },
      { firm_id: fundingPips.id, name: '100k Evaluation', account_size: 100000, challenge_type: '2-Step', fee: 399, fee_currency: 'USD', profit_target_pct: '8% / 5%', max_daily_loss_pct: 5, max_total_loss_pct: 10, profit_split_pct: 80, scaling_plan: true },
    ]
  });

  // Create Reviews
  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      { firm_id: ftmo.id, user_id: adminUser.id, rating: 5, content: 'Excellent firm. Payouts are always on time.', status: 'approved' },
      { firm_id: apex.id, user_id: adminUser.id, rating: 4, content: 'Great for futures, but trailing drawdown can be tricky.', status: 'approved' },
      { firm_id: fundingPips.id, user_id: adminUser.id, rating: 5, content: 'Tight spreads and no nonsense rules.', status: 'approved' },
    ]
  });

  // Create Payouts
  await prisma.payout.createMany({
    skipDuplicates: true,
    data: [
      { firm_id: ftmo.id, user_id: adminUser.id, amount: 15000, currency: 'USD', proof_url: 'https://example.com/proof1', status: 'verified', payout_date: new Date('2026-10-15') },
      { firm_id: apex.id, user_id: adminUser.id, amount: 8500, currency: 'USD', proof_url: 'https://example.com/proof2', status: 'verified', payout_date: new Date('2026-10-18') },
      { firm_id: ftmo.id, user_id: adminUser.id, amount: 45000, currency: 'USD', status: 'verified', payout_date: new Date('2026-09-20') },
    ]
  });

  // Create Offers
  await prisma.offer.createMany({
    skipDuplicates: true,
    data: [
      { firm_id: ftmo.id, title: '10% Off All Challenges', promo_code: 'PROPRULES10', discount_pct: 10, is_active: true, expiry_date: new Date('2027-12-31') },
      { firm_id: apex.id, title: '80% Off Flash Sale', promo_code: 'SAVE80', discount_pct: 80, is_active: true, expiry_date: new Date('2026-12-31') },
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
