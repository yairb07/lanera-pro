import React, { useState } from 'react';

const SecurityView = () => {
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Zona de Tejido', status: 'Online', lastEvent: 'Hace 2 min' },
    { id: 2, name: 'Zona de Remalle', status: 'Online', lastEvent: 'Hace 5 min' },
    { id: 3, name: 'Almacén de Lana', status: 'Online', lastEvent: 'Sin eventos' },
    { id: 4, name: 'Entrada Principal', status: 'Online', lastEvent: 'Movimiento detectado' }
  ]);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeRecording, setActiveRecording] = useState(null);
  const [editingCamera, setEditingCamera] = useState(null);

  const handleUpdateCamera = (e) => {
    e.preventDefault();
    const updated = cameras.map(cam => 
      cam.id === editingCamera.id ? { ...cam, name: editingCamera.newName } : cam
    );
    setCameras(updated);
    setEditingCamera(null);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Monitoreo de Seguridad</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60' }}>SISTEMA OK</button>
          <button className="btn-primary" onClick={() => setIsConfigModalOpen(true)}>Configurar Cámaras</button>
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
                ● LIVE - {cam.name.toUpperCase()}
              </div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Conectando flujo P2P...</p>
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
              <button 
                onClick={() => setActiveRecording(cam)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                Ver Grabaciones
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ver Grabaciones */}
      {activeRecording && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4000, backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '95%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <h3>Grabaciones: {activeRecording.name}</h3>
               <button onClick={() => setActiveRecording(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ width: '100%', height: '400px', background: '#111', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ color: 'var(--accent)', textAlign: 'center' }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  <p style={{ marginTop: '1rem' }}>Reproduciendo grabación: Hoy 10:30 AM</p>
               </div>
               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'rgba(0,0,0,0.5)' }}>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                     <div style={{ width: '45%', height: '100%', background: 'var(--accent)', borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'white' }}>
                     <span>10:25 AM</span>
                     <span>10:30 AM (Reproduciendo)</span>
                     <span>10:35 AM</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configurar Cámaras */}
      {isConfigModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4000, backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h2 style={{ color: 'var(--accent)' }}>Configuración de Cámaras</h2>
               <button onClick={() => setIsConfigModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {cameras.map(cam => (
                  <div key={cam.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                     {editingCamera?.id === cam.id ? (
                        <form onSubmit={handleUpdateCamera} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                           <input 
                              autoFocus
                              className="glass-input" 
                              value={editingCamera.newName} 
                              onChange={e => setEditingCamera({...editingCamera, newName: e.target.value})}
                           />
                           <button type="submit" className="btn-primary" style={{ padding: '0.5rem' }}>OK</button>
                        </form>
                     ) : (
                        <>
                           <span>{cam.name}</span>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => setEditingCamera({ id: cam.id, newName: cam.name })} style={{ fontSize: '0.7rem', color: 'var(--accent)', background: 'transparent', border: '1px solid var(--accent)', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                              <button style={{ fontSize: '0.7rem', color: '#e74c3c', background: 'transparent', border: '1px solid #e74c3c', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                           </div>
                        </>
                     )}
                  </div>
               ))}
               <button className="btn-primary" style={{ marginTop: '1rem' }}>+ Agregar Nueva Cámara</button>
            </div>
          </div>
        </div>
      )}
      
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

