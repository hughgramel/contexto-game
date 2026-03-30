"use client";

import { useEffect, useRef, useState } from "react";

type SlotCounterProps = {
  value: number;
  label: string;
};

export function SlotCounter({ value, label }: SlotCounterProps) {
  const prevValue = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const [popping, setPopping] = useState(false);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const prev = prevValue.current;
    if (value === prev) return;

    const diff = value - prev;
    prevValue.current = value;

    // Show the +n badge and trigger pop
    setDelta(diff);
    setShowDelta(true);
    setPopping(true);

    // Casino-style count up from prev to value
    const totalSteps = Math.min(Math.abs(diff), 20);
    const stepDuration = 300 / totalSteps; // finish in ~300ms
    let step = 0;

    function tick() {
      step++;
      const progress = step / totalSteps;
      const current = Math.round(prev + diff * progress);
      setDisplayValue(current);

      if (step < totalSteps) {
        rafRef.current = window.setTimeout(tick, stepDuration) as unknown as number;
      }
    }

    // Start the count-up after a brief delay so +n appears first
    const startTimeout = setTimeout(tick, 100);

    // Remove pop class after animation finishes
    const popTimeout = setTimeout(() => setPopping(false), 500);

    // Hide the +n badge after the animation completes
    timeoutRef.current = setTimeout(() => {
      setShowDelta(false);
    }, 1500);

    return () => {
      clearTimeout(popTimeout);
      clearTimeout(startTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [value]);

  return (
    <div
      className={`flex items-center gap-1.5 origin-left ${popping ? "counter-pop" : ""}`}
    >
      <span className="text-black/40 text-xs">{label}</span>
      <span className="font-mono font-bold text-sm tabular-nums">
        {displayValue.toLocaleString()}
      </span>
      <span
        className={`font-mono text-xs font-semibold text-emerald-600 transition-all duration-300 ${
          showDelta && delta > 0
            ? `opacity-100 ${popping ? "scale-125" : "scale-100"}`
            : "opacity-0 scale-75"
        }`}
      >
        +{delta}
      </span>
    </div>
  );
}
