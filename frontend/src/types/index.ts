export interface Firm {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
  founded_year: number | null;
  assets: string[];
  platforms: string[];
  max_allocation: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  rules?: FirmRule[];
  challenges?: Challenge[];
  offers?: Offer[];
}

export interface FirmRule {
  id: string;
  firm_id: string;
  category: string;
  value: string;
  is_allowed: boolean;
  description: string | null;
}

export interface Challenge {
  id: string;
  firm_id: string;
  name: string;
  account_size: number;
  challenge_type: string;
  fee: number;
  fee_currency: string;
  profit_target_pct: string;
  max_daily_loss_pct: number | null;
  max_total_loss_pct: number | null;
  profit_split_pct: number | null;
  scaling_plan: boolean;
  firm?: Firm;
}

export interface Review {
  id: string;
  firm_id: string;
  user_id: string;
  rating: number;
  content: string;
  status: string;
  created_at: string;
  user?: { name: string };
  firm?: { name: string; logo: string | null };
}

export interface Offer {
  id: string;
  firm_id: string;
  title: string;
  promo_code: string;
  discount_pct: number;
  is_active: boolean;
  expiry_date: string | null;
  firm?: Firm;
}

export interface Payout {
  id: string;
  firm_id: string;
  user_id: string;
  amount: number;
  currency: string;
  proof_url: string | null;
  status: string;
  payout_date: string;
  firm?: Firm;
}
