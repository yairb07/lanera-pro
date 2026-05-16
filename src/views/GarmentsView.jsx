import React, { useState } from 'react';

const GarmentsView = () => {
  const [garments, setGarments] = useState([
    {
      id: 1,
      name: "Suéter Cuello en V - Colección Invierno",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop", // Placeholder or generated image
      programFile: "sueter_v_v1.hcd",
      notes: {
        vueltas: 450,
        tension: "7.2",
        hilo: "Lana Merino 2/28",
        aguja: "12G"
      }
    },
    {
      id: 2,
      name: "Cardigan Trenzado - Mujer",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1170&auto=format&fit=crop",
      programFile: "cardigan_trenza.hcd",
      notes: {
        vueltas: 680,
        tension: "6.5",
        hilo: "Algodón Peinado",
        aguja: "10G"
      }
    }
  ]);

  const [hoveredGarment, setHoveredGarment] = useState(null);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Catálogo de Prendas & Diseños</h1>
        <button className="btn-primary">+ Nuevo Diseño</button>
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
              {hoveredGarment === garment.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  Vista Ampliada
                </div>
              )}
            </div>

            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{garment.name}</h3>
            
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
              <button style={{ 
                flex: 1, 
                padding: '0.5rem', 
                borderRadius: '6px', 
                border: '1px solid var(--accent)',
                background: 'transparent',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Ver Ficha
              </button>
              <button style={{ 
                flex: 1, 
                padding: '0.5rem', 
                borderRadius: '6px', 
                background: 'var(--accent)',
                border: 'none',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Descargar .HCD
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Overlay (Optional for extreme detail) */}
      {hoveredGarment && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '300px',
          height: '300px',
          zIndex: 1000,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          border: '2px solid var(--accent)',
          pointerEvents: 'none'
        }} className="animate-fade">
           <img 
              src={garments.find(g => g.id === hoveredGarment).image} 
              alt="Zoom"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(2)' }}
           />
        </div>
      )}
    </div>
  );
};

export default GarmentsView;
