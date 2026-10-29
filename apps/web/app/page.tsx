const features = [
  'Compatibilidade por idioma, destino e orçamento',
  'Recomendações personalizadas por interesses',
  'Conexão rápida entre turistas e guias locais'
];

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: 1100, margin: '0 auto', padding: '48px 24px', color: '#122033' }}>
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
            <button style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 22px', fontWeight: 700 }}>
              Buscar guia
            </button>
            <button style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: 999, padding: '14px 22px', fontWeight: 700 }}>
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
    </main>
  );
}
