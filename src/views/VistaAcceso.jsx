import { useState } from 'react';
import { api } from '../services/clienteApi';

const IconoOjo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconoOjoOculto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M1 1l22 22" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

const VistaAcceso = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { username: usuario, password: contrasena });
      if (res.user) {
        onLogin(res.user);
      }
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o error de conexión.');
    }
  };

  return (
    <div className="login-container" style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-gradient)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.15 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: '#3498db', filter: 'blur(150px)', opacity: 0.1 }} />

      <div className="glass-panel animate-fade" style={{ padding: '3rem', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '2px' }}>TALLER TEXTIL</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Sistema de Gestión Textil</p>

        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Usuario</label>
            <input
              type="text"
              className="glass-input"
              style={{ marginTop: '0.4rem' }}
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Contraseña</label>
            <div style={{ position: 'relative', marginTop: '0.4rem' }}>
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                className="glass-input"
                style={{ width: '100%', paddingRight: '2.5rem', boxSizing: 'border-box' }}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}
              >
                {mostrarContrasena ? <IconoOjoOculto /> : <IconoOjo />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#e74c3c', fontSize: '0.8rem' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem' }}>
            Acceder al Taller
          </button>
        </form>

        <div
          onClick={() => setMostrarAyuda(true)}
          style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ¿Olvidó su contraseña?
        </div>
      </div>

      {mostrarAyuda && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(8px)',
        }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '400px', background: '#111', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Recuperación de Acceso</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Por motivos de seguridad, las contraseñas son tu número de <strong>DNI</strong>.
              <br /><br />
              Si tienes problemas para ingresar, comunícate con la <strong>Administradora del Taller</strong> para que regenere tus accesos y te los reenvíe por WhatsApp.
            </p>
            <button onClick={() => setMostrarAyuda(false)} className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaAcceso;
