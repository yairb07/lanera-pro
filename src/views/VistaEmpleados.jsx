import { useState } from 'react';
import { api } from '../services/clienteApi';

const VistaEmpleados = ({ empleados = [], setEmpleados }) => {
  const [tipoModal, setTipoModal] = useState(null); // 'asignar', 'progreso', 'nuevo'
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  
  const [credencialesGeneradas, setCredencialesGeneradas] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '', dni: '', rol: 'Tejedora', turno: 'Mañana', pago: 'destajo'
  });

  const manejarAsignacion = (emp) => {
    setEmpleadoSeleccionado(emp);
    setTipoModal('asignar');
  };

  const manejarProgreso = (emp) => {
    setEmpleadoSeleccionado(emp);
    setTipoModal('progreso');
  };

  const manejarAgregarEmpleado = async (e) => {
    e.preventDefault();
    if (!nuevoEmpleado.dni || nuevoEmpleado.dni.length < 8) {
      alert("El DNI debe tener al menos 8 caracteres.");
      return;
    }
    try {
      const data = await api.post('/api/empleados', {
        full_name: nuevoEmpleado.nombre,
        dni: nuevoEmpleado.dni,
        job_role: nuevoEmpleado.rol,
        shift: nuevoEmpleado.turno,
        payment_type: nuevoEmpleado.pago,
        base_amount: 0
      });
      
      const empleadoMapeado = {
        id: data.empleado.id,
        nombre: data.empleado.full_name,
        rol: data.empleado.job_role,
        turno: data.empleado.shift,
        pago: data.empleado.payment_type === 'salary' ? 'sueldo' : 'destajo',
        monto: Number(data.empleado.base_amount),
        estado: data.empleado.status === 'active' ? 'activo' : 'inactivo',
        prendas: 0,
        tareas: 0
      };

      if (setEmpleados) {
        setEmpleados([...empleados, empleadoMapeado]);
      }
      
      setCredencialesGeneradas({
        usuario: data.credenciales.usuario,
        password: data.credenciales.password,
        nombre: data.empleado.full_name
      });
      
      setTipoModal('credenciales');
      setNuevoEmpleado({ nombre: '', dni: '', rol: 'Tejedora', turno: 'Mañana', pago: 'destajo' });
    } catch (err) {
      alert("Error al crear empleado: " + err.message);
    }
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
          <div key={emp.id || index} className="glass-panel" style={{ padding: '1.5rem', borderLeft: (emp.estado === 'activo' || emp.status === 'Activo') ? '4px solid var(--accent)' : '4px solid #f1c40f' }}>
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
                <strong style={{ color: 'var(--accent)' }}>{emp.prendas || 0} prendas</strong>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '4rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '450px', flexShrink: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Asignar Tarea a {empleadoSeleccionado.nombre}</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={manejarAsignarTarea}>
              <select className="glass-input">
                <option>Seleccionar tarea de produccion...</option>
                <option>Tejido de chompas</option>
                <option>Acabado de cardigans</option>
              </select>
              <input type="number" placeholder="Cantidad de prendas" className="glass-input" required />
              <input type="date" className="glass-input" required />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setTipoModal(null)} className="nav-item" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tipoModal === 'progreso' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '4rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', flexShrink: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Avances de {empleadoSeleccionado.nombre}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Chompa Alpaca</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Terminado: {i*5} de 20 unidades</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>+${(i*45).toFixed(2)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pago pendiente</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setTipoModal(null)} className="btn-primary" style={{ marginTop: '0.5rem' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {tipoModal === 'nuevo' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '4rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '450px', flexShrink: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Nuevo Empleado</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={manejarAgregarEmpleado}>
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="glass-input" 
                value={nuevoEmpleado.nombre}
                onChange={e => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="DNI / Documento" 
                className="glass-input" 
                value={nuevoEmpleado.dni}
                onChange={e => setNuevoEmpleado({...nuevoEmpleado, dni: e.target.value})}
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
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setTipoModal(null)} className="nav-item" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tipoModal === 'credenciales' && credencialesGeneradas && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '4rem 1rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '450px', textAlign: 'center', flexShrink: 0 }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Empleado Creado</h2>
            <p style={{ color: 'var(--text-muted)' }}>Comparte estas credenciales con <strong>{credencialesGeneradas.nombre}</strong> para que ingrese al sistema.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1.2rem' }}>
              <div>Usuario: <strong style={{ color: 'var(--accent)' }}>{credencialesGeneradas.usuario}</strong></div>
              <div style={{ marginTop: '0.5rem' }}>Clave: <strong style={{ color: 'var(--accent)' }}>{credencialesGeneradas.password}</strong></div>
            </div>

            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Hola ${credencialesGeneradas.nombre}, estas son tus credenciales para el sistema del Taller Textil.\n\nUsuario: *${credencialesGeneradas.usuario}*\nContraseña: *${credencialesGeneradas.password}*\n\n¡Bienvenido!`)}`}
              target="_blank" rel="noreferrer"
              className="btn-primary" 
              style={{ display: 'block', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '1rem', fontWeight: 'bold' }}
              onClick={() => setTipoModal(null)}
            >
              Enviar por WhatsApp
            </a>
            
            <button onClick={() => setTipoModal(null)} className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: 'transparent', border: '1px solid var(--glass-border)' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaEmpleados;
