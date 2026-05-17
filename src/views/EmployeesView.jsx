import React, { useState } from 'react';

const EmployeesView = ({ user }) => {
  const [employees, setEmployees] = useState([
    { id: 'emp_1', name: 'Juan Perez', role: 'Tejedor', tasks: 3, dailyPay: 120.50, monthPay: 2450.00, status: 'Activo' },
    { id: 'emp_2', name: 'Maria Lopez', role: 'Remalladora', tasks: 5, dailyPay: 150.00, monthPay: 3100.00, status: 'Activo' },
    { id: 'emp_3', name: 'Carlos Ruíz', role: 'Acabados', tasks: 2, dailyPay: 90.00, monthPay: 1800.00, status: 'En Descanso' }
  ]);

  const [modalType, setModalType] = useState(null); // 'assign' or 'progress'
  const [selectedEmp, setSelectedEmp] = useState(null);

  const handleAssign = (emp) => {
    setSelectedEmp(emp);
    setModalType('assign');
  };

  const handleProgress = (emp) => {
    setSelectedEmp(emp);
    setModalType('progress');
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestión de Empleados</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Control de usuarios, tareas y pagos por destajo.</p>
        </div>
        <button className="btn-primary">+ Nuevo Empleado / Usuario</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {employees.map(emp => (
          <div key={emp.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: emp.status === 'Activo' ? '4px solid #27ae60' : '4px solid #f1c40f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: '0.2rem' }}>{emp.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>{emp.role}</span>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>{emp.status}</span>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tareas Activas</span>
                <strong>{emp.tasks}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cobro Diario (Destajo)</span>
                <strong style={{ color: '#27ae60' }}>${emp.dailyPay.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Acumulado Mes</span>
                <strong>${emp.monthPay.toFixed(2)}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={() => handleAssign(emp)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem' }}>Asignar Tarea</button>
              <button className="btn-primary" onClick={() => handleProgress(emp)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem', background: 'rgba(255,255,255,0.1)' }}>Ver Avances</button>
            </div>
          </div>
        ))}
      </div>

      {modalType === 'assign' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: '#111' }}>
            <h3>Asignar Tarea a {selectedEmp.name}</h3>
            <form style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); setModalType(null); }}>
              <select className="glass-input">
                <option>Seleccionar Pedido B2B...</option>
                <option>#1024 - Chile (Chompas)</option>
                <option>#1026 - España (Cárdigans)</option>
              </select>
              <input type="number" placeholder="Cantidad de prendas" className="glass-input" required />
              <input type="date" className="glass-input" required />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirmar</button>
                <button type="button" onClick={() => setModalType(null)} className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'progress' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', background: '#111' }}>
            <h3>Avances de {selectedEmp.name}</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Chompa Alpaca (Pedido #102{i+3})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Terminado: {i*5} de 20 unidades</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#27ae60', fontWeight: 'bold' }}>+${(i*45).toFixed(2)}</div>
                    <div style={{ fontSize: '0.7rem' }}>Pago pendiente</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setModalType(null)} className="btn-primary" style={{ marginTop: '1rem' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;
