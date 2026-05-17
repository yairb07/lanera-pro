import React, { useState } from 'react';

const GarmentsView = ({ garments = [], setGarments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [hoveredGarment, setHoveredGarment] = useState(null);
  const [newGarment, setNewGarment] = useState({ name: '', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });

  const handleAddGarment = (e) => {
    e.preventDefault();
    const garmentToAdd = {
      id: Date.now(),
      name: newGarment.name,
      image: newGarment.image || "https://images.unsplash.com/photo-1434031219129-14e5c876f628?q=80&w=1170&auto=format&fit=crop",
      programFile: newGarment.programFile || "diseño_heng_qiang.hcd",
      notes: {
        vueltas: newGarment.vueltas,
        tension: newGarment.tension,
        hilo: newGarment.hilo,
        aguja: newGarment.aguja
      }
    };

    const updatedGarments = [...garments, garmentToAdd];
    setGarments(updatedGarments);
    localStorage.setItem('lanera_garments', JSON.stringify(updatedGarments));
    setIsModalOpen(false);
    setNewGarment({ name: '', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });
  };

  const handleDownload = (garment) => {
    const content = `Heng Qiang Program: ${garment.programFile}\nDesign: ${garment.name}\nTechnical Notes:\nVueltas: ${garment.notes.vueltas}\nTension: ${garment.notes.tension}\nHilo: ${garment.notes.hilo}\nAguja: ${garment.notes.aguja}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = garment.programFile;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <h1 style={{ margin: 0 }}>Catálogo de Diseños HQPDS</h1>
           <span style={{ fontSize: '0.8rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>HENG QIANG</span>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nuevo Diseño</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {garments.map(garment => (
          <div 
            key={garment.id} 
            className="glass-panel" 
            style={{ 
              padding: '1.5rem', 
              position: 'relative',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredGarment(garment.id)}
            onMouseLeave={() => setHoveredGarment(null)}
          >
            <div style={{ 
              width: '100%', 
              height: '200px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <img 
                src={garment.image} 
                alt={garment.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: hoveredGarment === garment.id ? 'scale(1.1)' : 'scale(1)'
                }}
              />

              {/* Zoom Overlay Localizado */}
              {hoveredGarment === garment.id && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  zIndex: 100,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                  border: '2px solid var(--accent)',
                  pointerEvents: 'none'
                }} className="animate-fade">
                   <img 
                      src={garment.image} 
                      alt="Zoom"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        transform: 'scale(3)' 
                      }}
                   />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
               <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.1rem' }}>{garment.name}</h3>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{garment.programFile}</span>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '0.5rem', 
              fontSize: '0.85rem',
              background: 'rgba(0,0,0,0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <div><strong>Vueltas:</strong> {garment.notes.vueltas}</div>
              <div><strong>Tensión:</strong> {garment.notes.tension}</div>
              <div><strong>Hilo:</strong> {garment.notes.hilo}</div>
              <div><strong>Aguja:</strong> {garment.notes.aguja}</div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setSelectedGarment(garment)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Ver Ficha
              </button>
              <button 
                onClick={() => handleDownload(garment)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--accent)', border: 'none', color: 'white', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Descargar {garment.programFile.split('.').pop().toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalle (Ficha Técnica) */}
      {selectedGarment && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4000, backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '90%', display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#000' }}>
              <img src={selectedGarment.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Large preview" />
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Ficha Técnica: {selectedGarment.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Archivo: {selectedGarment.programFile}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', flex: 1 }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                   <strong>Especificaciones de Máquina:</strong>
                   <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                      <li>⚡ Tensión: {selectedGarment.notes.tension}</li>
                      <li>🔄 Vueltas: {selectedGarment.notes.vueltas}</li>
                      <li>🧶 Hilo: {selectedGarment.notes.hilo}</li>
                      <li>📍 Aguja/Galga: {selectedGarment.notes.aguja}</li>
                   </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleDownload(selectedGarment)}>Descargar Archivo</button>
                <button className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSelectedGarment(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3000, backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Agregar Diseño Heng Qiang</h2>
            <form onSubmit={handleAddGarment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="glass-input" placeholder="Nombre del diseño" required
                value={newGarment.name} onChange={e => setNewGarment({...newGarment, name: e.target.value})}
              />
              
              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Subir Programa HQPDS (.HCD, .PAT, .HQS)</label>
                <input 
                  type="file"
                  accept=".hcd,.pat,.hqs"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) setNewGarment({...newGarment, programFile: file.name});
                  }}
                />
              </div>

              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Imagen de Previsualización (Zoom)</label>
                <input 
                  type="file"
                  accept="image/*"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewGarment({...newGarment, image: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                <input 
                  className="glass-input" placeholder="Vueltas" type="number"
                  value={newGarment.vueltas} onChange={e => setNewGarment({...newGarment, vueltas: e.target.value})}
                />
                <input 
                  className="glass-input" placeholder="Tensión"
                  value={newGarment.tension} onChange={e => setNewGarment({...newGarment, tension: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  className="glass-input" placeholder="Tipo de Hilo"
                  value={newGarment.hilo} onChange={e => setNewGarment({...newGarment, hilo: e.target.value})}
                />
                <input 
                  className="glass-input" placeholder="Galga / Aguja"
                  value={newGarment.aguja} onChange={e => setNewGarment({...newGarment, aguja: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar en Sistema</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GarmentsView;


