"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getArticleById } from "@/lib/mock-data";

type CompletePageProps = {
  params: Promise<{ id: string }>;
};

function CountUp({ target, delay }: { target: number; delay: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;

      const duration = 600;
      const steps = Math.min(target, 30);
      const stepTime = duration / steps;
      let step = 0;

      function tick() {
        step++;
        const progress = step / steps;
        // Ease-out curve for satisfying deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (step < steps) {
          setTimeout(tick, stepTime);
        }
      }

      tick();
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [target, delay]);

  return <>{value.toLocaleString()}</>;
}

export default function CompletePage({ params }: CompletePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const article = getArticleById(id);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 2400);
    return () => clearTimeout(t);
  }, []);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  const wordsRead = article.wordsCount;
  const wordsKnown = Math.round(article.wordsCount * 0.3);
  const pagesRead = article.pages.length;

  const stats = [
    { label: "Words Read", value: wordsRead, delay: 600 },
    { label: "New Words Known", value: wordsKnown, delay: 1200 },
    { label: "Pages", value: pagesRead, delay: 1800 },
  ];

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-white px-6">
      {/* Checkmark */}
      <div className="smash-in" style={{ animationDelay: "0ms" }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-black">
          <svg
            width={36}
            height={36}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="smash-in mt-6" style={{ animationDelay: "200ms" }}>
        <h1 className="text-2xl font-black tracking-tight">Complete</h1>
      </div>

      <div
        className="smash-in mt-1 text-sm text-black/40"
        style={{ animationDelay: "300ms" }}
      >
        {article.title}
      </div>

      {/* Stats — smash in one by one */}
      <div className="mt-10 flex w-full max-w-xs flex-col gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="smash-in flex items-baseline justify-between border-b border-black/10 pb-3"
            style={{ animationDelay: `${stat.delay}ms` }}
          >
            <span className="text-sm text-black/50">{stat.label}</span>
            <span className="font-mono text-3xl font-black tabular-nums">
              <CountUp target={stat.value} delay={stat.delay + 300} />
            </span>
          </div>
        ))}
      </div>

      {/* Continue button — fades in last */}
      <div
        className={`mt-12 w-full max-w-xs transition-all duration-500 ${
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => router.push("/home")}
          className="w-full border-2 border-black py-4 text-sm font-bold tracking-wide uppercase"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
