import React, { useState } from 'react';

const DashboardView = ({ user, produccion = [], pedidos = [], conos = [], setActiveTab }) => {
  // Estado de fecha seleccionada (por defecto hoy)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Cálculos para Admin
  const pedidosPendientes = pedidos.filter(p => p.stage !== 'Entregado').length;
  const conosCriticos = conos.filter(c => c.stock <= c.minimo).length;
  
  // Producción filtrada por la fecha seleccionada
  // Convertimos selectedDate (YYYY-MM-DD) al formato local (D/M/YYYY) para comparar
  // Nota: new Date(selectedDate + "T00:00:00") previene desfases de zona horaria
  const fechaFiltroObj = new Date(selectedDate + "T00:00:00");
  const fechaFiltroStr = fechaFiltroObj.toLocaleDateString("es-PE");
  
  const produccionFiltrada = produccion.filter(p => new Date(p.fecha).toLocaleDateString("es-PE") === fechaFiltroStr);
  const prendasDia = produccionFiltrada.reduce((acc, p) => acc + p.cantidad, 0);

  // Últimas 4 actividades del día seleccionado
  const ultimasProducciones = [...produccionFiltrada].sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 4);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-light)' }}>
            Bienvenido de vuelta, <span style={{ color: 'var(--accent)' }}>{user.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            {user.role === 'admin' ? 'Resumen general de tu taller y operaciones del día.' : 'Tus métricas de trabajo y tareas.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: 'var(--text-muted)' }}>📅 Fecha:</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--accent)', 
              outline: 'none', fontSize: '0.95rem', fontWeight: 'bold', 
              fontFamily: 'inherit', colorScheme: 'dark', cursor: 'pointer'
            }}
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {user.role === 'admin' ? (
          <>
            <div 
              className="glass-panel hover-card" 
              style={{ padding: '1.5rem', borderLeft: '4px solid #27ae60', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setActiveTab && setActiveTab('production')}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Prendas (Día Sel.)</h4>
                <span style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>PRODUCCIÓN ↗</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{prendasDia} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>unidades</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Registradas en {produccionFiltrada.length} lotes de trabajo</p>
            </div>

            <div 
              className="glass-panel hover-card" 
              style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setActiveTab && setActiveTab('orders')}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Pedidos Activos</h4>
                <span style={{ background: 'rgba(200, 135, 58, 0.2)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>B2B ↗</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{pedidosPendientes}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Pedidos en curso o por entregar</p>
            </div>

            <div 
              className="glass-panel hover-card" 
              style={{ padding: '1.5rem', borderLeft: `4px solid ${conosCriticos > 0 ? '#e74c3c' : '#3498db'}`, cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setActiveTab && setActiveTab('production')}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Alerta de Stock</h4>
                <span style={{ background: conosCriticos > 0 ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)', color: conosCriticos > 0 ? '#e74c3c' : '#3498db', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  INVENTARIO ↗
                </span>
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{conosCriticos} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>conos</span></h2>
              <p style={{ color: conosCriticos > 0 ? '#e74c3c' : 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {conosCriticos > 0 ? 'Requieren reabastecimiento urgente' : 'Niveles de material saludables'}
              </p>
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

      {user.role === 'admin' && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.2rem' }}>Actividad en Planta ({fechaFiltroStr})</h3>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {ultimasProducciones.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>No hay registros de producción en esta fecha.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {ultimasProducciones.map((prod, i) => (
                  <div key={prod.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: i < ultimasProducciones.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(200, 135, 58, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {prod.cantidad}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-light)' }}>{prod.prendaTipo}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Operaria ID: {prod.empleadaId} • Cono: {prod.conoId}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(prod.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#e74c3c' }}>-{prod.totalGramos}g consumidos</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
