import { useState } from 'react';

const VistaEmpleados = ({ empleados = [], setEmpleados }) => {
  const [tipoModal, setTipoModal] = useState(null); // 'asignar', 'progreso', 'nuevo'
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '', rol: 'Tejedora', turno: 'Mañana', pago: 'destajo'
  });

  const manejarAsignacion = (emp) => {
    setEmpleadoSeleccionado(emp);
    setTipoModal('asignar');
  };

  const manejarProgreso = (emp) => {
    setEmpleadoSeleccionado(emp);
    setTipoModal('progreso');
  };

  const manejarAgregarEmpleado = (e) => {
    e.preventDefault();
    const empleado = {
      id: `emp_${Date.now()}`,
      nombre: nuevoEmpleado.nombre,
      rol: nuevoEmpleado.rol,
      turno: nuevoEmpleado.turno,
      pago: nuevoEmpleado.pago,
      prendas: 0,
      monto: 0,
      estado: 'activo',
      tareas: 0
    };
    if (setEmpleados) {
      setEmpleados([...empleados, empleado]);
    }
    setTipoModal(null);
    setNuevoEmpleado({ nombre: '', rol: 'Tejedora', turno: 'Mañana', pago: 'destajo' });
  };

  const manejarAsignarTarea = (e) => {
    e.preventDefault();
    if (setEmpleados && empleadoSeleccionado) {
      const empleadosActualizados = empleados.map(emp => {
        if (emp.id === empleadoSeleccionado.id) {
          return { ...emp, tareas: (emp.tareas || 0) + 1 };
        }
        return emp;
      });
      setEmpleados(empleadosActualizados);
    }
    setTipoModal(null);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestión de Empleados</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Control de usuarios, tareas y pagos por destajo.</p>
        </div>
        <button className="btn-primary" onClick={() => setTipoModal('nuevo')}>+ Nuevo Empleado / Usuario</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {(Array.isArray(empleados) ? empleados : []).filter(e => e).map((emp, index) => (
          <div key={emp.id || index} className="glass-panel" style={{ padding: '1.5rem', borderLeft: (emp.estado === 'activo' || emp.status === 'Activo') ? '4px solid #27ae60' : '4px solid #f1c40f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: '0.2rem' }}>{emp.nombre}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>{emp.rol}</span>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>{emp.estado}</span>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tareas Activas</span>
                <strong>{emp.tareas || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Producción Registrada</span>
                <strong style={{ color: '#27ae60' }}>{emp.prendas || 0} prendas</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ganancia Mes ({emp.pago})</span>
                <strong>${emp.monto || 0}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={() => manejarAsignacion(emp)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem' }}>Asignar Tarea</button>
              <button className="btn-primary" onClick={() => manejarProgreso(emp)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem', background: 'rgba(255,255,255,0.1)' }}>Ver Avances</button>
            </div>
          </div>
        ))}
      </div>

      {tipoModal === 'asignar' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: '#111' }}>
            <h3>Asignar Tarea a {empleadoSeleccionado.nombre}</h3>
            <form style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={manejarAsignarTarea}>
              <select className="glass-input">
                <option>Seleccionar tarea de produccion...</option>
                <option>Tejido de chompas</option>
                <option>Acabado de cardigans</option>
              </select>
              <input type="number" placeholder="Cantidad de prendas" className="glass-input" required />
              <input type="date" className="glass-input" required />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirmar</button>
                <button type="button" onClick={() => setTipoModal(null)} className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tipoModal === 'progreso' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', background: '#111' }}>
            <h3>Avances de {empleadoSeleccionado.nombre}</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Chompa Alpaca</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Terminado: {i*5} de 20 unidades</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#27ae60', fontWeight: 'bold' }}>+${(i*45).toFixed(2)}</div>
                    <div style={{ fontSize: '0.7rem' }}>Pago pendiente</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setTipoModal(null)} className="btn-primary" style={{ marginTop: '1rem' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {tipoModal === 'nuevo' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: '#111' }}>
            <h3>Nuevo Empleado</h3>
            <form style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={manejarAgregarEmpleado}>
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="glass-input" 
                value={nuevoEmpleado.nombre}
                onChange={e => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})}
                required 
              />
              <select className="glass-input" value={nuevoEmpleado.rol} onChange={e => setNuevoEmpleado({...nuevoEmpleado, rol: e.target.value})}>
                <option value="Tejedora">Tejedora</option>
                <option value="Remalladora">Remalladora</option>
                <option value="Acabados">Acabados</option>
                <option value="Supervisor">Supervisor</option>
              </select>
              <select className="glass-input" value={nuevoEmpleado.turno} onChange={e => setNuevoEmpleado({...nuevoEmpleado, turno: e.target.value})}>
                <option value="Mañana">Turno Mañana</option>
                <option value="Tarde">Turno Tarde</option>
                <option value="Noche">Turno Noche</option>
              </select>
              <select className="glass-input" value={nuevoEmpleado.pago} onChange={e => setNuevoEmpleado({...nuevoEmpleado, pago: e.target.value})}>
                <option value="destajo">Pago a Destajo</option>
                <option value="sueldo">Sueldo Fijo</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                <button type="button" onClick={() => setTipoModal(null)} className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaEmpleados;
