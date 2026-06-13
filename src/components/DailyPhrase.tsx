'use client';

import { getDailyPhrase } from '@/lib/phrases';

export default function DailyPhrase() {
  const phrase = getDailyPhrase();
  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-4">
      <p className="text-[#707070] text-xs uppercase tracking-widest mb-2">Frase do dia</p>
      <p className="text-[#f0f0f0] text-sm font-medium italic leading-relaxed">&ldquo;{phrase}&rdquo;</p>
    </div>
  );
}
