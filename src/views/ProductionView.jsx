import React, { useState, useEffect } from 'react';

function FormRegistroProduccion({ conos, catalogo, empleados, onRegistrar }) {
  const [form, setForm] = useState({
    empleadaId: "",
    conoId: "",
    prendaTipo: "",
    cantidad: 1,
    gramajePorPrenda: 0,
  });

  const diseñoSeleccionado = catalogo.find(d => d.tipo === form.prendaTipo);

  useEffect(() => {
    if (diseñoSeleccionado) {
      setForm(f => ({ ...f, gramajePorPrenda: diseñoSeleccionado.gramaje }));
    }
  }, [form.prendaTipo, diseñoSeleccionado]);

  const totalGramos = form.cantidad * form.gramajePorPrenda;
  const conoInfo = conos.find(c => c.id === form.conoId);
  const conosADescontar = conoInfo ? (totalGramos / conoInfo.peso).toFixed(2) : 0;

  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      border:"0.5px solid rgba(255,255,255,0.1)",
      borderRadius:12, padding:18, marginBottom:16
    }}>
      <div style={{
        fontSize:11, color:"rgba(240,237,232,0.4)",
        textTransform:"uppercase", letterSpacing:2,
        fontFamily:"monospace", marginBottom:14
      }}>
        ＋ Registrar producción
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {/* Empleada */}
        <div>
          <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Empleada</label>
          <select
            value={form.empleadaId}
            onChange={e => setForm({...form, empleadaId:e.target.value})}
            style={{ width:"100%", padding:"7px 9px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#F0EDE8", fontSize:12, outline:"none" }}
          >
            <option style={{ background: '#1a1c23' }} value="">Seleccionar...</option>
            {empleados.map(e => <option style={{ background: '#1a1c23' }} key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>

        {/* Tipo de prenda */}
        <div>
          <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Tipo de prenda</label>
          <select
            value={form.prendaTipo}
            onChange={e => setForm({...form, prendaTipo:e.target.value})}
            style={{ width:"100%", padding:"7px 9px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#F0EDE8", fontSize:12, outline:"none" }}
          >
            <option style={{ background: '#1a1c23' }} value="">Seleccionar...</option>
            {catalogo.map(t => <option style={{ background: '#1a1c23' }} key={t.tipo} value={t.tipo}>{t.tipo}</option>)}
          </select>
        </div>

        {/* Cono */}
        <div>
          <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Cono a usar</label>
          <select
            value={form.conoId}
            onChange={e => setForm({...form, conoId:e.target.value})}
            style={{ width:"100%", padding:"7px 9px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#F0EDE8", fontSize:12, outline:"none" }}
          >
            <option style={{ background: '#1a1c23' }} value="">Seleccionar...</option>
            {conos.map(c => (
              <option style={{ background: '#1a1c23' }} key={c.id} value={c.id}>
                {c.id} — {c.color} ({c.stock} disponibles)
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label style={{ fontSize:10, color:"#666", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Cantidad de prendas</label>
          <input
            type="number" min="1"
            value={form.cantidad}
            onChange={e => setForm({...form, cantidad:parseInt(e.target.value)||1})}
            style={{ width:"100%", padding:"7px 9px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#F0EDE8", fontSize:12, outline:"none", boxSizing:"border-box" }}
          />
        </div>
      </div>

      {/* Preview del descuento */}
      {form.conoId && form.cantidad > 0 && (
        <div style={{
          marginTop:12, padding:"10px 14px",
          background:"rgba(200,135,58,0.08)",
          border:"0.5px solid rgba(200,135,58,0.3)",
          borderRadius:8, fontSize:11,
          fontFamily:"monospace", color:"#C8873A"
        }}>
          📊 Se descontarán <strong>{totalGramos}g</strong> ({conosADescontar} conos) del stock de <strong>{conoInfo?.color}</strong>
          {conoInfo && (conoInfo.stock - conosADescontar) <= conoInfo.minimo && (
            <div style={{ color:"#E05555", marginTop:4 }}>
              ⚠️ Stock quedará en nivel crítico
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          if (!form.empleadaId || !form.conoId || !form.prendaTipo) {
            alert("Completa todos los campos");
            return;
          }
          onRegistrar(form);
          setForm({ empleadaId:"", conoId:"", prendaTipo:"", cantidad:1, gramajePorPrenda:0 });
        }}
        style={{
          marginTop:14, padding:"8px 18px",
          background:"#C8873A", color:"#fff",
          border:"none", borderRadius:8,
          cursor:"pointer", fontSize:12,
          fontFamily:"monospace", fontWeight:500
        }}
      >
        ✓ Registrar y descontar stock
      </button>
    </div>
  );
}

const ProductionView = ({ conos = [], setConos, produccion = [], setProduccion, empleados = [], garments = [] }) => {
  const catalogo = garments.map(g => ({ tipo: g.name, gramaje: parseInt(g.notes.vueltas) || 350 }));

  const registrarProduccion = (registro) => {
    const totalGramos = registro.cantidad * registro.gramajePorPrenda;
    const gramosPorCono = conos.find(c => c.id === registro.conoId)?.peso || 1000;
    const conosUsados = totalGramos / gramosPorCono;

    if (setConos) {
      setConos(prev => prev.map(c => {
        if (c.id !== registro.conoId) return c;
        const nuevoStock = Math.max(0, c.stock - conosUsados);
        return { ...c, stock: Math.round(nuevoStock * 10) / 10 };
      }));
    }

    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      ...registro,
      totalGramos,
      conosDescontados: Math.round(conosUsados * 100) / 100,
    };

    if (setProduccion) {
      setProduccion(prev => [nuevoRegistro, ...prev]);
    }

    const conoActual = conos.find(c => c.id === registro.conoId);
    if (conoActual && (conoActual.stock - conosUsados) <= conoActual.minimo) {
      alert(`⚠️ ALERTA: El cono ${registro.conoId} (${conoActual.color}) está en stock crítico`);
    }
  };

  // Filtrar producción del día
  const hoyStr = new Date().toLocaleDateString("es-PE");
  const produccionHoy = produccion.filter(p => new Date(p.fecha).toLocaleDateString("es-PE") === hoyStr);

  const totalPrendas = produccionHoy.reduce((acc, p) => acc + p.cantidad, 0);
  const totalGramosConsumidos = produccionHoy.reduce((acc, p) => acc + p.totalGramos, 0);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Registro de Producción</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Control diario de prendas terminadas y descuento de material.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Formulario a la izquierda */}
        <div style={{ flex: '0 0 350px' }}>
          <FormRegistroProduccion
            conos={conos}
            catalogo={catalogo}
            empleados={empleados}
            onRegistrar={registrarProduccion}
          />

          {/* Resumen del día */}
          <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Resumen de Hoy
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Prendas:</span>
              <span style={{ fontWeight: 'bold' }}>{totalPrendas} un.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Material Consumido:</span>
              <span style={{ fontWeight: 'bold' }}>{(totalGramosConsumidos / 1000).toFixed(2)} kg</span>
            </div>
          </div>
        </div>

        {/* Tabla a la derecha */}
        <div style={{ flex: 1 }}>
          <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Historial de Hoy
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Hora</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Empleada</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Prenda</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Cono Usado</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Cant.</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Gramos</th>
                </tr>
              </thead>
              <tbody>
                {produccionHoy.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Aún no hay registros de producción hoy.
                    </td>
                  </tr>
                ) : (
                  produccionHoy.map(p => {
                    const emp = empleados.find(e => e.id === p.empleadaId);
                    const horaStr = new Date(p.fecha).toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{horaStr}</td>
                        <td style={{ padding: '0.8rem 0.5rem' }}>{emp?.nombre || 'Desconocida'}</td>
                        <td style={{ padding: '0.8rem 0.5rem' }}>{p.prendaTipo}</td>
                        <td style={{ padding: '0.8rem 0.5rem', fontSize: '0.85rem' }}>{p.conoId}</td>
                        <td style={{ padding: '0.8rem 0.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{p.cantidad}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: '#e74c3c' }}>-{p.totalGramos}g</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionView;
