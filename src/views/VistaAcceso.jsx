import { useState } from 'react';
import { api } from '../services/clienteApi';

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
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f4f6f8', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff', padding: '2.5rem', width: '100%', maxWidth: '380px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', textAlign: 'center',
        border: '1px solid #e1e4e8'
      }}>
        <h1 style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.2rem' }}>Taller Textil</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '2rem', fontSize: '0.9rem' }}>Acceso al Sistema</p>
        
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', color: '#34495e', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Usuario</label>
            <input 
              type="text" 
              style={{
                width: '100%', padding: '0.6rem', border: '1px solid #ced4da', 
                borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.95rem'
              }}
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          
          <div style={{ textAlign: 'left', position: 'relative' }}>
            <label style={{ fontSize: '0.85rem', color: '#34495e', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={mostrarContrasena ? 'text' : 'password'} 
                style={{
                  width: '100%', padding: '0.6rem', paddingRight: '2.5rem', border: '1px solid #ced4da', 
                  borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.95rem'
                }}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                style={{ 
                  position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', 
                  background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer',
                  fontSize: '1.2rem', padding: 0
                }}
              >
                {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '0.5rem 0' }}>{error}</p>}

          <button type="submit" style={{
            padding: '0.7rem', marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold',
            backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', transition: 'background-color 0.2s'
          }}>
            Ingresar
          </button>
        </form>

        <div 
          onClick={() => setMostrarAyuda(true)}
          style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#0056b3', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ¿Olvidó su contraseña?
        </div>
      </div>

      {mostrarAyuda && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ padding: '2rem', width: '350px', background: '#fff', textAlign: 'center', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.2rem' }}>Recuperar Acceso</h2>
            <p style={{ color: '#555', lineHeight: '1.5', fontSize: '0.9rem' }}>
              Su contraseña por defecto es su número de <strong>DNI</strong>. 
              <br /><br />
              Para restablecerla, comuníquese con la Administración para que regenere sus accesos.
            </p>
            <button onClick={() => setMostrarAyuda(false)} style={{
              marginTop: '1.5rem', width: '100%', padding: '0.7rem', backgroundColor: '#e0e0e0',
              border: 'none', borderRadius: '4px', color: '#333', fontWeight: 'bold', cursor: 'pointer'
            }}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default VistaAcceso;
