import React from 'react';

const DashboardView = ({ user }) => (
  <div className="animate-fade">
    <h1>Bienvenido, {user.name}</h1>
    <p style={{ color: 'var(--text-muted)' }}>{user.role === 'admin' ? 'Vista de Administrador' : 'Vista de Operario'}</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
      {user.role === 'admin' ? (
        <>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Producción Total</h4>
            <h2 style={{ fontSize: '2.5rem' }}>1,250 pzas</h2>
            <p style={{ color: '#27ae60', fontSize: '0.9rem', marginTop: '0.5rem' }}>↑ 20% vs mes pasado</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Pagos Pendientes</h4>
            <h2 style={{ fontSize: '2.5rem' }}>$3,400</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Nómina taller</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Cámaras Activas</h4>
            <h2 style={{ fontSize: '2.5rem' }}>4</h2>
            <p style={{ color: '#27ae60', fontSize: '0.9rem', marginTop: '0.5rem' }}>Monitoreo OK</p>
          </div>
        </>
      ) : (
        <>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Mis Tareas Hoy</h4>
            <h2 style={{ fontSize: '2.5rem' }}>4</h2>
            <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '0.5rem' }}>2 Urgentes</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Mi Ganancia (Hoy)</h4>
            <h2 style={{ fontSize: '2.5rem' }}>$85.50</h2>
            <p style={{ color: '#27ae60', fontSize: '0.9rem', marginTop: '0.5rem' }}>Pago por destajo</p>
          </div>
        </>
      )}
    </div>
  </div>
);

export default DashboardView;
