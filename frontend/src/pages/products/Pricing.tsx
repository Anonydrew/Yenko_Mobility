import { Fragment, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CtaBanner from '@/components/sections/CtaBanner';
import Accordion from '@/components/ui/Accordion';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import ErrorState from '@/components/ui/ErrorState';
import { CheckIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { pricingFaqs } from '@/content/pricing';
import { api } from '@/lib/api';
import { cx } from '@/lib/cx';
import {
  addOnPrice,
  type CompareValue,
  extraText,
  headline,
  includedText,
  priceFor,
  type PricingConfig,
  priceTerms,
} from '@/lib/pricing';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const columnClasses: Record<number, string> = { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-3' };

export default function Pricing() {
  useDocumentTitle('Pricing', 'Simple pricing for Yenko rides, delivery, rent-to-own e-bikes, corporate plans and franchising.');
  const pricing = useAsync((signal) => api<{ data: PricingConfig }>('/pricing', { signal }).then((response) => response.data), []);

  return (
    <>
      <section>
        <Container className="pb-10 pt-14 text-center sm:pt-20 lg:pt-24">
          <p className="text-sm font-medium text-ink-muted">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-display-xl font-bold">Simple pricing for every way you move.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">
            Ride, send, own or scale. Choose the plan that fits today, and change it whenever you need to.
          </p>
        </Container>
      </section>

      {pricing.status === 'loading' && !pricing.data && <PricingSkeleton />}
      {pricing.status === 'error' && !pricing.data && (
        <Container className="pb-16">
          <ErrorState message={pricing.error.message} onRetry={pricing.reload} />
        </Container>
      )}
      {pricing.data && <PricingContent config={pricing.data} />}

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Pricing questions." />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={pricingFaqs} defaultOpen={0} />
          </div>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface-muted p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Need something custom?</h2>
            <p className="mt-2 max-w-xl text-ink-muted">Large fleets, citywide delivery or a franchise in your region. Our team will build a plan around you.</p>
          </div>
          <Button to="/contact?topic=partnerships" variant="dark">
            Talk to sales <ArrowOutward />
          </Button>
        </div>
      </Section>

      <CtaBanner screen="pass" />
    </>
  );
}

function PricingContent({ config }: { config: PricingConfig }) {
  const [params, setParams] = useSearchParams();
  const [billingByTab, setBillingByTab] = useState<Record<string, string>>({});
  const tab = config.tabs.find((item) => item.id === params.get('tab')) ?? config.tabs[0];

  if (!tab) return null;

  // Default each tab to its last billing option (usually the one with the savings badge).
  const billing = tab.billing.length > 0 ? billingByTab[tab.id] ?? tab.billing[tab.billing.length - 1].id : undefined;
  const currency = config.currency;

  const selectTab = (id: string) => setParams(id === config.tabs[0].id ? {} : { tab: id }, { replace: true });

  // Rows generated from the plan prices, so the table always matches the cards.
  const prices = tab.plans.map((plan) => priceFor(plan, tab, billing));
  const autoRows: { label: string; values: CompareValue[] }[] = [
    {
      label: 'Price',
      values: prices.map((price) => {
        if (!price) return false;
        const { amount, period } = headline(price, currency);
        return period ? `${amount} ${period}` : amount;
      }),
    },
    { label: 'Included usage', values: prices.map((price) => (price && includedText(price)) || false) },
    { label: 'Extra usage', values: prices.map((price) => (price && extraText(price, currency)) || false) },
  ].filter((row) => row.label === 'Price' || row.values.some((value) => value !== false));
  const groups = [{ title: 'Pricing', rows: autoRows }, ...tab.compare];

  return (
    <>
      <Container className="pb-4 text-center">
        {config.tabs.length > 1 && (
          <div role="tablist" aria-label="Pricing categories" className="mx-auto inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-line bg-surface-muted p-1">
            {config.tabs.map((item) => {
              const active = item.id === tab.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`pricing-tab-${item.id}`}
                  aria-selected={active}
                  aria-controls="pricing-panel"
                  onClick={() => selectTab(item.id)}
                  className={cx('rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-6', active ? 'bg-white text-onbrand' : 'text-ink-muted hover:text-ink')}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex min-h-11 justify-center">
          {tab.billing.length > 0 && (
            <div role="radiogroup" aria-label="Billing period" className="inline-flex items-center gap-1 rounded-full border border-line p-1 text-sm">
              {tab.billing.map((option) => {
                const active = option.id === billing;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setBillingByTab((current) => ({ ...current, [tab.id]: option.id }))}
                    className={cx('inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors', active ? 'bg-surface-sunken text-ink' : 'text-ink-muted hover:text-ink')}
                  >
                    {option.label}
                    {option.badge && <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">{option.badge}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Container>

      <div id="pricing-panel" role="tabpanel" aria-labelledby={`pricing-tab-${tab.id}`}>
        <Container className="pt-6">
          {(tab.title || tab.description) && (
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-xl font-medium tracking-tight">{tab.title}</h2>
              <p className="text-sm text-ink-muted">{tab.description}</p>
            </div>
          )}

          <div className={cx('grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2', columnClasses[tab.plans.length])}>
            {tab.plans.map((plan, index) => {
              const price = prices[index];
              const top = price ? headline(price, currency) : { amount: '—', period: '' };
              const terms = price ? priceTerms(price, currency) : '';
              return (
                <div key={plan.id} className={cx('flex flex-col p-6 sm:p-8', plan.popular ? 'bg-surface-muted' : 'bg-black')}>
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-tight">{plan.name}</h3>
                    {plan.popular && <span className="whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-onbrand">Most popular</span>}
                  </div>
                  <p className="mt-2 min-h-[2.5rem] text-sm text-ink-muted">{plan.description}</p>

                  <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-4xl font-bold tracking-tight">{top.amount}</span>
                    {top.period && <span className="text-sm text-ink-muted">{top.period}</span>}
                  </p>
                  <div className="mt-1 min-h-10 text-xs text-ink-muted">
                    {terms && <p>{terms}</p>}
                    {price?.note && <p>{price.note}</p>}
                  </div>

                  <Button to={plan.ctaLink} variant={plan.popular ? 'primary' : 'secondary'} className="mt-4 w-full">
                    {plan.ctaLabel}
                  </Button>

                  {plan.features.length > 0 && (
                    <div className="mt-8 border-t border-line pt-6">
                      {plan.featuresTitle && <p className="text-sm font-medium">{plan.featuresTitle}</p>}
                      <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex gap-3">
                            <CheckIcon width={16} height={16} strokeWidth={2.25} className="mt-0.5 shrink-0 text-brand" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {tab.footnote ? `${tab.footnote} ` : ''}All prices are in {currency}.
          </p>
        </Container>

        <Section>
          <SectionHeading eyebrow="Compare plans" title={`Compare ${tab.label.toLowerCase()} plans`} />
          <div className="mt-10 overflow-x-auto lg:overflow-visible">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <thead className="z-10 bg-black lg:sticky lg:top-16">
                <tr>
                  <th scope="col" className="w-1/4 py-5 pr-4 align-bottom font-normal text-ink-muted">
                    Features
                  </th>
                  {tab.plans.map((plan) => (
                    <th key={plan.id} scope="col" className="px-4 py-5 align-bottom text-base font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <Fragment key={group.title}>
                    <tr>
                      <th colSpan={tab.plans.length + 1} scope="colgroup" className="border-t border-line pb-3 pt-10 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                        {group.title}
                      </th>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-t border-line">
                        <th scope="row" className="py-4 pr-4 font-normal text-ink-soft">
                          {row.label}
                        </th>
                        {tab.plans.map((plan, index) => (
                          <td key={plan.id} className="px-4 py-4">
                            <CompareCell value={row.values[index] ?? false} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {(config.addOns.length > 0 || config.paymentMethods.length > 0) && (
        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <SectionHeading eyebrow="Add-ons and fees" title="Only pay for extras when you use them." />
          {config.addOns.length > 0 && (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {config.addOns.map((addOn) => (
                <li key={addOn.label} className="rounded-3xl border border-line bg-surface-muted p-6">
                  <p className="text-sm text-ink-muted">{addOn.label}</p>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{addOnPrice(addOn, currency)}</p>
                  {addOn.note && <p className="mt-3 text-sm text-ink-muted">{addOn.note}</p>}
                </li>
              ))}
            </ul>
          )}
          {config.paymentMethods.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm text-ink-muted">Pay with</span>
              {config.paymentMethods.map((method) => (
                <span key={method} className="rounded-full border border-line px-3 py-1.5 text-sm">
                  {method}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
}

function CompareCell({ value }: { value: CompareValue }) {
  if (value === true) {
    return (
      <>
        <CheckIcon width={18} height={18} strokeWidth={2.25} className="text-brand" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <span aria-hidden="true" className="text-ink-subtle">
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-ink">{value}</span>;
}

function PricingSkeleton() {
  return (
    <Container className="animate-pulse pb-16" aria-hidden="true">
      <div className="mx-auto h-11 w-80 max-w-full rounded-full bg-surface-muted" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-96 rounded-3xl bg-surface-muted" />
        ))}
      </div>
    </Container>
  );
}
