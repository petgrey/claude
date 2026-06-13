'use client';

import { useRouter } from 'next/navigation';

export default function ReturnScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <div className="max-w-[340px] w-full text-center">
        <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8863a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 className="text-[#f0f0f0] text-2xl font-bold mb-3">Você voltou.</h1>
        <p className="text-[#707070] text-sm leading-relaxed mb-8">
          O lastro não some. Cada evidência que você gerou ainda existe.
        </p>
        <button
          onClick={() => router.push('/evidencias')}
          className="w-full py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-lg mb-3"
        >
          Gerar uma evidência agora
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-sm border border-[#252525] text-[#707070] rounded-lg"
        >
          Ver painel de hoje
        </button>
      </div>
    </div>
  );
}
