import { useState, useEffect } from 'react';
import CampoContrasena from '../components/CampoContrasena';
import { api } from '../services/clienteApi';

const etiquetaRol = (role) => {
  if (role === 'admin') return 'Administrador';
  if (role === 'employee') return 'Empleado';
  return role || 'Usuario';
};

const VistaConfiguraciones = ({ usuario, onNotificar, temaActual, cambiarTema }) => {
  const [tabActiva, setTabActiva] = useState('cuenta'); // 'cuenta' | 'apariencia' | 'privacidad'
  
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [visibilidad, setVisibilidad] = useState('todos');
  const [cargandoAjustes, setCargandoAjustes] = useState(false);
  const [guardandoAjustes, setGuardandoAjustes] = useState(false);

  const role = usuario.role || usuario.rol;

  useEffect(() => {
    if (role === 'admin') {
      const cargarAjustes = async () => {
        setCargandoAjustes(true);
        try {
          const datos = await api.get('/api/ajustes');
          if (datos.visibilidad_empleados) {
            setVisibilidad(datos.visibilidad_empleados);
          }
        } catch (err) {
          console.error('Error al cargar ajustes', err);
        } finally {
          setCargandoAjustes(false);
        }
      };
      cargarAjustes();
    }
  }, [role]);

  const manejarGuardarAjustes = async (e) => {
    e.preventDefault();
    setGuardandoAjustes(true);
    try {
      await api.patch('/api/ajustes', {
        clave: 'visibilidad_empleados',
        valor: visibilidad
      });
      onNotificar?.('Ajustes de visibilidad actualizados.');
    } catch (err) {
      alert('Error al guardar ajustes: ' + err.message);
    } finally {
      setGuardandoAjustes(false);
    }
  };

  const manejarCambioContrasena = async (e) => {
    e.preventDefault();
    setError('');

    if (nueva !== confirmar) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    if (nueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      const res = await api.post('/api/auth/password', {
        oldPassword: actual,
        newPassword: nueva,
      });
      setActual('');
      setNueva('');
      setConfirmar('');
      onNotificar?.(res.message || 'Contraseña actualizada correctamente.');
    } catch (err) {
      setError(err.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setEnviando(false);
    }
  };

  const nombre = usuario.name || usuario.nombre || usuario.full_name || '—';
  const username = usuario.username || '—';

  const TEMAS = [
    { id: 'default', nombre: 'Oscuro Taller', color: '#1a1a1a', accent: '#e67e22' },
    { id: 'google', nombre: 'Google Cloud', color: '#f8f9fa', accent: '#1a73e8' },
    { id: 'rappi', nombre: 'Rappi Neón', color: '#f9f9f9', accent: '#FF441F' },
    { id: 'uber', nombre: 'Uber Black', color: '#ffffff', accent: '#000000' },
    { id: 'claro', nombre: 'Claro Rojo', color: '#f4f4f4', accent: '#DA291C' }
  ];

  return (
    <div className="animate-fade" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Ajustes</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Administra tu perfil, la seguridad y la apariencia de tu sistema.
      </p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setTabActiva('cuenta')}
          style={{
            background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 'bold', transition: 'all 0.2s',
            color: tabActiva === 'cuenta' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: tabActiva === 'cuenta' ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-0.5rem'
          }}
        >
          Cuenta y Seguridad
        </button>
        <button 
          onClick={() => setTabActiva('apariencia')}
          style={{
            background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 'bold', transition: 'all 0.2s',
            color: tabActiva === 'apariencia' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: tabActiva === 'apariencia' ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-0.5rem'
          }}
        >
          Apariencia
        </button>
        {role === 'admin' && (
          <button 
            onClick={() => setTabActiva('privacidad')}
            style={{
              background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
              fontSize: '1rem', fontWeight: 'bold', transition: 'all 0.2s',
              color: tabActiva === 'privacidad' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tabActiva === 'privacidad' ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-0.5rem'
            }}
          >
            Privacidad / Permisos
          </button>
        )}
      </div>

      {tabActiva === 'cuenta' && (
        <div className="animate-fade">
          <section className="glass-panel config-section">
            <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Mi perfil</h2>
            <div className="config-grid">
              <div className="config-field">
                <span className="config-label">Nombre completo</span>
                <span className="config-value">{nombre}</span>
              </div>
              <div className="config-field">
                <span className="config-label">Usuario</span>
                <span className="config-value">{username}</span>
              </div>
              <div className="config-field">
                <span className="config-label">Rol</span>
                <span className="config-value config-badge">{etiquetaRol(role)}</span>
              </div>
            </div>
          </section>

          <section className="glass-panel config-section" style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Seguridad</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Usa una contraseña de al menos 8 caracteres. No compartas tus credenciales.
            </p>

            <form onSubmit={manejarCambioContrasena} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CampoContrasena
                id="password-actual"
                label="Contraseña actual"
                placeholder="Ingrese su contraseña actual"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
              />
              <CampoContrasena
                id="password-nueva"
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
              />
              <CampoContrasena
                id="password-confirmar"
                label="Confirmar nueva contraseña"
                placeholder="Repita la nueva contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />

              {error && (
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={enviando}
                style={{ marginTop: '0.5rem', opacity: enviando ? 0.7 : 1 }}
              >
                {enviando ? 'Guardando…' : 'Actualizar contraseña'}
              </button>
            </form>
          </section>
        </div>
      )}

      {tabActiva === 'apariencia' && (
        <div className="animate-fade">
          <section className="glass-panel config-section">
            <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Temas Visuales</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Elige la paleta de colores y el estilo que prefieras para el sistema. Este cambio se aplica instantáneamente y solo afecta a tu dispositivo.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {TEMAS.map((tema) => (
                <div 
                  key={tema.id}
                  onClick={() => cambiarTema(tema.id)}
                  style={{
                    padding: '1rem', borderRadius: '12px', border: temaActual === tema.id ? `2px solid var(--accent)` : '1px solid var(--glass-border)',
                    background: tema.color, cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: temaActual === tema.id ? `0 0 0 4px var(--accent-soft)` : 'none',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: tema.accent, flexShrink: 0 }}></div>
                    <span style={{ fontWeight: 'bold', color: tema.id === 'default' ? '#fff' : '#000', fontSize: '0.95rem' }}>
                      {tema.nombre}
                    </span>
                  </div>
                  {temaActual === tema.id && (
                    <span style={{ color: tema.accent, fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.2rem' }}>
                      Tema Activo ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tabActiva === 'privacidad' && role === 'admin' && (
        <div className="animate-fade">
          <section className="glass-panel config-section">
            <h2 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Visibilidad del Catálogo</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Define qué tipos de prendas/diseños pueden ver los empleados en su catálogo de prendas. El administrador siempre tiene acceso a todo.
            </p>

            {cargandoAjustes ? (
              <p style={{ color: 'var(--text-muted)' }}>Cargando ajustes...</p>
            ) : (
              <form onSubmit={manejarGuardarAjustes} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="radio" 
                      name="visibilidad" 
                      value="todos" 
                      checked={visibilidad === 'todos'} 
                      onChange={e => setVisibilidad(e.target.value)}
                    />
                    <span>Mostrar todos los diseños (Computarizados y Manuales)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="radio" 
                      name="visibilidad" 
                      value="manuales" 
                      checked={visibilidad === 'manuales'} 
                      onChange={e => setVisibilidad(e.target.value)}
                    />
                    <span>Solo mostrar diseños Manuales / Artesanales</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="radio" 
                      name="visibilidad" 
                      value="computarizadas" 
                      checked={visibilidad === 'computarizadas'} 
                      onChange={e => setVisibilidad(e.target.value)}
                    />
                    <span>Solo mostrar diseños Computarizados (HQPDS)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={guardandoAjustes}
                  style={{ opacity: guardandoAjustes ? 0.7 : 1, alignSelf: 'flex-start' }}
                >
                  {guardandoAjustes ? 'Guardando...' : 'Guardar Preferencia'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default VistaConfiguraciones;
