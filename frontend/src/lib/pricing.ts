// Types and display helpers for the pricing configuration, which is edited in the admin panel
// and served by GET /api/pricing.

export type PriceUnit = '' | 'min' | 'hour' | 'km' | 'ride' | 'seat' | 'delivery' | 'day' | 'week' | 'month';

export type Price = {
  /** null means "no fixed price" and shows customLabel instead. */
  amount: number | null;
  customLabel: string;
  /** Text after the price, e.g. "/month" or "to unlock". */
  period: string;
  /** Usage included in the price, e.g. 45 min per ride or 5 km. */
  includedQuantity: number | null;
  includedUnit: PriceUnit;
  includedPer: string;
  /** Rate charged for usage beyond what's included, e.g. GH₵ 0.30 per min. */
  extraRate: number | null;
  extraUnit: PriceUnit;
  note: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  popular: boolean;
  ctaLabel: string;
  ctaLink: string;
  featuresTitle: string;
  features: string[];
  /** Keyed by billing option id, or "default" when the tab has no billing options. */
  prices: Record<string, Price>;
};

export type CompareValue = boolean | string;

export type PricingTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  footnote: string;
  billing: { id: string; label: string; badge: string }[];
  plans: PricingPlan[];
  compare: { title: string; rows: { label: string; values: CompareValue[] }[] }[];
};

export type AddOn = {
  label: string;
  amount: number | null;
  customLabel: string;
  unit: PriceUnit;
  note: string;
};

export type PricingConfig = {
  currency: string;
  tabs: PricingTab[];
  addOns: AddOn[];
  paymentMethods: string[];
};

const unitNames: Record<Exclude<PriceUnit, ''>, [singular: string, plural: string]> = {
  min: ['min', 'min'],
  hour: ['hour', 'hours'],
  km: ['km', 'km'],
  ride: ['ride', 'rides'],
  seat: ['seat', 'seats'],
  delivery: ['delivery', 'deliveries'],
  day: ['day', 'days'],
  week: ['week', 'weeks'],
  month: ['month', 'months'],
};

export const unitOptions: { value: PriceUnit; label: string }[] = [
  { value: '', label: 'None' },
  { value: 'min', label: 'Minutes' },
  { value: 'hour', label: 'Hours' },
  { value: 'km', label: 'Kilometres (km)' },
  { value: 'ride', label: 'Rides' },
  { value: 'seat', label: 'Seats' },
  { value: 'delivery', label: 'Deliveries' },
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
  { value: 'month', label: 'Months' },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoney(currency: string, amount: number): string {
  return `${currency} ${formatNumber(amount)}`;
}

function unitName(unit: PriceUnit, quantity: number): string {
  if (!unit) return '';
  const [singular, plural] = unitNames[unit];
  return quantity === 1 ? singular : plural;
}

/** The big number on a plan card, e.g. { amount: "GH₵ 25", period: "/day" }. */
export function headline(price: Price, currency: string): { amount: string; period: string } {
  if (price.amount === null) return { amount: price.customLabel || 'Custom', period: '' };
  return { amount: formatMoney(currency, price.amount), period: price.period };
}

/** "45 min per ride", or null when nothing is included. */
export function includedText(price: Price): string | null {
  if (!price.includedQuantity || !price.includedUnit) return null;
  const quantity = price.includedQuantity;
  return [formatNumber(quantity), unitName(price.includedUnit, quantity), price.includedPer].filter(Boolean).join(' ');
}

/** "GH₵ 0.30 per extra min", or null when there's no extra rate. */
export function extraText(price: Price, currency: string): string | null {
  if (price.extraRate === null || !price.extraUnit) return null;
  const extra = includedText(price) ? 'extra ' : '';
  return `${formatMoney(currency, price.extraRate)} per ${extra}${unitName(price.extraUnit, 1)}`;
}

/** One line describing included and extra usage, e.g. "Includes 45 min per ride, then GH₵ 0.30 per extra min". */
export function priceTerms(price: Price, currency: string): string {
  const included = includedText(price);
  const extra = extraText(price, currency);
  if (included && extra) return `Includes ${included}, then ${extra}`;
  if (included) return `Includes ${included}`;
  if (extra) return `Then ${extra}`;
  return '';
}

export function addOnPrice(addOn: AddOn, currency: string): string {
  if (addOn.amount === null) return addOn.customLabel || 'Custom';
  const unit = addOn.unit ? ` / ${unitName(addOn.unit, 1)}` : '';
  return `${formatMoney(currency, addOn.amount)}${unit}`;
}

/** The price keys every plan in a tab must have. */
export function priceKeys(tab: PricingTab): string[] {
  return tab.billing.length > 0 ? tab.billing.map((option) => option.id) : ['default'];
}

export function priceFor(plan: PricingPlan, tab: PricingTab, billingId: string | undefined): Price | undefined {
  const keys = priceKeys(tab);
  const key = billingId && keys.includes(billingId) ? billingId : keys[0];
  return plan.prices[key];
}
