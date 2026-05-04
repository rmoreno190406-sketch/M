// Persona Generator - Creates agent persona objects (no LLM, pure TypeScript)

export type Gender = 'male' | 'female' | 'non-binary';
export type Location = 'urban' | 'suburban' | 'rural';
export type IncomeTier = 'low' | 'mid' | 'high';
export type ShoppingFrequency = 'daily' | 'weekly' | 'monthly';
export type PriceSensitivity = 'high' | 'medium' | 'low';
export type FunnelStage = 'awareness' | 'consideration' | 'purchase_ready';
export type SocialBehavior = 'influencer' | 'reviewer' | 'lurker' | 'complainer';
export type BrandTrust = 'skeptic' | 'neutral' | 'fan';
export type Device = 'mobile' | 'desktop';

export interface AgentPersona {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  location: Location;
  city: string;
  incomeTier: IncomeTier;
  shoppingFrequency: ShoppingFrequency;
  priceSensitivity: PriceSensitivity;
  funnelStage: FunnelStage;
  socialBehavior: SocialBehavior;
  brandTrust: BrandTrust;
  device: Device;
  isActive: boolean; // Whether this agent will use LLM (top ~15%)
}

const SPANISH_NAMES_FEMALE = [
  'María', 'Carmen', 'Ana', 'Laura', 'Marta', 'Isabel', 'Sofía', 'Lucía',
  'Elena', 'Nuria', 'Sandra', 'Patricia', 'Raquel', 'Cristina', 'Sara',
  'Beatriz', 'Alicia', 'Paula', 'Irene', 'Rosa', 'Pilar', 'Esther', 'Natalia'
];

const SPANISH_NAMES_MALE = [
  'Carlos', 'Juan', 'Miguel', 'Pedro', 'Antonio', 'David', 'José', 'Javier',
  'Alejandro', 'Fernando', 'Sergio', 'Rubén', 'Pablo', 'Marcos', 'Adrián',
  'Jorge', 'Álvaro', 'Iván', 'Roberto', 'Manuel', 'Francisco', 'Diego', 'Óscar'
];

const SPANISH_CITIES = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga',
  'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba',
  'Valladolid', 'Vigo', 'Gijón', 'Granada', 'Pamplona', 'Vitoria',
  'A Coruña', 'Burgos', 'Salamanca', 'Santander', 'Albacete', 'Badajoz'
];

const RURAL_LOCATIONS = [
  'pueblo pequeño de Castilla', 'aldea de Galicia', 'zona rural de Extremadura',
  'municipio de La Rioja', 'pueblo de Aragón', 'villa de Andalucía'
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickRandom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function weightedPick<T>(options: T[], weights: number[], seed: number): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = seededRandom(seed) * totalWeight;
  for (let i = 0; i < options.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return options[i];
  }
  return options[options.length - 1];
}

export function generatePersonas(count: number, targetDemographics?: {
  ageMin?: number;
  ageMax?: number;
  incomeTier?: IncomeTier[];
}): AgentPersona[] {
  const personas: AgentPersona[] = [];
  const ageMin = targetDemographics?.ageMin ?? 18;
  const ageMax = targetDemographics?.ageMax ?? 65;

  for (let i = 0; i < count; i++) {
    const seed = i * 7919 + 12345;
    const gender: Gender = pickRandom(['male', 'female', 'non-binary'] as Gender[], seed + 1);
    const age = ageMin + Math.floor(seededRandom(seed + 2) * (ageMax - ageMin + 1));
    const location: Location = weightedPick(
      ['urban', 'suburban', 'rural'] as Location[],
      [50, 35, 15],
      seed + 3
    );

    let city: string;
    if (location === 'rural') {
      city = pickRandom(RURAL_LOCATIONS, seed + 4);
    } else {
      city = pickRandom(SPANISH_CITIES, seed + 4);
    }

    const incomeTier: IncomeTier = targetDemographics?.incomeTier
      ? pickRandom(targetDemographics.incomeTier, seed + 5)
      : weightedPick(['low', 'mid', 'high'] as IncomeTier[], [35, 45, 20], seed + 5);

    const shoppingFrequency: ShoppingFrequency = weightedPick(
      ['daily', 'weekly', 'monthly'] as ShoppingFrequency[],
      [10, 55, 35],
      seed + 6
    );

    const priceSensitivity: PriceSensitivity = incomeTier === 'low'
      ? weightedPick(['high', 'medium', 'low'] as PriceSensitivity[], [70, 25, 5], seed + 7)
      : incomeTier === 'high'
        ? weightedPick(['high', 'medium', 'low'] as PriceSensitivity[], [10, 40, 50], seed + 7)
        : weightedPick(['high', 'medium', 'low'] as PriceSensitivity[], [35, 45, 20], seed + 7);

    const funnelStage: FunnelStage = weightedPick(
      ['awareness', 'consideration', 'purchase_ready'] as FunnelStage[],
      [45, 35, 20],
      seed + 8
    );

    const socialBehavior: SocialBehavior = weightedPick(
      ['influencer', 'reviewer', 'lurker', 'complainer'] as SocialBehavior[],
      [10, 15, 60, 15],
      seed + 9
    );

    const brandTrust: BrandTrust = weightedPick(
      ['skeptic', 'neutral', 'fan'] as BrandTrust[],
      [25, 55, 20],
      seed + 10
    );

    const device: Device = age < 35
      ? weightedPick(['mobile', 'desktop'] as Device[], [80, 20], seed + 11)
      : age > 50
        ? weightedPick(['mobile', 'desktop'] as Device[], [45, 55], seed + 11)
        : weightedPick(['mobile', 'desktop'] as Device[], [65, 35], seed + 11);

    // Active agents: influencers and reviewers (roughly 15%)
    const isActive = socialBehavior === 'influencer' || socialBehavior === 'reviewer';

    let name: string;
    if (gender === 'female') {
      name = pickRandom(SPANISH_NAMES_FEMALE, seed + 12);
    } else if (gender === 'male') {
      name = pickRandom(SPANISH_NAMES_MALE, seed + 12);
    } else {
      name = seededRandom(seed + 12) > 0.5
        ? pickRandom(SPANISH_NAMES_FEMALE, seed + 13)
        : pickRandom(SPANISH_NAMES_MALE, seed + 13);
    }

    personas.push({
      id: `agent_${i.toString().padStart(4, '0')}`,
      name,
      age,
      gender,
      location,
      city,
      incomeTier,
      shoppingFrequency,
      priceSensitivity,
      funnelStage,
      socialBehavior,
      brandTrust,
      device,
      isActive,
    });
  }

  return personas;
}
