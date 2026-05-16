import React, { useState } from 'react';

const GarmentsView = () => {
  const [garments, setGarments] = useState(() => {
    const saved = localStorage.getItem('lanera_garments');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Suéter Cuello en V - Colección Invierno",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop",
        programFile: "sueter_v_v1.hcd",
        notes: { vueltas: 450, tension: "7.2", hilo: "Lana Merino 2/28", aguja: "12G" }
      },
      {
        id: 2,
        name: "Cardigan Trenzado - Mujer",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1170&auto=format&fit=crop",
        programFile: "cardigan_trenza.hcd",
        notes: { vueltas: 680, tension: "6.5", hilo: "Algodón Peinado", aguja: "10G" }
      }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGarment, setNewGarment] = useState({
    name: '',
    image: '',
    programFile: '',
    vueltas: '',
    tension: '',
    hilo: '',
    aguja: ''
  });

  const [hoveredGarment, setHoveredGarment] = useState(null);

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
                  transform: hoveredGarment === garment.id ? 'scale(1.2)' : 'scale(1)'
                }}
              />
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
              <button style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>Ver Ficha</button>
              <button style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--accent)', border: 'none', color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>Descargar {garment.programFile.split('.').pop().toUpperCase()}</button>
            </div>
          </div>
        ))}
      </div>

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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Programa HQPDS (.HCD, .PAT, .HQS)</label>
                <input 
                  type="text"
                  className="glass-input" placeholder="Nombre del archivo (ej: sueter_v1.hcd)"
                  value={newGarment.programFile} onChange={e => setNewGarment({...newGarment, programFile: e.target.value})}
                />
              </div>

              <input 
                className="glass-input" placeholder="URL de Imagen de Previsualización"
                value={newGarment.image} onChange={e => setNewGarment({...newGarment, image: e.target.value})}
              />
              
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

      {/* Zoom Overlay */}
      {hoveredGarment && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', width: '350px', height: '350px',
          zIndex: 1000, borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '2px solid var(--accent)',
          pointerEvents: 'none'
        }} className="animate-fade">
           <img 
              src={garments.find(g => g.id === hoveredGarment)?.image} 
              alt="Zoom"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(2.5)' }}
           />
        </div>
      )}
    </div>
  );
};

export default GarmentsView;

