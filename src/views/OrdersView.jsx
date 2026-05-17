import React, { useState } from 'react';

function HistorialPedido({ historial = [] }) {
  const estadoColors = {
    'Cotización': "#5BA3D4",
    'Confirmado':  "#8B7FD4",
    'En producción':  "#E8A23A",
    'Listo para envío':       "#4CAF82",
    'Enviado':     "#888",
  };

  const estadoLabels = {
    'Cotización': "Cotización enviada",
    'Confirmado':  "Pedido confirmado",
    'En producción':  "En producción",
    'Listo para envío':       "Listo para envío",
    'Enviado':     "Enviado",
  };

  if (!historial.length) return (
    <div style={{ color:"#888", fontSize:12, padding:"12px 0", fontFamily:"monospace" }}>
      Sin historial registrado
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {historial.map((ev, i) => {
        const color = estadoColors[ev.estado] || "#888";
        const fecha = new Date(ev.fecha);
        const fechaStr = fecha.toLocaleDateString("es-PE", {
          day:"2-digit", month:"short", year:"numeric"
        });
        const horaStr = fecha.toLocaleTimeString("es-PE", {
          hour:"2-digit", minute:"2-digit"
        });

        return (
          <div key={i} style={{ display:"flex", gap:12, paddingBottom:16, position:"relative" }}>
            {/* Línea vertical */}
            {i < historial.length - 1 && (
              <div style={{
                position:"absolute", left:10, top:20,
                width:1, height:"100%",
                background:"rgba(255,255,255,0.08)"
              }} />
            )}
            {/* Punto */}
            <div style={{
              width:20, height:20, borderRadius:"50%",
              background: color + "22",
              border: `2px solid ${color}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, marginTop:2, zIndex:1
            }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:color }} />
            </div>
            {/* Contenido */}
            <div style={{ flex:1 }}>
              <div style={{
                fontSize:12, fontWeight:600, color,
                fontFamily:"monospace", marginBottom:2
              }}>
                {estadoLabels[ev.estado] || ev.estado}
              </div>
              {ev.nota && (
                <div style={{
                  fontSize:11, color:"rgba(240,237,232,0.6)",
                  marginBottom:3
                }}>
                  {ev.nota}
                </div>
              )}
              <div style={{
                fontSize:10, color:"rgba(240,237,232,0.3)",
                fontFamily:"monospace"
              }}>
                👤 {ev.usuario} · 📅 {fechaStr} {horaStr}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


const OrdersView = ({ user, orders, setOrders }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ id: '', country: '', value: '', deadline: '', stage: 'Cotización' });
  const [modalNota, setModalNota] = useState(null);
  const [nota, setNota] = useState("");

  const moverEstado = (pedidoId, nuevoEstado, notaStr = "") => {
    const ahora = new Date().toISOString();
    const usuario = user.name + (user.role === 'admin' ? ' (admin)' : ' (empleado)');

    setOrders(orders.map(p => {
      if (p.id !== pedidoId) return p;
      
      const nuevoEvento = {
        fecha: ahora,
        estadoAnterior: p.stage,
        estado: nuevoEstado,
        usuario: usuario,
        nota: notaStr || `Movido a ${nuevoEstado}`
      };

      return {
        ...p,
        stage: nuevoEstado,
        historial: [...(p.historial || []), nuevoEvento]
      };
    }));
  };

  // Filter if user is employee
  const displayOrders = user.role === 'admin' ? orders : orders.filter(o => o.assignedTo === user.id);

  const stats = {
    total: orders.length,
    production: orders.filter(o => o.stage === 'En producción').length,
    pending: orders.filter(o => o.stage === 'Confirmado').length
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      const isStatusChanged = orders.find(o => o.id === editingOrder.id)?.stage !== editingOrder.stage;
      if(isStatusChanged) {
        moverEstado(editingOrder.id, editingOrder.stage, "Cambiado desde edición general");
      }
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...editingOrder, historial: o.historial } : o));
    } else {
      const nuevoId = Math.floor(1000 + Math.random() * 9000).toString();
      const nuevoPedido = { 
        ...newOrder, 
        id: nuevoId, 
        assignedTo: 'admin',
        historial: [{
          fecha: new Date().toISOString(),
          estado: newOrder.stage,
          usuario: user.name + ' (admin)',
          nota: 'Pedido creado'
        }]
      };
      setOrders([...orders, nuevoPedido]);
    }
    setShowModal(false);
    setEditingOrder(null);
    setNewOrder({ id: '', country: '', value: '', deadline: '', stage: 'Cotización' });
  };

  const startEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{user.role === 'admin' ? 'Gestión de Pedidos' : 'Mis Tareas Asignadas'}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {user.role === 'admin' ? 'Control global de exportación y producción.' : 'Tareas asignadas para hoy.'}
          </p>
        </div>
        {user.role === 'admin' && (
          <button className="btn-primary" onClick={() => { setEditingOrder(null); setShowModal(true); }}>
            + Nuevo Pedido B2B
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {user.role === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pedidos</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>En Producción</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.production}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #27ae60' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Por Confirmar</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>{stats.pending}</div>
          </div>
        </div>
      )}
      
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th>Cliente / País</th>
              <th>Fecha Entrega</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }} className="hover-row">
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{o.id}</td>
                <td>{o.country}</td>
                <td style={{ color: o.stage === 'Listo para envío' ? '#27ae60' : 'var(--accent)', fontWeight: '500' }}>{o.deadline}</td>
                <td>
                  <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ 
                      width: o.stage === 'Listo para envío' ? '100%' : '60%', 
                      height: '100%', background: 'var(--accent)', borderRadius: '4px', boxShadow: '0 0 10px var(--accent)' 
                    }}></div>
                  </div>
                </td>
                <td>
                  <span 
                    title="Cambiar estado"
                    style={{ 
                      padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', 
                      background: o.stage === 'En producción' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255,255,255,0.1)',
                      color: o.stage === 'En producción' ? '#3498db' : 'white',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}
                    onClick={() => {
                      const estados = ['Cotización', 'Confirmado', 'En producción', 'Listo para envío'];
                      const currentIdx = estados.indexOf(o.stage);
                      const nextState = estados[(currentIdx + 1) % estados.length] || 'Cotización';
                      setModalNota({ pedidoId: o.id, nuevoEstado: nextState, actual: o.stage });
                      setNota("");
                    }}
                  >
                    {o.stage} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  </span>
                </td>
                <td>
                  {user.role === 'admin' ? (
                    <button className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => startEdit(o)}>
                      Editar
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}>Registrar Avance</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: '#111' }}>
            <h2>{editingOrder ? `Editar Pedido #${editingOrder.id}` : 'Nuevo Pedido B2B'}</h2>
            <form onSubmit={handleAddOrEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <input 
                type="text" placeholder="País / Cliente" required className="glass-input" 
                value={editingOrder ? editingOrder.country : newOrder.country} 
                onChange={e => editingOrder ? setEditingOrder({...editingOrder, country: e.target.value}) : setNewOrder({...newOrder, country: e.target.value})} 
              />
              <input 
                type="number" placeholder="Valor Total ($)" required className="glass-input" 
                value={editingOrder ? editingOrder.value : newOrder.value} 
                onChange={e => editingOrder ? setEditingOrder({...editingOrder, value: e.target.value}) : setNewOrder({...newOrder, value: e.target.value})} 
              />
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estado del Pedido:</label>
                <select 
                  className="glass-input" style={{ marginTop: '0.5rem' }}
                  value={editingOrder ? editingOrder.stage : newOrder.stage}
                  onChange={e => editingOrder ? setEditingOrder({...editingOrder, stage: e.target.value}) : setNewOrder({...newOrder, stage: e.target.value})}
                >
                  <option>Cotización</option>
                  <option>Confirmado</option>
                  <option>En producción</option>
                  <option>Listo para envío</option>
                </select>
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha de Entrega:</label>
                <input 
                  type="date" required className="glass-input" style={{ marginTop: '0.5rem' }} 
                  value={editingOrder ? editingOrder.deadline : newOrder.deadline} 
                  onChange={e => editingOrder ? setEditingOrder({...editingOrder, deadline: e.target.value}) : setNewOrder({...newOrder, deadline: e.target.value})} 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingOrder ? 'Guardar Cambios' : 'Crear Pedido'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancelar</button>
              </div>
            </form>

            {editingOrder && (
              <div style={{
                marginTop:16,
                paddingTop:16,
                borderTop:"0.5px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{
                  fontSize:10, color:"rgba(240,237,232,0.3)",
                  textTransform:"uppercase", letterSpacing:2,
                  fontFamily:"monospace", marginBottom:12
                }}>
                  📋 Historial de cambios
                </div>
                <HistorialPedido historial={editingOrder.historial} />
              </div>
            )}
          </div>
        </div>
      )}
      {modalNota && (
        <div onClick={()=>setModalNota(null)} style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(6px)"
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"rgba(20,22,30,0.97)",
            border:"0.5px solid rgba(255,255,255,0.12)",
            borderRadius:14, padding:24, width:360
          }}>
            <div style={{ fontSize:14, color:"#F0EDE8", marginBottom:6 }}>
              Cambiar estado del pedido
            </div>
            <div style={{ fontSize:11, color:"#888", marginBottom:16, fontFamily:"monospace" }}>
              {modalNota.actual} → {modalNota.nuevoEstado}
            </div>
            
            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>
                    Seleccionar Estado
                </label>
                <select 
                    className="glass-input" 
                    value={modalNota.nuevoEstado}
                    onChange={e => setModalNota({...modalNota, nuevoEstado: e.target.value})}
                    style={{ width: '100%', padding: '8px', fontSize: 12, marginTop: '4px' }}
                >
                    <option value="Cotización">Cotización</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="En producción">En producción</option>
                    <option value="Listo para envío">Listo para envío</option>
                </select>
            </div>

            <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>
              Nota (opcional)
            </label>
            <input
              autoFocus
              placeholder="Ej: Cliente confirmó colores, adelanto recibido..."
              value={nota}
              onChange={e=>setNota(e.target.value)}
              style={{
                width:"100%", padding:"8px 10px",
                background:"rgba(255,255,255,0.04)",
                border:"0.5px solid rgba(255,255,255,0.1)",
                borderRadius:7, color:"#F0EDE8",
                fontSize:12, outline:"none",
                fontFamily:"monospace", boxSizing:"border-box"
              }}
            />
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
              <button onClick={()=>setModalNota(null)} style={{
                padding:"7px 14px", borderRadius:8,
                border:"0.5px solid rgba(255,255,255,0.1)",
                background:"transparent", color:"#888", cursor:"pointer"
              }}>
                Cancelar
              </button>
              <button onClick={()=>{
                moverEstado(modalNota.pedidoId, modalNota.nuevoEstado, nota);
                setModalNota(null);
              }} style={{
                padding:"7px 14px", borderRadius:8,
                background:"#C8873A", color:"#fff",
                border:"none", cursor:"pointer", fontWeight:500
              }}>
                ✓ Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersView;
