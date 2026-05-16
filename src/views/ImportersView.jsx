import React, { useState } from 'react';

const ImportersView = () => {
  const [importers, setImporters] = useState([
    { id: 1, name: 'Textiles del Sur S.A.', country: 'Chile', status: 'Activo', totalValue: 45000, logo: '🇨🇱' },
    { id: 2, name: 'Global Knitwear Corp', country: 'USA', status: 'Activo', totalValue: 120000, logo: '🇺🇸' },
    { id: 3, name: 'Moda Ibérica S.L.', country: 'España', status: 'En Pausa', totalValue: 8500, logo: '🇪🇸' },
    { id: 4, name: 'Andean Fibers Ltd.', country: 'Perú', status: 'Activo', totalValue: 32000, logo: '🇵🇪' }
  ]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Empresas Importadoras (B2B)</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Directorio de clientes mayoristas y exportación.</p>
        </div>
        <button className="btn-primary">+ Nueva Importadora</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {importers.map(imp => (
          <div key={imp.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              {imp.logo}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{imp.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{imp.country}</span>
                <span style={{ 
                  fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px',
                  background: imp.status === 'Activo' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                  color: imp.status === 'Activo' ? '#27ae60' : '#f1c40f'
                }}>{imp.status}</span>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Total Facturado: <span style={{ color: 'var(--accent)' }}>${imp.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3>Historial de Exportaciones Recientes</h3>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
           {[1,2,3].map(i => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <span>Envío #EX-900{i} - {i === 1 ? 'Global Knitwear' : 'Textiles del Sur'}</span>
                <span style={{ color: 'var(--text-muted)' }}>{i*500} prendas - Enviado el 1{i}/05/2026</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ImportersView;
