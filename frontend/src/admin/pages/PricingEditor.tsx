import { useEffect, useRef, useState, type ReactNode } from 'react';
import Button from '@/components/ui/Button';
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, ExternalIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { cx } from '@/lib/cx';
import { formatDateTime } from '@/lib/format';
import {
  headline,
  priceKeys,
  priceTerms,
  unitOptions,
  type AddOn,
  type CompareValue,
  type Price,
  type PriceUnit,
  type PricingConfig,
  type PricingPlan,
  type PricingTab,
} from '@/lib/pricing';
import { slugify } from '@/lib/slugify';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { adminApi, type PricingMeta } from '../adminApi';
import { useAuth, useSessionGuard } from '../AuthContext';
import { AdminPageHeader, iconButton, Notice, Panel } from '../components/AdminUi';
import ConfirmDialog from '../components/ConfirmDialog';

const input =
  'h-9 w-full rounded-lg border border-line bg-surface-sunken px-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink';
const textarea =
  'w-full rounded-lg border border-line bg-surface-sunken px-2.5 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink';

type Confirm = { title: string; message: ReactNode; label: string; action: () => void | Promise<void> };
type Updater = (mutate: (draft: PricingConfig) => void) => void;

function emptyPrice(): Price {
  return { amount: 0, customLabel: '', period: '', includedQuantity: null, includedUnit: '', includedPer: '', extraRate: null, extraUnit: '', note: '' };
}

/** A slug that isn't in `taken`, e.g. "monthly", "monthly-2". */
function uniqueId(base: string, taken: string[], fallback: string): string {
  const root = slugify(base).slice(0, 36).replace(/-+$/, '') || fallback;
  let id = root;
  for (let n = 2; taken.includes(id); n++) id = `${root}-${n}`;
  return id;
}

function newPlan(tab: PricingTab): PricingPlan {
  return {
    id: uniqueId('new-plan', tab.plans.map((plan) => plan.id), 'plan'),
    name: 'New plan',
    description: '',
    popular: false,
    ctaLabel: 'Get started',
    ctaLink: '/download',
    featuresTitle: 'Includes',
    features: [],
    prices: Object.fromEntries(priceKeys(tab).map((key) => [key, emptyPrice()])),
  };
}

/** Removes blank lines so they don't count towards the limits on the server. */
function tidy(config: PricingConfig): PricingConfig {
  return {
    ...config,
    paymentMethods: config.paymentMethods.map((method) => method.trim()).filter(Boolean),
    tabs: config.tabs.map((tab) => ({
      ...tab,
      plans: tab.plans.map((plan) => ({ ...plan, features: plan.features.map((feature) => feature.trim()).filter(Boolean) })),
    })),
  };
}

