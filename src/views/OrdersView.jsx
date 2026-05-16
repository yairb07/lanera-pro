import React, { useState } from 'react';

const OrdersView = ({ user, orders, setOrders }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ id: '', country: '', value: '', deadline: '', stage: 'Cotización' });

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
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...editingOrder } : o));
    } else {
      setOrders([...orders, { ...newOrder, id: Math.floor(1000 + Math.random() * 9000).toString(), assignedTo: 'admin' }]);
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
                  <span style={{ 
                    padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', 
                    background: o.stage === 'En producción' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: o.stage === 'En producción' ? '#3498db' : 'white'
                  }}>
                    {o.stage}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
