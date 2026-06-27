import { Firm, Challenge, Review, Offer, Payout } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getFirms(): Promise<Firm[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/firms`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch firms');
    return res.json();
  } catch (error) {
    console.error('Error fetching firms:', error);
    return [];
  }
}

export async function getFirmBySlug(slug: string): Promise<Firm | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/firms/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching firm ${slug}:`, error);
    return null;
  }
}

export async function getChallenges(): Promise<Challenge[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/challenges`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch challenges');
    return res.json();
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getPayouts(): Promise<Payout[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/payouts`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch payouts');
    return res.json();
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return [];
  }
}

export async function getOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/offers`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}
