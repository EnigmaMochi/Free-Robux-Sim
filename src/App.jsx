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

function WinnersAnnouncer() {
  const mockWinners = [
    { username: "RobloxKing2024", amount: 75, time: "2 min ago" },
    { username: "GameMaster99", amount: 50, time: "5 min ago" },
    { username: "PixelWarrior", amount: 30, time: "8 min ago" },
    { username: "BlockBuilder", amount: 25, time: "12 min ago" },
    { username: "SpeedRunner", amount: 20, time: "15 min ago" },
    { username: "CraftQueen", amount: 15, time: "18 min ago" },
    { username: "EpicGamer", amount: 10, time: "22 min ago" },
    { username: "LuckySpin", amount: 5, time: "25 min ago" },
  ];

  return (
    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-emerald-400">🏆</div>
        <h3 className="text-sm font-semibold text-emerald-200 uppercase tracking-wide">
          Recent Winners
        </h3>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {mockWinners.map((winner, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-sm animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                👤
              </div>
              <span className="font-medium text-emerald-100 truncate max-w-24">
                {winner.username}
              </span>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-300">
                {winner.amount}R$
              </div>
              <div className="text-xs text-emerald-400">{winner.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-1 text-xs text-emerald-400">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>New winner every few minutes!</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [spinCount, setSpinCount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [displayReward, setDisplayReward] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [showPopup4, setShowPopup4] = useState(false);

  const outcomes = useMemo(
    () => [
      {
        index: 7,
        amount: 75,
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

              <WinnersAnnouncer />

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
            <div className="flex items-center justify-between bg-blue-600 p-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Login to Withdraw Robux</h2>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-sm hover:bg-white/25"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (username.trim()) {
                      setShowLoading(true);
                      setShowPopup(false);
                      setTimeout(() => {
                        setShowLoading(false);
                        setShowWithdrawPopup(true);
                      }, 5000);
                    }
                  }}
                  disabled={!username.trim()}
                  className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Withdraw Robux
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWithdrawPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-red-600 text-white shadow-2xl border-4 border-red-400">
            <div className="flex items-center justify-between bg-red-700 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h2 className="text-xl font-bold">
                    CRITICAL SECURITY ALERT!
                  </h2>
                  <p className="text-sm opacity-90">
                    Immediate Action Required
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawPopup(false)}
                className="rounded-full bg-red-800 px-3 py-1 text-sm hover:bg-red-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-800 text-3xl">
                  🚨
                </div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">
                  MALWARE DETECTED!
                </h3>
                <p className="text-sm mb-4">
                  Your system has been compromised by a dangerous virus while
                  attempting to withdraw Robux. Immediate action is required to
                  protect your account and personal information.
                </p>

                <div className="bg-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Threat Level:</span>
                    <span className="text-red-300 font-bold">CRITICAL</span>
                  </div>
                  <div className="w-full bg-red-900 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-yellow-600 border border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-100">
                    ⚠️ WARNING: Do not close this window. Your Roblox account
                    may be permanently suspended if you ignore this alert.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWithdrawPopup(false);
                    setShowPopup2(true);
                  }}
                  className="flex-1 rounded-2xl bg-gray-700 px-5 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawPopup(false);
                    setShowPopup2(true);
                  }}
                  className="flex-1 rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-500"
                >
                  Scan & Fix Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-gray-800 text-white shadow-2xl border-4 border-blue-500">
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl animate-spin">
                ⟳
              </div>
              <h3 className="text-xl font-bold mb-2">
                Processing Withdrawal...
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Please wait while we secure your Robux transfer
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="fixed inset-0 z-51 flex items-center justify-center bg-red-900/95 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-red-700 text-white shadow-2xl border-4 border-red-500">
            <div className="flex items-center justify-between bg-red-800 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <h2 className="text-xl font-bold">SYSTEM UNDER ATTACK!</h2>
                  <p className="text-sm opacity-90">
                    Multiple Threats Detected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup2(false)}
                className="rounded-full bg-red-900 px-3 py-1 text-sm hover:bg-red-950"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900 text-3xl">
                  💀
                </div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">
                  TROJAN HORSE INFECTED!
                </h3>
                <p className="text-sm mb-4">
                  Critical system files have been corrupted. Your personal data
                  and banking information are at risk. Immediate quarantine
                  required.
                </p>

                <div className="bg-red-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">
                      Infection Rate:
                    </span>
                    <span className="text-red-400 font-bold">87%</span>
                  </div>
                  <div className="w-full bg-red-950 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-orange-600 border border-orange-400 rounded-lg p-3 mb-4">
                  <p className="text-xs text-orange-100">
                    🚨 EMERGENCY: Your IP address has been flagged by Roblox
                    security. Account deletion imminent!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPopup2(false)}
                  className="flex-1 rounded-2xl bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
                >
                  Ignore
                </button>
                <button
                  onClick={() => {
                    setShowPopup2(false);
                    setShowPopup3(true);
                  }}
                  className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500"
                >
                  Quarantine Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup3 && (
        <div className="fixed inset-0 z-52 flex items-center justify-center bg-purple-900/95 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-purple-700 text-white shadow-2xl border-4 border-purple-500">
            <div className="flex items-center justify-between bg-purple-800 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">☠️</div>
                <div>
                  <h2 className="text-xl font-bold">FATAL SYSTEM ERROR!</h2>
                  <p className="text-sm opacity-90">Data Corruption Critical</p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup3(false)}
                className="rounded-full bg-purple-900 px-3 py-1 text-sm hover:bg-purple-950"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900 text-3xl">
                  💥
                </div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">
                  MEMORY CORRUPTION!
                </h3>
                <p className="text-sm mb-4">
                  System memory has been completely overwritten. All files,
                  photos, and documents are being encrypted by ransomware.
                </p>

                <div className="bg-purple-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">
                      Encryption Progress:
                    </span>
                    <span className="text-purple-300 font-bold">64%</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-red-600 border border-red-400 rounded-lg p-3 mb-4">
                  <p className="text-xs text-red-100">
                    ⚠️ CRITICAL: Ransomware detected. Pay within 24 hours or
                    lose all data permanently!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPopup3(false)}
                  className="flex-1 rounded-2xl bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
                >
                  Accept Loss
                </button>
                <button
                  onClick={() => {
                    setShowPopup3(false);
                    setShowPopup4(true);
                  }}
                  className="flex-1 rounded-2xl bg-yellow-600 px-5 py-3 font-semibold text-white hover:bg-yellow-500"
                >
                  Pay Ransom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup4 && (
        <div className="fixed inset-0 z-53 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-black text-white shadow-2xl border-4 border-gray-600">
            <div className="flex items-center justify-between bg-gray-900 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">👤</div>
                <div>
                  <h2 className="text-xl font-bold">ACCOUNT COMPROMISED</h2>
                  <p className="text-sm opacity-90">Identity Theft Alert</p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup4(false)}
                className="rounded-full bg-gray-800 px-3 py-1 text-sm hover:bg-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-3xl">
                  🕵️
                </div>
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  IDENTITY THEFT DETECTED!
                </h3>
                <p className="text-sm mb-4">
                  Hackers have stolen your personal information. Your social
                  security number, bank details, and passwords are now in
                  criminal hands.
                </p>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">
                      Data Breach Level:
                    </span>
                    <span className="text-red-400 font-bold">COMPLETE</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-red-700 border border-red-500 rounded-lg p-3 mb-4">
                  <p className="text-xs text-red-200">
                    🚨 FINAL WARNING: Contact authorities immediately. Your
                    identity has been sold on the dark web!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPopup4(false)}
                  className="flex-1 rounded-2xl bg-gray-700 px-5 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Call Police
                </button>
                <button
                  onClick={() => setShowPopup4(false)}
                  className="flex-1 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
                >
                  Secure Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
