import { useState } from 'react';
import { api } from '../services/clienteApi';

const VistaPrendas = ({ prendas = [], setPrendas, categorias = ['General'], setCategorias }) => {
  const [estaModalAbierto, setEstaModalAbierto] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);
  const [prendaResaltada, setPrendaResaltada] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevaPrenda, setNuevaPrenda] = useState({ name: '', category: 'General', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });
  const [guardando, setGuardando] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('recientes');
  const [vista, setVista] = useState('grid');
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);
  const [prendaEditando, setPrendaEditando] = useState(null);
  const [toast, setToast] = useState(null);

  const mostrarToast = (msg, tipo = 'ok') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este diseño?')) return;
    try {
      await api.delete(`/api/prendas/${id}`);
      setPrendas(prendas.filter(p => p.id !== id));
      setMenuAbiertoId(null);
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const manejarFavorito = async (prenda) => {
    try {
      await api.patch(`/api/prendas/${prenda.id}/favorite`, { is_favorite: !prenda.isFavorite });
      setPrendas(prendas.map(p => p.id === prenda.id ? { ...p, isFavorite: !prenda.isFavorite } : p));
      mostrarToast(prenda.isFavorite ? 'Quitado de favoritos' : 'Marcado como favorito');
      setMenuAbiertoId(null);
    } catch (error) {
      alert('Error al marcar favorito: ' + error.message);
    }
  };

  const abrirEditar = (prenda) => {
    setPrendaEditando({
      id: prenda.id,
      name: prenda.name,
      category: prenda.category || 'General',
      image: prenda.image || '',
      programFile: prenda.programFile || '',
      vueltas: prenda.notes?.vueltas || '',
      tension: prenda.notes?.tension || '',
      hilo: prenda.notes?.hilo || '',
      aguja: prenda.notes?.aguja || ''
    });
    setMenuAbiertoId(null);
  };

  const manejarGuardarEdicion = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        name: prendaEditando.name,
        category: prendaEditando.category || 'General',
        image_url: prendaEditando.image || 'https://images.unsplash.com/photo-1434031219129-14e5c876f628?q=80&w=1170&auto=format&fit=crop',
        file_program: prendaEditando.programFile || 'diseño_heng_qiang.hcd',
        laps: parseInt(prendaEditando.vueltas) || 0,
        tension: prendaEditando.tension,
        yarn_type: prendaEditando.hilo,
        needle: prendaEditando.aguja
      };
      const actualizada = await api.patch(`/api/prendas/${prendaEditando.id}`, payload);
      setPrendas(prendas.map(p => p.id === prendaEditando.id ? {
        ...p,
        name: actualizada.name,
        category: actualizada.category_name || p.category,
        image: actualizada.image_url || p.image,
        programFile: actualizada.file_program || p.programFile,
        notes: { vueltas: actualizada.laps, tension: actualizada.tension, hilo: actualizada.yarn_type, aguja: actualizada.needle }
      } : p));
      mostrarToast('Diseno actualizado correctamente');
      setPrendaEditando(null);
    } catch (error) {
      alert('Error al editar: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarAgregarPrenda = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        name: nuevaPrenda.name,
        category: nuevaPrenda.category || 'General',
        image_url: nuevaPrenda.image || 'https://images.unsplash.com/photo-1434031219129-14e5c876f628?q=80&w=1170&auto=format&fit=crop',
        file_program: nuevaPrenda.programFile || 'diseño_heng_qiang.hcd',
        laps: parseInt(nuevaPrenda.vueltas) || 0,
        tension: nuevaPrenda.tension,
        yarn_type: nuevaPrenda.hilo,
        needle: nuevaPrenda.aguja
      };

      const prendaCreada = await api.post('/api/prendas', payload);

      const prendaAAgregar = {
        id: prendaCreada.id,
        name: prendaCreada.name,
        category: prendaCreada.category_name || 'General',
        image: prendaCreada.image_url,
        programFile: prendaCreada.file_program,
        isFavorite: false,
        createdAt: prendaCreada.created_at || new Date().toISOString(),
        notes: {
          vueltas: prendaCreada.laps,
          tension: prendaCreada.tension,
          hilo: prendaCreada.yarn_type,
          aguja: prendaCreada.needle
        }
      };

      setPrendas([prendaAAgregar, ...prendas]);
      setEstaModalAbierto(false);
      setNuevaPrenda({ name: '', category: 'General', image: '', programFile: '', vueltas: '', tension: '', hilo: '', aguja: '' });
    } catch (error) {
      alert('Error al guardar la prenda: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarCrearCategoria = async () => {
    const nombre = nuevaCategoria.trim();
    if (nombre && !categorias.includes(nombre)) {
      try {
        await api.post('/api/prendas/categorias', { name: nombre });
        setCategorias([...categorias, nombre]);
        setNuevaCategoria('');
        mostrarToast(`Categoria "${nombre}" creada y guardada`);
      } catch (error) {
        alert('Error al crear la categoría: ' + error.message);
      }
    } else if (categorias.includes(nombre)) {
      mostrarToast('Esa categoría ya existe', 'warn');
    }
  };

  const manejarDescarga = (prenda) => {
    const contenido = `Programa Heng Qiang: ${prenda.programFile}\nDiseño: ${prenda.name}\nNotas Técnicas:\nVueltas: ${prenda.notes.vueltas}\nTensión: ${prenda.notes.tension}\nHilo: ${prenda.notes.hilo}\nAguja: ${prenda.notes.aguja}`;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = prenda.programFile;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoriasAMostrar = () => {
    return filtroCategoria === 'Todas' ? categorias : [filtroCategoria];
  };

  const filtrarYOrdenar = (lista) => {
    let resultado = lista.filter(p => {
      const matchBusqueda = terminoBusqueda.trim() === '' ||
        p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        p.programFile.toLowerCase().includes(terminoBusqueda.toLowerCase());
      return matchBusqueda;
    });

    resultado.sort((a, b) => {
      if (ordenarPor === 'az') return a.name.localeCompare(b.name);
      if (ordenarPor === 'za') return b.name.localeCompare(a.name);
      if (ordenarPor === 'antiguos') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    resultado.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

    return resultado;
  };

  return (
    <div className="animate-fade" onClick={() => setMenuAbiertoId(null)}>

      {/* Toast de notificación */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          background: toast.tipo === 'warn' ? '#854d0e' : '#166534',
          color: 'white', padding: '0.85rem 1.5rem',
          borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0 }}>Catálogo de Diseños HQPDS</h1>
          <span style={{ fontSize: '0.8rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>HENG QIANG</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            className="glass-input"
            placeholder="Nueva categoría..."
            value={nuevaCategoria}
            onChange={e => setNuevaCategoria(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && manejarCrearCategoria()}
            style={{ width: '200px' }}
          />
          <button className="nav-item" onClick={manejarCrearCategoria} style={{ padding: '0.5rem 1rem', justifyContent: 'center' }}>Añadir</button>
          <button className="btn-primary" onClick={() => setEstaModalAbierto(true)}>+ Nuevo Diseño</button>
        </div>
      </div>

      {/* Barra de búsqueda, filtro y orden */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <input
            className="glass-input"
            placeholder="🔍 Buscar diseño o archivo HCD..."
            value={terminoBusqueda}
            onChange={e => setTerminoBusqueda(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="glass-input"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="Todas">Todas las Categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            className="glass-input"
            value={ordenarPor}
            onChange={e => setOrdenarPor(e.target.value)}
            style={{ width: '145px' }}
          >
            <option value="recientes">↑↓ Recientes</option>
            <option value="antiguos">↑↓ Antiguos</option>
            <option value="az">↑↓ A - Z</option>
            <option value="za">↑↓ Z - A</option>
          </select>
          <select
            className="glass-input"
            value={vista}
            onChange={e => setVista(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="grid">⊞ Cuadrícula</option>
            <option value="list">☰ Lista</option>
          </select>
        </div>
      </div>

      {/* Lista vacía */}
      {prendas.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No hay diseños registrados en el catálogo.</p>
          <button className="btn-primary" onClick={() => setEstaModalAbierto(true)}>+ Agregar primer diseño</button>
        </div>
      ) : (
        <div>
          {getCategoriasAMostrar().map(categoria => {
            const prendasCategoria = prendas.filter(p => (p.category || 'General') === categoria);
            const prendasFiltradas = filtrarYOrdenar(prendasCategoria);

            if (prendasFiltradas.length === 0) return null;

            return (
              <div key={categoria} style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.4rem' }}>
                  {categoria}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem', fontWeight: 'normal' }}>{prendasFiltradas.length} diseño(s)</span>
                </h2>

                <div style={
                  vista === 'grid'
                    ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }
                    : { display: 'flex', flexDirection: 'column', gap: '1rem' }
                }>
                  {prendasFiltradas.map(prenda => (
                    <div
                      key={prenda.id}
                      className="glass-panel"
                      style={{
                        padding: '1.5rem',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        display: vista === 'list' ? 'flex' : 'block',
                        alignItems: 'center',
                        gap: '1.5rem'
                      }}
                      onMouseEnter={() => setPrendaResaltada(prenda.id)}
                      onMouseLeave={() => setPrendaResaltada(null)}
                    >
                      {/* Estrella favorito */}
                      {prenda.isFavorite && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, color: '#facc15', fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)', pointerEvents: 'none' }}>
                          ★
                        </div>
                      )}

                      {/* Menú 3 puntos */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20 }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setMenuAbiertoId(menuAbiertoId === prenda.id ? null : prenda.id)}
                          style={{ background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          ⋮
                        </button>
                        {menuAbiertoId === prenda.id && (
                          <div style={{ position: 'absolute', top: '36px', right: '0', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '160px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
                          <button
                              onClick={() => manejarFavorito(prenda)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', textAlign: 'left', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              {prenda.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                            </button>
                            <button
                              onClick={() => abrirEditar(prenda)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', textAlign: 'left', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              Editar diseño
                            </button>
                            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '2px 0' }} />
                            <button
                              onClick={() => manejarEliminar(prenda.id)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', textAlign: 'left', padding: '0.5rem 0.75rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              Eliminar diseño
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Imagen */}
                      <div style={{
                        width: vista === 'list' ? '140px' : '100%',
                        minWidth: vista === 'list' ? '140px' : 'auto',
                        height: vista === 'list' ? '140px' : '200px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginBottom: vista === 'list' ? '0' : '1rem',
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <img
                          src={prenda.image}
                          alt={prenda.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: prendaResaltada === prenda.id ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                        {/* Zoom */}
                        {prendaResaltada === prenda.id && vista === 'grid' && (
                          <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '190px', height: '190px',
                            zIndex: 100, borderRadius: '14px', overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                            border: '2px solid var(--accent)', pointerEvents: 'none'
                          }} className="animate-fade">
                            <img
                              src={prenda.image}
                              alt="Zoom"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(3)' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                          <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.05rem' }}>{prenda.name}</h3>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>{prenda.programFile}</span>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: vista === 'list' ? 'repeat(4, 1fr)' : '1fr 1fr',
                          gap: '0.4rem',
                          fontSize: '0.82rem',
                          background: 'rgba(0,0,0,0.2)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: '0.75rem'
                        }}>
                          <div><strong>Vueltas:</strong> {prenda.notes.vueltas}</div>
                          <div><strong>Tensión:</strong> {prenda.notes.tension}</div>
                          <div><strong>Hilo:</strong> {prenda.notes.hilo}</div>
                          <div><strong>Aguja:</strong> {prenda.notes.aguja}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setPrendaSeleccionada(prenda)}
                            style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Ver Ficha
                          </button>
                          <button
                            onClick={() => manejarDescarga(prenda)}
                            style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', background: 'var(--accent)', border: 'none', color: 'white', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Descargar {prenda.programFile.split('.').pop().toUpperCase()}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ficha Técnica */}
      {prendaSeleccionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000, backdropFilter: 'blur(10px)' }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '90%', display: 'flex', overflow: 'hidden', maxHeight: '90vh' }}>
            <div style={{ flex: 1, background: '#000' }}>
              <img src={prendaSeleccionada.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Previsualización Ampliada" />
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Ficha Técnica</h2>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{prendaSeleccionada.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{prendaSeleccionada.programFile}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', flex: 1 }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <strong>Especificaciones de Máquina:</strong>
                  <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>Tension: {prendaSeleccionada.notes.tension}</li>
                    <li>Vueltas: {prendaSeleccionada.notes.vueltas}</li>
                    <li>Hilo: {prendaSeleccionada.notes.hilo}</li>
                    <li>Aguja/Galga: {prendaSeleccionada.notes.aguja}</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => manejarDescarga(prendaSeleccionada)}>Descargar Archivo</button>
                <button className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setPrendaSeleccionada(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar */}
      {estaModalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(5px)', overflowY: 'auto', padding: '2rem 0' }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem', flexShrink: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Agregar Diseño Heng Qiang</h2>
            <form onSubmit={manejarAgregarPrenda} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                className="glass-input" placeholder="Nombre del diseño" required
                value={nuevaPrenda.name} onChange={e => setNuevaPrenda({ ...nuevaPrenda, name: e.target.value })}
              />

              <select
                className="glass-input"
                value={nuevaPrenda.category}
                onChange={e => setNuevaPrenda({ ...nuevaPrenda, category: e.target.value })}
                required
              >
                <option value="" disabled>Seleccione una categoría</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Subir Programa HQPDS (.HCD, .PAT, .HQS)</label>
                <input
                  type="file" accept=".hcd,.pat,.hqs"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const archivo = e.target.files[0];
                    if (archivo) setNuevaPrenda({ ...nuevaPrenda, programFile: archivo.name });
                  }}
                />
              </div>

              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Imagen de Previsualización</label>
                <input
                  type="file" accept="image/*"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const archivo = e.target.files[0];
                    if (archivo) {
                      const lector = new FileReader();
                      lector.onloadend = () => setNuevaPrenda({ ...nuevaPrenda, image: lector.result });
                      lector.readAsDataURL(archivo);
                    }
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="glass-input" placeholder="Vueltas" type="number" value={nuevaPrenda.vueltas} onChange={e => setNuevaPrenda({ ...nuevaPrenda, vueltas: e.target.value })} />
                <input className="glass-input" placeholder="Tensión" value={nuevaPrenda.tension} onChange={e => setNuevaPrenda({ ...nuevaPrenda, tension: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="glass-input" placeholder="Tipo de Hilo" value={nuevaPrenda.hilo} onChange={e => setNuevaPrenda({ ...nuevaPrenda, hilo: e.target.value })} />
                <input className="glass-input" placeholder="Galga / Aguja" value={nuevaPrenda.aguja} onChange={e => setNuevaPrenda({ ...nuevaPrenda, aguja: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEstaModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar en Sistema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {prendaEditando && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 3500, backdropFilter: 'blur(5px)', overflowY: 'auto', padding: '2rem 0' }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem', flexShrink: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Editar Diseño</h2>
            <form onSubmit={manejarGuardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                className="glass-input" placeholder="Nombre del diseño" required
                value={prendaEditando.name} onChange={e => setPrendaEditando({ ...prendaEditando, name: e.target.value })}
              />
              <select
                className="glass-input"
                value={prendaEditando.category}
                onChange={e => setPrendaEditando({ ...prendaEditando, category: e.target.value })}
              >
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                className="glass-input" placeholder="Nombre del archivo (.hcd)"
                value={prendaEditando.programFile}
                onChange={e => setPrendaEditando({ ...prendaEditando, programFile: e.target.value })}
              />
              <div style={{ padding: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Cambiar imagen (opcional)</label>
                <input
                  type="file" accept="image/*"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onChange={e => {
                    const archivo = e.target.files[0];
                    if (archivo) {
                      const lector = new FileReader();
                      lector.onloadend = () => setPrendaEditando({ ...prendaEditando, image: lector.result });
                      lector.readAsDataURL(archivo);
                    }
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="glass-input" placeholder="Vueltas" type="number" value={prendaEditando.vueltas} onChange={e => setPrendaEditando({ ...prendaEditando, vueltas: e.target.value })} />
                <input className="glass-input" placeholder="Tensión" value={prendaEditando.tension} onChange={e => setPrendaEditando({ ...prendaEditando, tension: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="glass-input" placeholder="Tipo de Hilo" value={prendaEditando.hilo} onChange={e => setPrendaEditando({ ...prendaEditando, hilo: e.target.value })} />
                <input className="glass-input" placeholder="Galga / Aguja" value={prendaEditando.aguja} onChange={e => setPrendaEditando({ ...prendaEditando, aguja: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="nav-item" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setPrendaEditando(null)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VistaPrendas;
