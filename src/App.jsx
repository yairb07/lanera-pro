import { useState, useEffect } from 'react';
import './index.css';

// Vistas
import VistaPanel from './views/VistaPanel';
import VistaEmpleados from './views/VistaEmpleados';
import VistaAcceso from './views/VistaAcceso';
import VistaPrendas from './views/VistaPrendas';
import VistaProduccion from './views/VistaProduccion';
import VistaKardex from './views/VistaKardex';
import VistaConfiguraciones from './views/VistaConfiguraciones';

// Hooks (Controladores)
import { useDatosApp } from './hooks/useDatosApp';
import { useConsultaMedios } from './hooks/useConsultaMedios';
import { api } from './services/clienteApi';

// Iconos
const Iconos = {
  Panel: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Usuarios: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Paquete: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.27 6.96 8.73 5.04 8.73-5.04"></path><path d="M12 22.08V12"></path></svg>,
  Kardex: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  Camara: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
  Dinero: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Salir: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Configuracion: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Fabrica: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>
};

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('panel');
  const [notificacion, setNotificacion] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const guardado = localStorage.getItem('taller_sesion');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [barraLateralColapsada, setBarraLateralColapsada] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [temaActual, setTemaActual] = useState(() => {
    return localStorage.getItem('taller_tema') || 'default';
  });
  const esMovil = useConsultaMedios('(max-width: 767px)');
  const menuMovilAbierto = esMovil && !barraLateralColapsada;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaActual);
    localStorage.setItem('taller_tema', temaActual);
  }, [temaActual]);

  useEffect(() => {
    if (!menuMovilAbierto) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuMovilAbierto]);

  useEffect(() => {
    if (!menuUsuarioAbierto) return;

    const cerrarAlClickExterno = (event) => {
      if (!event.target.closest('.user-menu-wrap')) {
        setMenuUsuarioAbierto(false);
      }
    };

    document.addEventListener('click', cerrarAlClickExterno);
    return () => document.removeEventListener('click', cerrarAlClickExterno);
  }, [menuUsuarioAbierto]);

  const cerrarMenuMovil = () => {
    if (esMovil) setBarraLateralColapsada(true);
  };

  const abrirMenuMovil = () => {
    if (esMovil) setBarraLateralColapsada(false);
  };

  const { conos, setConos, produccion, setProduccion, empleados, setEmpleados, prendas, setPrendas, categoriasPrendas, setCategoriasPrendas, rolesEmpleados, setRolesEmpleados } = useDatosApp();

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const manejarAcceso = (usuario) => {
    setUsuarioActual(usuario);
    localStorage.setItem('taller_sesion', JSON.stringify(usuario));
    setPestanaActiva('panel');
    mostrarNotificacion(`Bienvenido, ${usuario.name || usuario.nombre}`);
  };

  const manejarSalida = async () => {
    setMenuUsuarioAbierto(false);
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      // La sesión local se limpia aunque falle el servidor
    }
    setUsuarioActual(null);
    localStorage.removeItem('taller_sesion');
    mostrarNotificacion('Sesión cerrada correctamente');
  };

  const irAConfiguracion = () => {
    setPestanaActiva('configuracion');
    setMenuUsuarioAbierto(false);
    cerrarMenuMovil();
  };

  const etiquetaRol = (role) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'employee') return 'Empleado';
    return role || 'Usuario';
  };

  const inicialesUsuario = (nombre) => {
    const partes = (nombre || 'U').trim().split(/\s+/);
    return partes.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'U';
  };

  if (!usuarioActual) {
    return <VistaAcceso onLogin={manejarAcceso} />;
  }

  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'panel': return <VistaPanel usuario={usuarioActual} produccion={produccion} conos={conos} setPestanaActiva={setPestanaActiva} />;
      case 'empleados': return <VistaEmpleados usuario={usuarioActual} empleados={empleados} setEmpleados={setEmpleados} roles={rolesEmpleados} setRoles={setRolesEmpleados} />;;
      case 'prendas': return <VistaPrendas prendas={prendas} setPrendas={setPrendas} categorias={categoriasPrendas} setCategorias={setCategoriasPrendas} />;
      case 'produccion': return <VistaProduccion usuarioActual={usuarioActual} conos={conos} setConos={setConos} produccion={produccion} setProduccion={setProduccion} empleados={empleados} prendas={prendas} />;
      case 'kardex': return <VistaKardex conos={conos} setConos={setConos} />;
      case 'configuracion': return <VistaConfiguraciones usuario={usuarioActual} onNotificar={mostrarNotificacion} temaActual={temaActual} cambiarTema={setTemaActual} />;
      default: return <VistaPanel usuario={usuarioActual} produccion={produccion} conos={conos} setPestanaActiva={setPestanaActiva} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      {menuMovilAbierto && (
        <div
          className="sidebar-overlay"
          onClick={cerrarMenuMovil}
          aria-hidden="true"
        />
      )}

      {(!esMovil || menuMovilAbierto) && (
      <nav
        className={esMovil ? 'sidebar-drawer' : 'glass-panel'}
        style={{
          width: esMovil ? 260 : (barraLateralColapsada ? 80 : 260),
          flexShrink: 0,
          position: esMovil ? 'fixed' : 'relative',
          zIndex: esMovil ? 1000 : 100,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: esMovil ? 'transform 0.25s ease' : 'width 0.25s',
          padding: !esMovil && barraLateralColapsada ? '2rem 1rem' : '2rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          {!barraLateralColapsada && <h2 style={{ color: 'var(--accent)', margin: 0, fontWeight: '800' }}>TALLER TEXTIL</h2>}
          <button 
            onClick={() => esMovil ? cerrarMenuMovil() : setBarraLateralColapsada(!barraLateralColapsada)}
            style={{ 
              background: 'var(--accent-soft)', border: 'none', color: 'var(--accent)', 
              borderRadius: '8px', cursor: 'pointer', padding: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: barraLateralColapsada ? '0 auto' : '0'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {barraLateralColapsada ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`nav-item ${pestanaActiva === 'panel' ? 'active' : ''}`} onClick={() => { setPestanaActiva('panel'); cerrarMenuMovil(); }}>
            <Iconos.Panel /> {!barraLateralColapsada && <span className="nav-text">Panel Control</span>}
          </div>
          
          {usuarioActual.role === 'admin' && (
            <>
              <div className={`nav-item ${pestanaActiva === 'empleados' ? 'active' : ''}`} onClick={() => { setPestanaActiva('empleados'); cerrarMenuMovil(); }}>
                <Iconos.Usuarios /> {!barraLateralColapsada && <span className="nav-text">Empleados</span>}
              </div>
              <div className={`nav-item ${pestanaActiva === 'prendas' ? 'active' : ''}`} onClick={() => { setPestanaActiva('prendas'); cerrarMenuMovil(); }}>
                <Iconos.Paquete /> {!barraLateralColapsada && <span className="nav-text">Prendas</span>}
              </div>
            </>
          )}

          <div className={`nav-item ${pestanaActiva === 'produccion' ? 'active' : ''}`} onClick={() => { setPestanaActiva('produccion'); cerrarMenuMovil(); }}>
            <Iconos.Fabrica /> {!barraLateralColapsada && <span className="nav-text">Producción</span>}
          </div>

          {usuarioActual.role === 'admin' && (
            <div className={`nav-item ${pestanaActiva === 'kardex' ? 'active' : ''}`} onClick={() => { setPestanaActiva('kardex'); cerrarMenuMovil(); }}>
              <Iconos.Kardex /> {!barraLateralColapsada && <span className="nav-text">Kardex Conos</span>}
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className={`user-menu-wrap ${!esMovil && barraLateralColapsada ? 'collapsed' : ''}`}>
            <button
              type="button"
              className={`user-menu-trigger ${menuUsuarioAbierto ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setMenuUsuarioAbierto(!menuUsuarioAbierto);
              }}
              aria-expanded={menuUsuarioAbierto}
              aria-haspopup="true"
            >
              <span className="user-menu-avatar">
                {inicialesUsuario(usuarioActual.name || usuarioActual.nombre)}
              </span>
              {(!barraLateralColapsada || esMovil) && (
                <span className="user-menu-meta">
                  <span className="user-menu-name">{usuarioActual.name || usuarioActual.nombre}</span>
                  <span className="user-menu-role">{etiquetaRol(usuarioActual.role || usuarioActual.rol)}</span>
                </span>
              )}
              {(!barraLateralColapsada || esMovil) && (
                <svg className="user-menu-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>

            {menuUsuarioAbierto && (
              <div className="user-menu-dropdown" role="menu">
                <button type="button" className="user-menu-item" role="menuitem" onClick={irAConfiguracion}>
                  <Iconos.Configuracion />
                  <span>Ajustes</span>
                </button>
                <button type="button" className="user-menu-item user-menu-logout" role="menuitem" onClick={manejarSalida}>
                  <Iconos.Salir />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      )}

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: esMovil ? "100%" : "auto",
        minWidth: 0,
      }}>
        {/* TOPBAR EN MÓVIL PARA ABRIR SIDEBAR */}
        {esMovil && (
          <div style={{ display: 'flex', padding: '12px', background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center' }}>
            <button 
              onClick={abrirMenuMovil}
              aria-label="Abrir menú"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 style={{ color: 'var(--accent)', margin: '0 0 0 1rem', fontSize: '1.2rem', fontWeight: '800' }}>TALLER TEXTIL</h2>
          </div>
        )}

        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: esMovil ? "12px" : "2rem",
          WebkitOverflowScrolling: "touch",
        }}>
          {notificacion && (
            <div className="animate-fade" style={{
              position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--accent)',
              color: 'white', padding: '1rem 2rem', borderRadius: '8px', zIndex: 2000,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: '600'
            }}>
              {notificacion}
            </div>
          )}
          {renderizarContenido()}
        </div>
      </main>
    </div>
  );
}

export default App;
