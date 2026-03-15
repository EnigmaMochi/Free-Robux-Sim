import React, { useMemo, useState } from "react";
import rewardBanner from "./assets/image.png";
import freeImage from "./assets/Free.png";
import warningImage from "./assets/warning.png";

const segments = [
  { label: "5 Robux", value: 5 },
  { label: "10 Robux", value: 10 },
  { label: "15 Robux", value: 15 },
  { label: "20 Robux", value: 20 },
  { label: "25 Robux", value: 25 },
  { label: "30 Robux", value: 30 },
  { label: "50 Robux", value: 50 },
  { label: "75 Robux", value: 75 },
];

const SEGMENT_ANGLE = 360 / segments.length;

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function Wheel({ rotation }) {
  return (
    <div className="relative h-80 w-[320px] sm:h-95 sm:w-95">
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <div className="h-0 w-0 border-l-16 border-r-16 border-t-28 border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
      </div>

      <svg
        viewBox="0 0 300 300"
        className="h-full w-full drop-shadow-2xl transition-transform duration-4200 ease-[cubic-bezier(0.15,0.9,0.2,1)]"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {segments.map((segment, i) => {
          const startAngle = i * SEGMENT_ANGLE;
          const endAngle = startAngle + SEGMENT_ANGLE;
          const midAngle = startAngle + SEGMENT_ANGLE / 2;
          const textPos = polarToCartesian(150, 150, 92, midAngle);

          return (
            <g key={segment.label}>
              <path
                d={describeArc(150, 150, 140, startAngle, endAngle)}
                fill={i % 2 === 0 ? "#60a5fa" : "#a78bfa"}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={textPos.x}
                y={textPos.y}
                fill="white"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle} ${textPos.x} ${textPos.y})`}
              >
                {segment.label}
              </text>
            </g>
          );
        })}
        <circle cx="150" cy="150" r="28" fill="white" />
        <circle cx="150" cy="150" r="12" fill="#111827" />
      </svg>
    </div>
  );
}

function PlaceholderBox({ title, subtitle }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 p-6 text-center text-slate-500">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow">
        🖼️
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{subtitle}</p>
    </div>
  );
}

export default function App() {
  const [spinCount, setSpinCount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [displayReward, setDisplayReward] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [history, setHistory] = useState([]);

  const outcomes = useMemo(
    () => [
      {
        index: 1,
        amount: 10,
      },
      {
        index: 7,
        amount: 75,
      },
    ],
    [],
  );

  const spinWheel = () => {
    if (spinCount >= 2) return;

    const nextSpin = spinCount + 1;
    const outcome = outcomes[spinCount];
    const targetIndex = outcome.index;

    const targetCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const finalAngle = 360 - targetCenter;
    const extraTurns = 360 * (4 + nextSpin);
    const nextRotation = rotation + extraTurns + finalAngle;

    setRotation(nextRotation);

    setTimeout(() => {
      setDisplayReward(outcome.amount);
      setHistory((prev) => [
        ...prev,
        {
          spin: nextSpin,
          reward: outcome.amount,
          note: outcome.note,
        },
      ]);
      setSpinCount(nextSpin);

      if (nextSpin === 2) {
        setShowPopup(true);
      }
    }, 4200);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              FREE ROBUX? SPIN TO WIN!
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Reward Wheel</h1>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="flex flex-col items-center gap-5">
              <Wheel rotation={rotation} />

              <button
                onClick={spinWheel}
                disabled={spinCount >= 2}
                className="rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {spinCount === 0
                  ? "Spin the Wheel"
                  : spinCount === 1
                    ? "Spin Again"
                    : "Simulation Complete"}
              </button>

              {displayReward !== null && (
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/15 px-5 py-4 text-center">
                  <p className="text-sm uppercase tracking-wide text-emerald-200">
                    Displayed Prize
                  </p>
                  <p className="text-3xl font-bold">{displayReward} Robux</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Congratulations! You won a reward.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <h2 className="mb-3 text-lg font-semibold">How it works</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                  <li>Spin 1 shows a small reward.</li>
                  <li>Spin 2 shows a larger reward.</li>
                  <li>Spin 3 shows the largest reward!</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <h2 className="mb-3 text-lg font-semibold">Reward Log</h2>
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Spin results will appear here.
                    </p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.spin}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <p className="font-medium">
                          Spin {item.spin}: {item.reward} Robux
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {item.note}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mt-4 space-y-4">
              <img
                src={rewardBanner}
                alt="Reward Banner"
                className="w-full rounded-2xl shadow-lg"
              />

              <img
                src={freeImage}
                alt="Warning Graphic"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </aside>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between bg-red-600 p-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Awareness Alert!</h2>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-sm hover:bg-white/25"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-6">
              <img
                src={warningImage}
                alt="Warning Graphic"
                className="w-full rounded-2xl shadow-lg"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setShowPopup(false)}
                  className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
