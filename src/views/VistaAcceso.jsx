import { useState } from 'react';

const VistaAcceso = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  // Usuarios de prueba para el taller
  const USUARIOS_PRUEBA = [
    { username: 'admin', password: '123', name: 'Becerra', role: 'admin' },
    { username: 'juan', password: '123', name: 'Juan Perez', role: 'empleado', id: 'emp_1' },
    { username: 'maria', password: '123', name: 'Maria Lopez', role: 'empleado', id: 'emp_2' }
  ];

  const manejarEnvio = (e) => {
    e.preventDefault();
    const usu = USUARIOS_PRUEBA.find(u => u.username === usuario && u.password === contrasena);
    
    if (usu) {
      onLogin(usu);
    } else {
      setError('Credenciales incorrectas. Prueba con admin/123 o juan/123.');
    }
  };

  return (
    <div className="login-container" style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-gradient)', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs for aesthetic */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.15 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: '#3498db', filter: 'blur(150px)', opacity: 0.1 }}></div>

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
            <input 
              type="password" 
              className="glass-input" 
              style={{ marginTop: '0.4rem' }}
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: '#e74c3c', fontSize: '0.8rem' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem' }}>
            Acceder al Taller
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ¿Olvidó su contraseña? Contacte al administrador.
        </div>
      </div>
    </div>
  );
};

export default VistaAcceso;
