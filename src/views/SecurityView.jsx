import React from 'react';

const SecurityView = () => {
  const cameras = [
    { id: 1, name: 'Zona de Tejido', status: 'Online', lastEvent: 'Hace 2 min' },
    { id: 2, name: 'Zona de Remalle', status: 'Online', lastEvent: 'Hace 5 min' },
    { id: 3, name: 'Almacén de Lana', status: 'Online', lastEvent: 'Sin eventos' },
    { id: 4, name: 'Entrada Principal', status: 'Online', lastEvent: 'Movimiento detectado' }
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Monitoreo de Seguridad</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60' }}>SISTEMA OK</button>
          <button className="btn-primary">Configurar Cámaras</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {cameras.map(cam => (
          <div key={cam.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              height: '250px', background: '#000', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#27ae60', fontSize: '0.7rem', fontWeight: 'bold' }}>
                ● LIVE - CAM {cam.id}
              </div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Conectando flujo RTSP...</p>
              </div>
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>{cam.name}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cam.lastEvent}</p>
              </div>
              <button style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}>
                Ver Grabaciones
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3>Registro de Accesos</h3>
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>[08:15 AM] Juan Perez - Ingreso al sistema desde IP 192.168.1.15</p>
          <p style={{ color: 'var(--text-muted)' }}>[09:02 AM] Becerra - Cambio de asignación en Pedido #1024</p>
          <p style={{ color: 'var(--text-muted)' }}>[10:30 AM] Alerta de Movimiento - Cámara 4 (Entrada)</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
