import { useState } from 'react';

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

const CampoContrasena = ({ label, value, onChange, placeholder, id, required = true }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative', marginTop: '0.4rem' }}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="glass-input"
          style={{ width: '100%', paddingRight: '2.5rem', boxSizing: 'border-box' }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={id.includes('actual') ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{
            position: 'absolute',
            right: '0.8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
          }}
        >
          {visible ? <IconoOjoOculto /> : <IconoOjo />}
        </button>
      </div>
    </div>
  );
};

export default CampoContrasena;
