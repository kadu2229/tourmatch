'use client';

import { useEffect, useState } from 'react';

const features = [
  'Compatibilidade por idioma, destino e orçamento',
  'Recomendações personalizadas por interesses',
  'Conexão rápida entre turistas e guias locais'
];

type MatchGuide = {
  guideId: string;
  score: number;
  reasons: string[];
};

const defaultGuides: MatchGuide[] = [
  { guideId: 'guide-1', score: 96, reasons: ['Destino alinhado', 'Idioma compatível'] },
  { guideId: 'guide-2', score: 92, reasons: ['Interesse em comum', 'Preço compatível'] },
  { guideId: 'guide-3', score: 89, reasons: ['Boa avaliação', 'Alta disponibilidade'] }
];

const guideNames: Record<string, string> = {
  'guide-1': 'Luan Costa',
  'guide-2': 'Sofia Almeida',
  'guide-3': 'Mateus Ribeiro'
};

const guideCities: Record<string, string> = {
  'guide-1': 'Rio de Janeiro',
  'guide-2': 'Salvador',
  'guide-3': 'Florianópolis'
};

const guideSpecialties: Record<string, string[]> = {
  'guide-1': ['Histórico', 'Cultural'],
  'guide-2': ['Gastronômico', 'Natureza'],
  'guide-3': ['Natureza', 'Aventura']
};

export default function HomePage() {
  const [guides, setGuides] = useState(defaultGuides);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/matches?destination=Rio%20de%20Janeiro&budget=300&interests=historical&languages=pt-BR');
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = (await response.json()) as { matches?: MatchGuide[] };
        if (Array.isArray(data.matches) && data.matches.length > 0) {
          setGuides(data.matches);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', color: '#122033', background: '#f8fafc' }}>
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'center' }}>
        <div>
          <p style={{ color: '#1d4ed8', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16 }}>
            TourMatch
          </p>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.1, margin: '0 0 16px' }}>
            Encontre o guia ideal para sua viagem.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: 28 }}>
            A plataforma conecta turistas e guias com base em destino, idioma, orçamento, disponibilidade e interesses culturais.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 22px', fontWeight: 700, cursor: 'pointer' }}>
              Buscar guia
            </button>
            <button style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: 999, padding: '14px 22px', fontWeight: 700, cursor: 'pointer' }}>
              Sou guia
            </button>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #dbeafe, #f8fafc)', borderRadius: 24, padding: 24, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Compatibilidade</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {features.map((feature) => (
              <li key={feature} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 8px 20px rgba(148, 163, 184, 0.12)' }}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Sugestões para você</h2>
          <span style={{ color: '#475569', fontWeight: 600 }}>{guides.length} guias em alta</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {guides.map((guide) => (
            <article key={guide.guideId} style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 20px 35px rgba(15, 23, 42, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>{guideNames[guide.guideId] ?? guide.guideId}</h3>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 999, padding: '6px 10px', fontWeight: 700 }}>{guide.score}%</span>
              </div>
              <p style={{ margin: '6px 0', color: '#334155' }}>{guideCities[guide.guideId] ?? 'Destino'}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                {(guideSpecialties[guide.guideId] ?? ['Especialidade']).map((specialty) => (
                  <span key={specialty} style={{ background: '#f1f5f9', color: '#0f172a', borderRadius: 999, padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>
                    {specialty}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                {guide.reasons.map((reason) => (
                  <p key={reason} style={{ margin: '4px 0', color: '#64748b', fontSize: 13 }}>{reason}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
