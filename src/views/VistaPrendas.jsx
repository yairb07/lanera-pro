import { useState } from 'react';

const VistaPrendas = ({ prendas = [], setPrendas }) => {
  const [estaModalAbierto, setEstaModalAbierto] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);
  const [prendaResaltada, setPrendaResaltada] = useState(null);
  const [nuevaPrenda, setNuevaPrenda] = useState({ name: '', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });

  const manejarAgregarPrenda = (e) => {
    e.preventDefault();
    const prendaAAgregar = {
      id: Date.now(),
      name: nuevaPrenda.name,
      image: nuevaPrenda.image || "https://images.unsplash.com/photo-1434031219129-14e5c876f628?q=80&w=1170&auto=format&fit=crop",
      programFile: nuevaPrenda.programFile || "diseño_heng_qiang.hcd",
      notes: {
        vueltas: nuevaPrenda.vueltas,
        tension: nuevaPrenda.tension,
        hilo: nuevaPrenda.hilo,
        aguja: nuevaPrenda.aguja
      }
    };

    const prendasActualizadas = [...prendas, prendaAAgregar];
    setPrendas(prendasActualizadas);
    localStorage.setItem('taller_prendas', JSON.stringify(prendasActualizadas));
    setEstaModalAbierto(false);
    setNuevaPrenda({ name: '', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });
  };

  const manejarDescarga = (prenda) => {
    const contenido = `Programa Heng Qiang: ${prenda.programFile}\nDiseño: ${prenda.name}\nNotas Técnicas:\nVueltas: ${prenda.notes.vueltas}\nTensión: ${prenda.notes.tension}\nHilo: ${prenda.notes.hilo}\nAguja: ${prenda.notes.aguja}`;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = prenda.programFile;
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
        <button className="btn-primary" onClick={() => setEstaModalAbierto(true)}>+ Nuevo Diseño</button>
      </div>

      {prendas.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No hay diseños registrados en el catálogo.</p>
          <button className="btn-primary" onClick={() => setEstaModalAbierto(true)}>+ Agregar primer diseño</button>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {prendas.map(prenda => (
          <div 
            key={prenda.id} 
            className="glass-panel" 
            style={{ 
              padding: '1.5rem', 
              position: 'relative',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setPrendaResaltada(prenda.id)}
            onMouseLeave={() => setPrendaResaltada(null)}
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
                src={prenda.image} 
                alt={prenda.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: prendaResaltada === prenda.id ? 'scale(1.1)' : 'scale(1)'
                }}
              />

              {/* Zoom Overlay Localizado */}
              {prendaResaltada === prenda.id && (
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
                      src={prenda.image} 
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
               <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.1rem' }}>{prenda.name}</h3>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{prenda.programFile}</span>
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
              <div><strong>Vueltas:</strong> {prenda.notes.vueltas}</div>
              <div><strong>Tensión:</strong> {prenda.notes.tension}</div>
              <div><strong>Hilo:</strong> {prenda.notes.hilo}</div>
              <div><strong>Aguja:</strong> {prenda.notes.aguja}</div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setPrendaSeleccionada(prenda)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Ver Ficha
              </button>
              <button 
                onClick={() => manejarDescarga(prenda)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--accent)', border: 'none', color: 'white', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Descargar {prenda.programFile.split('.').pop().toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal Detalle (Ficha Técnica) */}
      {prendaSeleccionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4000, backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '90%', display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#000' }}>
              <img src={prendaSeleccionada.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Previsualización Ampliada" />
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Ficha Técnica: {prendaSeleccionada.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Archivo: {prendaSeleccionada.programFile}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', flex: 1 }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                   <strong>Especificaciones de Máquina:</strong>
                   <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                      <li>⚡ Tensión: {prendaSeleccionada.notes.tension}</li>
                      <li>🔄 Vueltas: {prendaSeleccionada.notes.vueltas}</li>
                      <li>🧶 Hilo: {prendaSeleccionada.notes.hilo}</li>
                      <li>📍 Aguja/Galga: {prendaSeleccionada.notes.aguja}</li>
                   </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => manejarDescarga(prendaSeleccionada)}>Descargar Archivo</button>
                <button className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setPrendaSeleccionada(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar */}
      {estaModalAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3000, backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Agregar Diseño Heng Qiang</h2>
            <form onSubmit={manejarAgregarPrenda} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="glass-input" placeholder="Nombre del diseño" required
                value={nuevaPrenda.name} onChange={e => setNuevaPrenda({...nuevaPrenda, name: e.target.value})}
              />
              
              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Subir Programa HQPDS (.HCD, .PAT, .HQS)</label>
                <input 
                  type="file"
                  accept=".hcd,.pat,.hqs"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const archivo = e.target.files[0];
                    if (archivo) setNuevaPrenda({...nuevaPrenda, programFile: archivo.name});
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
                    const archivo = e.target.files[0];
                    if (archivo) {
                      const lector = new FileReader();
                      lector.onloadend = () => {
                        setNuevaPrenda({...nuevaPrenda, image: lector.result});
                      };
                      lector.readAsDataURL(archivo);
                    }
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                <input 
                  className="glass-input" placeholder="Vueltas" type="number"
                  value={nuevaPrenda.vueltas} onChange={e => setNuevaPrenda({...nuevaPrenda, vueltas: e.target.value})}
                />
                <input 
                  className="glass-input" placeholder="Tensión"
                  value={nuevaPrenda.tension} onChange={e => setNuevaPrenda({...nuevaPrenda, tension: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  className="glass-input" placeholder="Tipo de Hilo"
                  value={nuevaPrenda.hilo} onChange={e => setNuevaPrenda({...nuevaPrenda, hilo: e.target.value})}
                />
                <input 
                  className="glass-input" placeholder="Galga / Aguja"
                  value={nuevaPrenda.aguja} onChange={e => setNuevaPrenda({...nuevaPrenda, aguja: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEstaModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar en Sistema</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VistaPrendas;
