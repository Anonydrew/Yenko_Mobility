import { BatteryIcon, BikeIcon, CheckIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

type Screen = 'map' | 'ride' | 'pass';

/** An illustrated phone showing the Yenko app (a light app UI, so it uses fixed colours). Decorative only. */
export default function PhoneMockup({ screen = 'map', className }: { screen?: Screen; className?: string }) {
  return (
    <div className={cx('relative w-[16.5rem] rounded-[3rem] bg-[#1B1F1F] p-2.5 shadow-panel ring-1 ring-white/15', className)} aria-hidden="true">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.5rem] bg-[#EEEEE8] text-onbrand">
        <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-onbrand" />
        <MapArt route={screen === 'ride'} />

        {screen === 'map' && (
          <>
            <Pin className="left-[22%] top-[24%]" />
            <Pin className="left-[62%] top-[34%]" />
            <Pin className="left-[40%] top-[55%]" active />
            <Pin className="left-[74%] top-[62%]" />
            <span className="absolute left-[46%] top-[44%] h-4 w-4 rounded-full bg-onbrand ring-4 ring-white" />
            <div className="absolute inset-x-3 bottom-3 rounded-[1.75rem] bg-white p-4 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.625rem] text-neutral-500">Nearest bike · 1 min walk</p>
                  <p className="mt-0.5 text-sm font-bold">Yenko E1 · #0427</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-[0.625rem] font-medium">
                  <BatteryIcon width={12} height={12} /> 87%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[0.625rem] text-neutral-500">
                <span>GH₵ 2 unlock</span>
                <span>GH₵ 0.50 / min</span>
              </div>
              <div className="mt-3 flex h-10 items-center justify-center rounded-full bg-brand text-sm font-bold">Scan to unlock</div>
            </div>
          </>
        )}

        {screen === 'ride' && (
          <>
            <span className="absolute left-[27%] top-[78%] h-4 w-4 rounded-full bg-onbrand ring-4 ring-white" />
            <Pin className="left-[70%] top-[17%]" active />
            <div className="absolute inset-x-3 top-11 rounded-[1.5rem] bg-onbrand p-4 text-white shadow-lg">
              <p className="text-[0.625rem] text-white/60">Ride in progress</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">06:42</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[0.625rem]">
                <div className="rounded-xl bg-white/10 p-2">
                  <p className="text-white/60">Distance</p>
                  <p className="text-sm font-bold">1.8 km</p>
                </div>
                <div className="rounded-xl bg-white/10 p-2">
                  <p className="text-white/60">Cost so far</p>
                  <p className="text-sm font-bold">GH₵ 5.40</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
              <div className="flex h-11 items-center justify-center rounded-full bg-white text-sm font-bold shadow">Pause</div>
              <div className="flex h-11 items-center justify-center rounded-full bg-brand text-sm font-bold shadow">End ride</div>
            </div>
          </>
        )}

        {screen === 'pass' && (
          <div className="absolute inset-0 z-10 bg-white px-4 pt-12">
            <p className="text-lg font-bold">Your passes</p>
            <div className="mt-4 rounded-[1.5rem] bg-brand p-4">
              <p className="text-[0.625rem] font-medium">Semester Pass</p>
              <p className="mt-1 text-2xl font-bold">Unlimited</p>
              <p className="text-[0.625rem]">45-minute rides · all campuses</p>
              <div className="mt-4 h-1.5 rounded-full bg-onbrand/15">
                <div className="h-1.5 w-2/3 rounded-full bg-onbrand" />
              </div>
              <p className="mt-2 text-[0.625rem]">68 days left</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-[1rem] bg-neutral-100 p-3">
                <p className="text-[0.625rem] text-neutral-500">Rides this month</p>
                <p className="text-xl font-bold">23</p>
              </div>
              <div className="rounded-[1rem] bg-neutral-100 p-3">
                <p className="text-[0.625rem] text-neutral-500">Saved vs taxi</p>
                <p className="text-xl font-bold">GH₵ 161</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-[0.6875rem]">
              {['Free helmet collected', 'Student email verified', 'Split payment: 2 of 2 paid'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-onbrand text-white">
                    <CheckIcon width={10} height={10} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Pin({ className, active = false }: { className: string; active?: boolean }) {
  return (
    <span
      className={cx(
        'absolute flex items-center justify-center rounded-full shadow ring-4 ring-white',
        active ? 'h-10 w-10 bg-onbrand text-brand' : 'h-8 w-8 bg-brand text-onbrand',
        className,
      )}
    >
      <BikeIcon width={active ? 18 : 15} height={active ? 18 : 15} strokeWidth={2} />
    </span>
  );
}

function MapArt({ route }: { route: boolean }) {
  return (
    <svg viewBox="0 0 270 585" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="270" height="585" fill="#EEEEE8" />
      <rect x="112" y="200" width="80" height="120" rx="16" fill="#DDE8C6" />
      <rect x="14" y="440" width="64" height="80" rx="14" fill="#DDE8C6" />
      <rect x="180" y="470" width="80" height="60" rx="14" fill="#E2E2DA" />
      <path d="M-20 140 C 80 120, 160 190, 290 160" stroke="#fff" strokeWidth="22" fill="none" />
      <path d="M62 -20 C 72 160, 40 320, 92 610" stroke="#fff" strokeWidth="18" fill="none" />
      <path d="M-20 400 C 90 380, 180 430, 290 390" stroke="#fff" strokeWidth="16" fill="none" />
      <path d="M205 -20 C 195 200, 232 380, 212 610" stroke="#fff" strokeWidth="14" fill="none" />
      <path d="M0 260 L 270 300" stroke="#fff" strokeWidth="8" fill="none" />
      {route && (
        <path
          d="M80 465 C 70 390, 58 300, 118 255 S 196 175, 198 118"
          stroke="#0B0B0C"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 10"
        />
      )}
    </svg>
  );
}