export default function PricingEditor() {
  useDocumentTitle('Pricing · Admin');
  const { markSignedOut } = useAuth();
  const loaded = useAsync((signal) => adminApi.getPricing(signal), []);
  useSessionGuard(loaded.error);

  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [savedJson, setSavedJson] = useState('');
  const [meta, setMeta] = useState<PricingMeta | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string; details?: string[] } | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const accept = (response: { data: PricingConfig; meta: PricingMeta }) => {
    setConfig(response.data);
    setSavedJson(JSON.stringify(response.data));
    setMeta(response.meta);
  };

  useEffect(() => {
    if (loaded.status === 'success' && config === null) accept(loaded.data);
  }, [loaded.status, loaded.data, config]);

  const dirty = config !== null && JSON.stringify(config) !== savedJson;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update: Updater = (mutate) =>
    setConfig((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      mutate(next);
      return next;
    });

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      if (err.status === 401) return markSignedOut();
      setNotice({ tone: 'error', text: err.message, details: Object.values(err.fields) });
    } else {
      setNotice({ tone: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  const save = async () => {
    if (!config || saving) return;
    setSaving(true);
    setNotice(null);
    try {
      accept(await adminApi.savePricing(tidy(config)));
      setNotice({ tone: 'success', text: 'Pricing saved. The pricing page now shows these prices.' });
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const askReset = () =>
    setConfirm({
      title: 'Restore the default pricing?',
      message: 'Every tab, plan, price, add-on and comparison row will go back to the original defaults. Your current pricing will be lost.',
      label: 'Restore defaults',
      action: async () => {
        try {
          accept(await adminApi.resetPricing());
          setActiveTab(0);
          setNotice({ tone: 'success', text: 'Default pricing restored.' });
        } catch (err) {
          handleError(err);
        }
      },
    });

  const runConfirm = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    try {
      await confirm.action();
    } finally {
      setConfirmBusy(false);
      setConfirm(null);
    }
  };

  if (config === null) {
    return (
      <div>
        <AdminPageHeader title="Pricing" description="Edit the plans, prices and usage shown on the pricing page." />
        {loaded.status === 'error' ? (
          <Notice tone="error" className="mt-6">
            {loaded.error.message}{' '}
            <button type="button" onClick={loaded.reload} className="underline underline-offset-4">
              Try again
            </button>
          </Notice>
        ) : (
          <div className="flex justify-center py-24">
            <Spinner className="h-6 w-6" />
          </div>
        )}
      </div>
    );
  }

  const tabIndex = Math.min(activeTab, config.tabs.length - 1);
  const tab = config.tabs[tabIndex];

  return (
    <div>
      <AdminPageHeader
        title="Pricing"
        description="Edit the plans, prices and the minutes or kilometres included with each price."
        actions={
          <Button to="/pricing" target="_blank" rel="noreferrer" variant="secondary" size="sm">
            <ExternalIcon width={16} height={16} /> View pricing page
          </Button>
        }
      />

      <div className="sticky top-0 z-20 -mx-5 mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line bg-black/90 px-5 py-3 backdrop-blur lg:-mx-10 lg:px-10">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {dirty ? (
            <span className="font-medium text-brand">Unsaved changes</span>
          ) : meta?.isDefault ? (
            'Showing the default pricing'
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon width={15} height={15} />
              Saved{meta?.updatedAt ? ` · ${formatDateTime(meta.updatedAt)}` : ''}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={askReset} disabled={saving}>
            Restore defaults
          </Button>
          <Button variant="secondary" size="sm" onClick={() => accept({ data: JSON.parse(savedJson) as PricingConfig, meta: meta! })} disabled={!dirty || saving}>
            Discard changes
          </Button>
          <Button size="sm" onClick={() => void save()} disabled={!dirty || saving} title="Save (Ctrl+S)">
            {saving && <Spinner label="Saving" />}
            Save pricing
          </Button>
        </div>
      </div>

      {notice && (
        <Notice tone={notice.tone} onDismiss={() => setNotice(null)} className="mt-6">
          {notice.text}
          {notice.details && notice.details.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {notice.details.slice(0, 12).map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
              {notice.details.length > 12 && <li>…and {notice.details.length - 12} more</li>}
            </ul>
          )}
        </Notice>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel title="General">
          <Label text="Currency" hint="Shown before every price, e.g. GH₵">
            <input className={cx(input, 'max-w-[8rem]')} value={config.currency} maxLength={8} onChange={(e) => update((d) => void (d.currency = e.target.value))} />
          </Label>
        </Panel>
        <Panel title="How prices are shown">
          <p className="text-sm text-ink-muted">
            Each price has an amount, the usage it includes (for example <em>45 min per ride</em> or <em>5 km</em>) and a rate for extra usage. The
            comparison table’s Price, Included and Extra rows are built from these automatically.
          </p>
        </Panel>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Pricing tabs">
        {config.tabs.map((item, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === tabIndex}
            onClick={() => setActiveTab(index)}
            className={cx(
              'h-9 rounded-full px-4 text-sm font-medium transition-colors',
              index === tabIndex ? 'bg-white text-onbrand' : 'bg-surface-sunken text-ink-muted hover:text-ink',
            )}
          >
            {item.label || `Tab ${index + 1}`}
          </button>
        ))}
        {config.tabs.length < 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              update((d) => {
                const fresh: PricingTab = {
                  id: uniqueId('new-tab', d.tabs.map((t) => t.id), 'tab'),
                  label: 'New tab',
                  title: '',
                  description: '',
                  footnote: '',
                  billing: [],
                  plans: [],
                  compare: [],
                };
                fresh.plans.push(newPlan(fresh));
                d.tabs.push(fresh);
              });
              setActiveTab(config.tabs.length);
            }}
          >
            <PlusIcon width={16} height={16} /> Add tab
          </Button>
        )}
      </div>

      <TabEditor
        key={tabIndex}
        config={config}
        tab={tab}
        index={tabIndex}
        update={update}
        onMove={(to) => {
          update((d) => {
            const [moved] = d.tabs.splice(tabIndex, 1);
            d.tabs.splice(to, 0, moved);
          });
          setActiveTab(to);
        }}
        onDelete={() =>
          setConfirm({
            title: `Delete the “${tab.label}” tab?`,
            message: 'Its plans, prices and comparison table will be removed when you save.',
            label: 'Delete tab',
            action: () => {
              update((d) => void d.tabs.splice(tabIndex, 1));
              setActiveTab(Math.max(0, tabIndex - 1));
            },
          })
        }
        onDeletePlan={(planIndex) =>
          setConfirm({
            title: `Delete “${tab.plans[planIndex].name}”?`,
            message: 'The plan and its column in the comparison table will be removed when you save.',
            label: 'Delete plan',
            action: () =>
              update((d) => {
                const t = d.tabs[tabIndex];
                t.plans.splice(planIndex, 1);
                t.compare.forEach((group) => group.rows.forEach((row) => row.values.splice(planIndex, 1)));
              }),
          })
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <AddOnsEditor config={config} update={update} />
        <Panel title="Payment methods">
          <Label text="One per line" hint={`Shown under the add-ons. Up to 12.`}>
            <textarea
              className={textarea}
              rows={6}
              value={config.paymentMethods.join('\n')}
              onChange={(e) => update((d) => void (d.paymentMethods = e.target.value.split('\n')))}
            />
          </Label>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ''}
        message={confirm?.message}
        confirmLabel={confirm?.label}
        busy={confirmBusy}
        onConfirm={() => void runConfirm()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function TabEditor({
  config,
  tab,
  index,
  update,
  onMove,
  onDelete,
  onDeletePlan,
}: {
  config: PricingConfig;
  tab: PricingTab;
  index: number;
  update: Updater;
  onMove: (to: number) => void;
  onDelete: () => void;
  onDeletePlan: (planIndex: number) => void;
}) {
  const edit = (mutate: (draft: PricingTab) => void) => update((d) => mutate(d.tabs[index]));
  const keys = priceKeys(tab);

  const addBilling = () =>
    edit((t) => {
      const id = uniqueId(t.billing.length === 0 ? 'monthly' : 'new-option', t.billing.map((o) => o.id), 'option');
      const source = t.billing.length === 0 ? 'default' : t.billing[0].id;
      t.plans.forEach((plan) => {
        plan.prices[id] = structuredClone(plan.prices[source] ?? emptyPrice());
        if (source === 'default') delete plan.prices.default;
      });
      t.billing.push({ id, label: t.billing.length === 0 ? 'Monthly' : 'New option', badge: '' });
    });

  const removeBilling = (optionIndex: number) =>
    edit((t) => {
      const [removed] = t.billing.splice(optionIndex, 1);
      t.plans.forEach((plan) => {
        const price = plan.prices[removed.id];
        delete plan.prices[removed.id];
        if (t.billing.length === 0) plan.prices.default = price ?? emptyPrice();
      });
    });

  /** Keeps the billing option's ID in step with its label, and moves each plan's price along with it. */
  const syncBillingId = (optionIndex: number) =>
    edit((t) => {
      const option = t.billing[optionIndex];
      const others = t.billing.filter((_, i) => i !== optionIndex).map((o) => o.id);
      const id = uniqueId(option.label, others, 'option');
      if (id === option.id) return;
      t.plans.forEach((plan) => {
        plan.prices[id] = plan.prices[option.id] ?? emptyPrice();
        delete plan.prices[option.id];
      });
      option.id = id;
    });

  return (
    <div className="mt-4 space-y-6">
      <Panel
        title="Tab settings"
        actions={
          <div className="flex gap-1">
            <button type="button" className={iconButton} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Move tab left" title="Move left">
              <ChevronLeftIcon width={17} height={17} />
            </button>
            <button
              type="button"
              className={iconButton}
              onClick={() => onMove(index + 1)}
              disabled={index === config.tabs.length - 1}
              aria-label="Move tab right"
              title="Move right"
            >
              <ChevronRightIcon width={17} height={17} />
            </button>
            <button
              type="button"
              className={cx(iconButton, 'hover:text-red-400')}
              onClick={onDelete}
              disabled={config.tabs.length === 1}
              aria-label="Delete tab"
              title="Delete tab"
            >
              <TrashIcon width={17} height={17} />
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Label text="Tab label">
            <input className={input} value={tab.label} maxLength={40} onChange={(e) => edit((t) => void (t.label = e.target.value))} />
          </Label>
          <Label text="Tab ID" hint={`Used in the link: /pricing?tab=${tab.id || '…'}`}>
            <input
              className={cx(input, 'font-mono text-xs')}
              value={tab.id}
              maxLength={40}
              onChange={(e) => edit((t) => void (t.id = e.target.value.toLowerCase()))}
              onBlur={() =>
                update((d) => {
                  const others = d.tabs.filter((_, i) => i !== index).map((t) => t.id);
                  d.tabs[index].id = uniqueId(d.tabs[index].id || d.tabs[index].label, others, 'tab');
                })
              }
            />
          </Label>
          <Label text="Heading" optional>
            <input className={input} value={tab.title} maxLength={120} onChange={(e) => edit((t) => void (t.title = e.target.value))} />
          </Label>
          <Label text="Description" optional>
            <input className={input} value={tab.description} maxLength={240} onChange={(e) => edit((t) => void (t.description = e.target.value))} />
          </Label>
          <Label text="Footnote" optional className="md:col-span-2" hint="Small print under the plans, e.g. taxes or conditions.">
            <input className={input} value={tab.footnote} maxLength={300} onChange={(e) => edit((t) => void (t.footnote = e.target.value))} />
          </Label>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Billing options</h3>
              <p className="mt-0.5 text-xs text-ink-muted">
                {tab.billing.length === 0
                  ? 'No options: each plan has one price. Add options (e.g. Monthly and Yearly) to set a price for each.'
                  : 'Each plan has a separate price for every option.'}
              </p>
            </div>
            {tab.billing.length < 4 && (
              <Button variant="secondary" size="sm" onClick={addBilling}>
                <PlusIcon width={16} height={16} /> Add option
              </Button>
            )}
          </div>
          {tab.billing.length > 0 && (
            <div className="mt-4 space-y-2">
              {tab.billing.map((option, optionIndex) => (
                <div key={optionIndex} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-2">
                  <Label text="Label">
                    <input
                      className={input}
                      value={option.label}
                      maxLength={40}
                      onChange={(e) => edit((t) => void (t.billing[optionIndex].label = e.target.value))}
                      onBlur={() => syncBillingId(optionIndex)}
                    />
                  </Label>
                  <Label text="Badge" optional>
                    <input
                      className={input}
                      value={option.badge}
                      maxLength={30}
                      placeholder="e.g. Save 15%"
                      onChange={(e) => edit((t) => void (t.billing[optionIndex].badge = e.target.value))}
                    />
                  </Label>
                  <button
                    type="button"
                    className={cx(iconButton, 'hover:text-red-400')}
                    onClick={() => removeBilling(optionIndex)}
                    aria-label={`Remove ${option.label}`}
                    title="Remove option"
                  >
                    <TrashIcon width={17} height={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">Plans</h2>
        {tab.plans.length < 6 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              edit((t) => {
                t.plans.push(newPlan(t));
                t.compare.forEach((group) => group.rows.forEach((row) => row.values.push(false)));
              })
            }
          >
            <PlusIcon width={16} height={16} /> Add plan
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {tab.plans.map((plan, planIndex) => (
          <PlanEditor
            key={plan.id}
            plan={plan}
            tab={tab}
            keys={keys}
            currency={config.currency}
            index={planIndex}
            edit={(mutate) => edit((t) => mutate(t.plans[planIndex]))}
            onMove={(to) =>
              edit((t) => {
                const swap = <T,>(list: T[]) => ([list[planIndex], list[to]] = [list[to], list[planIndex]]);
                swap(t.plans);
                t.compare.forEach((group) => group.rows.forEach((row) => swap(row.values)));
              })
            }
            onDuplicate={
              tab.plans.length < 6
                ? () =>
                    edit((t) => {
                      const copy = structuredClone(t.plans[planIndex]);
                      copy.id = uniqueId(`${copy.id}-copy`, t.plans.map((p) => p.id), 'plan');
                      copy.name = `${copy.name} (copy)`.slice(0, 60);
                      copy.popular = false;
                      t.plans.splice(planIndex + 1, 0, copy);
                      t.compare.forEach((group) => group.rows.forEach((row) => row.values.splice(planIndex + 1, 0, row.values[planIndex] ?? false)));
                    })
                : undefined
            }
            onDelete={tab.plans.length > 1 ? () => onDeletePlan(planIndex) : undefined}
          />
        ))}
      </div>

      <CompareEditor tab={tab} edit={edit} />
    </div>
  );
}

function PlanEditor({
  plan,
  tab,
  keys,
  currency,
  index,
  edit,
  onMove,
  onDuplicate,
  onDelete,
}: {
  plan: PricingPlan;
  tab: PricingTab;
  keys: string[];
  currency: string;
  index: number;
  edit: (mutate: (draft: PricingPlan) => void) => void;
  onMove: (to: number) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const firstPrice = plan.prices[keys[0]];
  const summary = firstPrice ? headline(firstPrice, currency) : null;

  return (
    <section className="rounded-2xl border border-line bg-surface-muted">
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-2 text-left"
        >
          <ChevronDownIcon width={18} height={18} className={cx('shrink-0 text-ink-muted transition-transform', !open && '-rotate-90')} />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium">{plan.name || `Plan ${index + 1}`}</span>
              {plan.popular && <span className="rounded-full bg-brand px-2 py-0.5 text-[0.6875rem] font-medium text-onbrand">Most popular</span>}
            </span>
            {summary && (
              <span className="mt-0.5 block truncate text-sm text-ink-muted">
                {summary.amount}
                {summary.period && ` ${summary.period}`}
                {firstPrice && priceTerms(firstPrice, currency) && ` · ${priceTerms(firstPrice, currency)}`}
              </span>
            )}
          </span>
        </button>
        <div className="flex shrink-0">
          <button type="button" className={iconButton} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Move plan up" title="Move up">
            <ChevronDownIcon width={17} height={17} className="rotate-180" />
          </button>
          <button
            type="button"
            className={iconButton}
            onClick={() => onMove(index + 1)}
            disabled={index === tab.plans.length - 1}
            aria-label="Move plan down"
            title="Move down"
          >
            <ChevronDownIcon width={17} height={17} />
          </button>
          <button type="button" className={iconButton} onClick={onDuplicate} disabled={!onDuplicate} aria-label="Duplicate plan" title="Duplicate">
            <CopyIcon width={17} height={17} />
          </button>
          <button
            type="button"
            className={cx(iconButton, 'hover:text-red-400')}
            onClick={onDelete}
            disabled={!onDelete}
            aria-label="Delete plan"
            title={onDelete ? 'Delete' : 'A tab needs at least one plan'}
          >
            <TrashIcon width={17} height={17} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Label text="Plan name">
              <input className={input} value={plan.name} maxLength={60} onChange={(e) => edit((p) => void (p.name = e.target.value))} />
            </Label>
            <Label text="Short description" optional>
              <input className={input} value={plan.description} maxLength={200} onChange={(e) => edit((p) => void (p.description = e.target.value))} />
            </Label>
            <Label text="Button label">
              <input className={input} value={plan.ctaLabel} maxLength={40} onChange={(e) => edit((p) => void (p.ctaLabel = e.target.value))} />
            </Label>
            <Label text="Button link" hint="A page on this site (/download) or a full https:// address.">
              <input className={input} value={plan.ctaLink} maxLength={200} onChange={(e) => edit((p) => void (p.ctaLink = e.target.value))} />
            </Label>
            <label className="flex items-center gap-2.5 text-sm md:col-span-2">
              <input type="checkbox" className="h-4 w-4 accent-brand" checked={plan.popular} onChange={(e) => edit((p) => void (p.popular = e.target.checked))} />
              Highlight as “Most popular”
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {keys.map((key) => (
              <PriceFields
                key={key}
                title={key === 'default' ? 'Price' : `${tab.billing.find((option) => option.id === key)?.label ?? key} price`}
                price={plan.prices[key] ?? emptyPrice()}
                currency={currency}
                onChange={(mutate) =>
                  edit((p) => {
                    p.prices[key] ??= emptyPrice();
                    mutate(p.prices[key]);
                  })
                }
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
            <Label text="Features heading" optional>
              <input className={input} value={plan.featuresTitle} maxLength={80} onChange={(e) => edit((p) => void (p.featuresTitle = e.target.value))} />
            </Label>
            <Label text="Features" hint="One per line, up to 12.">
              <textarea
                className={textarea}
                rows={Math.max(4, plan.features.length + 1)}
                value={plan.features.join('\n')}
                onChange={(e) => edit((p) => void (p.features = e.target.value.split('\n')))}
              />
            </Label>
          </div>
        </div>
      )}
    </section>
  );
}

function PriceFields({ title, price, currency, onChange }: { title: string; price: Price; currency: string; onChange: (mutate: (draft: Price) => void) => void }) {
  const preview = headline(price, currency);
  const terms = priceTerms(price, currency);

  return (
    <fieldset className="rounded-xl border border-line bg-black/40 p-4">
      <legend className="px-1 text-sm font-medium">{title}</legend>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Label text={`Amount (${currency})`} hint="Leave empty for “Custom” pricing.">
          <NumberInput value={price.amount} onChange={(value) => onChange((p) => void (p.amount = value))} placeholder="Custom" />
        </Label>
        {price.amount === null ? (
          <Label text="Label instead of a price">
            <input className={input} value={price.customLabel} maxLength={30} placeholder="Custom" onChange={(e) => onChange((p) => void (p.customLabel = e.target.value))} />
          </Label>
        ) : (
          <Label text="Text after the price" optional>
            <input className={input} value={price.period} maxLength={30} placeholder="/month" onChange={(e) => onChange((p) => void (p.period = e.target.value))} />
          </Label>
        )}
        <Label text="Note" optional className="lg:col-span-2">
          <input className={input} value={price.note} maxLength={120} placeholder="e.g. Billed GH₵ 4,560 yearly" onChange={(e) => onChange((p) => void (p.note = e.target.value))} />
        </Label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Included usage</p>
          <div className="mt-2 grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] gap-2">
            <Label text="Quantity">
              <NumberInput value={price.includedQuantity} onChange={(value) => onChange((p) => void (p.includedQuantity = value))} placeholder="—" />
            </Label>
            <Label text="Unit">
              <UnitSelect value={price.includedUnit} onChange={(value) => onChange((p) => void (p.includedUnit = value))} />
            </Label>
            <Label text="Per" optional>
              <input className={input} value={price.includedPer} maxLength={30} placeholder="per ride" onChange={(e) => onChange((p) => void (p.includedPer = e.target.value))} />
            </Label>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Extra usage</p>
          <div className="mt-2 grid grid-cols-[8rem_minmax(0,1fr)] gap-2">
            <Label text={`Rate (${currency})`}>
              <NumberInput value={price.extraRate} onChange={(value) => onChange((p) => void (p.extraRate = value))} placeholder="—" />
            </Label>
            <Label text="Charged per">
              <UnitSelect value={price.extraUnit} onChange={(value) => onChange((p) => void (p.extraUnit = value))} />
            </Label>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-surface-sunken px-3 py-2 text-sm">
        <span className="text-ink-muted">Preview: </span>
        <span className="font-medium">{preview.amount}</span>
        {preview.period && <span className="text-ink-muted"> {preview.period}</span>}
        {terms && <span className="text-ink-soft"> · {terms}</span>}
        {price.note && <span className="text-ink-muted"> · {price.note}</span>}
      </p>
    </fieldset>
  );
}

function CompareEditor({ tab, edit }: { tab: PricingTab; edit: (mutate: (draft: PricingTab) => void) => void }) {
  return (
    <Panel
      title="Comparison table"
      actions={
        tab.compare.length < 12 && (
          <Button variant="secondary" size="sm" onClick={() => edit((t) => void t.compare.push({ title: 'New group', rows: [] }))}>
            <PlusIcon width={16} height={16} /> Add group
          </Button>
        )
      }
    >
      <p className="text-sm text-ink-muted">
        The <strong className="text-ink">Price</strong>, <strong className="text-ink">Included usage</strong> and <strong className="text-ink">Extra usage</strong> rows
        are added automatically from the plan prices. Add the rest of the features here.
      </p>

      <div className="mt-5 space-y-5">
        {tab.compare.map((group, groupIndex) => (
          <div key={groupIndex} className="rounded-xl border border-line">
            <div className="flex items-center gap-2 border-b border-line p-3">
              <input
                aria-label="Group title"
                className={cx(input, 'font-medium')}
                value={group.title}
                maxLength={60}
                onChange={(e) => edit((t) => void (t.compare[groupIndex].title = e.target.value))}
              />
              <button
                type="button"
                className={cx(iconButton, 'shrink-0 hover:text-red-400')}
                onClick={() => edit((t) => void t.compare.splice(groupIndex, 1))}
                aria-label={`Remove group ${group.title}`}
                title="Remove group"
              >
                <TrashIcon width={17} height={17} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="text-xs text-ink-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Feature
                    </th>
                    {tab.plans.map((plan) => (
                      <th key={plan.id} scope="col" className="px-2 py-2 font-medium">
                        {plan.name}
                      </th>
                    ))}
                    <th scope="col" className="w-10">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-line align-top">
                      <td className="min-w-[12rem] px-3 py-2">
                        <input
                          aria-label="Feature"
                          className={input}
                          value={row.label}
                          maxLength={80}
                          onChange={(e) => edit((t) => void (t.compare[groupIndex].rows[rowIndex].label = e.target.value))}
                        />
                      </td>
                      {tab.plans.map((plan, planIndex) => (
                        <td key={plan.id} className="min-w-[8.5rem] px-2 py-2">
                          <CompareCell
                            label={`${row.label || 'Row'} – ${plan.name}`}
                            value={row.values[planIndex] ?? false}
                            onChange={(value) => edit((t) => void (t.compare[groupIndex].rows[rowIndex].values[planIndex] = value))}
                          />
                        </td>
                      ))}
                      <td className="py-2 pr-2">
                        <button
                          type="button"
                          className={cx(iconButton, 'hover:text-red-400')}
                          onClick={() => edit((t) => void t.compare[groupIndex].rows.splice(rowIndex, 1))}
                          aria-label={`Remove row ${row.label}`}
                          title="Remove row"
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {group.rows.length < 30 && (
              <div className="border-t border-line p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => edit((t) => void t.compare[groupIndex].rows.push({ label: '', values: t.plans.map(() => true) }))}
                >
                  <PlusIcon width={16} height={16} /> Add row
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CompareCell({ label, value, onChange }: { label: string; value: CompareValue; onChange: (value: CompareValue) => void }) {
  const mode = value === true ? 'yes' : value === false ? 'no' : 'text';
  return (
    <div className="space-y-1.5">
      <select
        aria-label={label}
        className={input}
        value={mode}
        onChange={(e) => onChange(e.target.value === 'yes' ? true : e.target.value === 'no' ? false : '')}
      >
        <option value="yes">✓ Included</option>
        <option value="no">— Not included</option>
        <option value="text">Text…</option>
      </select>
      {typeof value === 'string' && (
        <input aria-label={`${label} text`} className={input} value={value} maxLength={60} placeholder="e.g. 45 min" onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function AddOnsEditor({ config, update }: { config: PricingConfig; update: Updater }) {
  const edit = (index: number, mutate: (draft: AddOn) => void) => update((d) => mutate(d.addOns[index]));
  return (
    <Panel
      title="Add-ons and extra fees"
      actions={
        config.addOns.length < 12 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => update((d) => void d.addOns.push({ label: '', amount: 0, customLabel: '', unit: '', note: '' }))}
          >
            <PlusIcon width={16} height={16} /> Add
          </Button>
        )
      }
    >
      {config.addOns.length === 0 ? (
        <p className="text-sm text-ink-muted">No add-ons. The section is hidden on the pricing page.</p>
      ) : (
        <div className="space-y-3">
          {config.addOns.map((addOn, index) => (
            <div key={index} className="rounded-xl border border-line p-3">
              <div className="grid grid-cols-[minmax(0,1fr)_6.5rem_minmax(0,8rem)_auto] items-end gap-2">
                <Label text="Name">
                  <input className={input} value={addOn.label} maxLength={60} onChange={(e) => edit(index, (a) => void (a.label = e.target.value))} />
                </Label>
                <Label text={currency(config)}>
                  <NumberInput value={addOn.amount} onChange={(value) => edit(index, (a) => void (a.amount = value))} placeholder="Custom" />
                </Label>
                <Label text="Per">
                  <UnitSelect value={addOn.unit} onChange={(value) => edit(index, (a) => void (a.unit = value))} />
                </Label>
                <button
                  type="button"
                  className={cx(iconButton, 'hover:text-red-400')}
                  onClick={() => update((d) => void d.addOns.splice(index, 1))}
                  aria-label={`Remove ${addOn.label || 'add-on'}`}
                  title="Remove"
                >
                  <TrashIcon width={17} height={17} />
                </button>
              </div>
              <input
                aria-label="Note"
                className={cx(input, 'mt-2')}
                value={addOn.note}
                maxLength={200}
                placeholder="Note (optional)"
                onChange={(e) => edit(index, (a) => void (a.note = e.target.value))}
              />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

const currency = (config: PricingConfig) => `Price (${config.currency})`;

/** A decimal input that allows an empty value (null) and keeps partly typed text such as "0." while editing. */
function NumberInput({ value, onChange, placeholder }: { value: number | null; onChange: (value: number | null) => void; placeholder?: string }) {
  const [text, setText] = useState(value === null ? '' : String(value));

  useEffect(() => {
    const parsed = text.trim() === '' ? null : Number(text);
    if (parsed !== value) setText(value === null ? '' : String(value));
    // Only react to changes from outside (undo, reset, discard).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      className={input}
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const next = e.target.value.replace(',', '.');
        if (!/^\d*\.?\d{0,2}$/.test(next)) return;
        setText(next);
        onChange(next === '' || next === '.' ? null : Number(next));
      }}
    />
  );
}

function UnitSelect({ value, onChange }: { value: PriceUnit; onChange: (value: PriceUnit) => void }) {
  return (
    <select className={input} value={value} onChange={(e) => onChange(e.target.value as PriceUnit)}>
      {unitOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Label({ text, hint, optional, className, children }: { text: string; hint?: string; optional?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={cx('block min-w-0', className)}>
      <span className="mb-1 block text-xs font-medium text-ink-soft">
        {text}
        {optional && <span className="font-normal text-ink-subtle"> (optional)</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-subtle">{hint}</span>}
    </label>
  );
}
