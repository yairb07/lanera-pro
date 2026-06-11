import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { api } from "../services/clienteApi";

const MARCAS = ["Michell", "Inca Tops", "Incalpaca", "Otra"];

const MOVIMIENTO_TIPOS = {
  entrada: { label:"Entrada",  color:"#4CAF82", bg:"rgba(76,175,130,0.12)", icono:"↑" },
  salida:  { label:"Salida",   color:"#E05555", bg:"rgba(224,85,85,0.12)",  icono:"↓" },
  ajuste:  { label:"Ajuste",   color:"#E8A23A", bg:"rgba(232,162,58,0.12)", icono:"≈" },
};

// ── Estilos base ─────────────────────────────────────────────────
const S = {
  card: {
    background:"rgba(255,255,255,0.05)",
    border:"0.5px solid rgba(255,255,255,0.10)",
    borderRadius:12,
    backdropFilter:"blur(20px)",
  },
  input: {
    width:"100%",
    padding:"8px 10px",
    background:"rgba(255,255,255,0.04)",
    border:"0.5px solid rgba(255,255,255,0.10)",
    borderRadius:7,
    color:"#F0EDE8",
    fontSize:12,
    outline:"none",
    fontFamily:"monospace",
    boxSizing:"border-box",
    colorScheme: "dark"
  },
  label: {
    fontSize:10,
    color:"rgba(240,237,232,0.4)",
    display:"block",
    marginBottom:4,
    textTransform:"uppercase",
    letterSpacing:1,
    fontFamily:"monospace",
  },
  btnPrimary: {
    padding:"8px 16px",
    background:"#C8873A",
    color:"#fff",
    border:"none",
    borderRadius:8,
    cursor:"pointer",
    fontSize:12,
    fontFamily:"monospace",
    fontWeight:600,
  },
  btnGhost: {
    padding:"6px 14px",
    background:"rgba(255,255,255,0.04)",
    color:"rgba(240,237,232,0.6)",
    border:"0.5px solid rgba(255,255,255,0.10)",
    borderRadius:8,
    cursor:"pointer",
    fontSize:11,
    fontFamily:"monospace",
  },
};

// ── Componente principal ─────────────────────────────────────────
export default function VistaKardex({ conos = [] }) {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await api.get('/api/conos/movimientos');
        const mapeados = data.map(m => ({
          id: m.id,
          fecha: new Date(m.created_at).toISOString().split("T")[0],
          hora: new Date(m.created_at).toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit" }),
          conoId: m.cone_id,
          marca: m.brand,
          color: m.color,
          codigo: m.code,
          tipo: m.movement_type,
          cantidad: m.quantity_cones,
          stockAnterior: m.stock_before,
          stockNuevo: m.stock_after,
          motivo: m.reason
        }));
        setMovimientos(mapeados);
      } catch (err) {
        console.error("Error al cargar movimientos:", err);
      }
    };
    fetchMovimientos();
  }, []);

  const [tab, setTab] = useState("stock"); 
  // tabs: "stock" | "movimiento" | "historial" | "nuevo_cono"
  
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [modalMov, setModalMov]       = useState(false);
  const [modalCono, setModalCono]     = useState(false);

  // Formulario movimiento
  const [fMov, setFMov] = useState({
    conoId:"", tipo:"entrada", cantidad:1, motivo:"", fecha: new Date().toISOString().split("T")[0]
  });

  // Formulario nuevo cono
  const [fCono, setFCono] = useState({
    marca:"Michell", color:"", codigo:"", peso:"200g", proveedor:"", stock:0
  });

  // ── Registrar movimiento ───────────────────────────────────────
  const registrarMovimiento = async () => {
    if (!fMov.conoId || !fMov.cantidad) return;

    try {
      await api.post(`/api/conos/${fMov.conoId}/movimiento`, {
        tipo: fMov.tipo,
        cantidad: Number(fMov.cantidad),
        motivo: fMov.motivo
      });

      // Refetch conos and movimientos (For simplicity we'll just reload the page or trigger a re-render in production, but let's just alert for now)
      alert("Movimiento registrado con éxito. Recarga la página para ver los cambios.");
      setFMov({ conoId:"", tipo:"entrada", cantidad:1, motivo:"", fecha: new Date().toISOString().split("T")[0] });
      setModalMov(false);
    } catch (err) {
      alert("Error al registrar: " + (err.mensaje || err.message));
    }
  };

  // ── Agregar nuevo cono ─────────────────────────────────────────
  const agregarCono = async () => {
    if (!fCono.color || !fCono.codigo) return;
    try {
      await api.post('/api/conos', {
        code: fCono.codigo,
        brand: fCono.marca,
        color: fCono.color,
        weight_grams: parseInt(fCono.peso) || 200,
        stock_cones: parseInt(fCono.stock) || 0,
        supplier: fCono.proveedor
      });
      alert("Cono creado con éxito. Recarga la página para verlo.");
      setFCono({ marca:"Michell", color:"", codigo:"", peso:"200g", proveedor:"", stock:0 });
      setModalCono(false);
    } catch(err) {
      alert("Error al crear cono: " + err.message);
    }
  };

  // ── Exportar a Excel ─────────────────────────────────────────
  const exportarKardex = () => {
    const wb = XLSX.utils.book_new();
  
    // Hoja 1 — Stock actual
    const stockData = [
      ["KARDEX DE CONOS — STOCK ACTUAL"],
      [`Generado: ${new Date().toLocaleDateString("es-PE")}`],
      [],
      ["Código","Marca","Color","Peso/cono","Proveedor","Stock actual","Estado"],
      ...conos.map(c => [
        c.codigo, c.marca, c.color, c.peso, c.proveedor, c.stock,
        c.stock === 0 ? "AGOTADO"
        : c.stock <= 3 ? "CRÍTICO"
        : c.stock <= 8 ? "BAJO"
        : "NORMAL"
      ])
    ];
    const wsStock = XLSX.utils.aoa_to_sheet(stockData);
    wsStock["!cols"] = [12,14,16,10,20,12,10].map(w => ({ wch:w }));
    XLSX.utils.book_append_sheet(wb, wsStock, "Stock Actual");
  
    // Hoja 2 — Historial de movimientos
    const histData = [
      ["HISTORIAL DE MOVIMIENTOS — KARDEX"],
      [],
      ["Fecha","Hora","Código","Marca","Color","Tipo","Cantidad","Stock Anterior","Stock Nuevo","Motivo"],
      ...movimientos.map(m => [
        m.fecha, m.hora, m.codigo, m.marca, m.color,
        m.tipo.toUpperCase(), m.cantidad,
        m.stockAnterior, m.stockNuevo, m.motivo
      ])
    ];
    const wsHist = XLSX.utils.aoa_to_sheet(histData);
    wsHist["!cols"] = [12,8,12,14,16,10,10,14,12,30].map(w => ({ wch:w }));
    XLSX.utils.book_append_sheet(wb, wsHist, "Historial");
  
    // Hoja 3 — Resumen por marca
    const marcas = [...new Set(conos.map(c => c.marca))];
    const resumenData = [
      ["RESUMEN POR MARCA"],
      [],
      ["Marca","Total tipos","Total conos","Críticos","Estado general"],
      ...marcas.map(marca => {
        const delaMarca = conos.filter(c => c.marca === marca);
        const totalStock = delaMarca.reduce((s,c) => s + c.stock, 0);
        const criticos = delaMarca.filter(c => c.stock <= 3).length;
        return [
          marca,
          delaMarca.length,
          totalStock,
          criticos,
          criticos > 0 ? "⚠ Requiere reposición" : "✓ OK"
        ];
      })
    ];
    const wsRes = XLSX.utils.aoa_to_sheet(resumenData);
    wsRes["!cols"] = [18,14,14,10,22].map(w => ({ wch:w }));
    XLSX.utils.book_append_sheet(wb, wsRes, "Resumen por Marca");
  
    XLSX.writeFile(wb, `LaneraPro_Kardex_${new Date().toLocaleDateString("es-PE").replace(/\//g,"-")}.xlsx`);
  };

  // ── Filtros ────────────────────────────────────────────────────
  const conosFiltrados = filtroMarca === "Todas"
    ? conos
    : conos.filter(c => c.marca === filtroMarca);

  const conoSeleccionado = conos.find(c => c.id === fMov.conoId);

  // ── Métricas ───────────────────────────────────────────────────
  const totalConos    = conos.reduce((s, c) => s + c.stock, 0);
  const criticos      = conos.filter(c => c.stock <= 3).length;
  const entradasHoy   = movimientos.filter(m => m.fecha === new Date().toISOString().split("T")[0] && m.tipo === "entrada").reduce((s,m) => s + m.cantidad, 0);
  const salidasHoy    = movimientos.filter(m => m.fecha === new Date().toISOString().split("T")[0] && m.tipo === "salida").reduce((s,m) => s + m.cantidad, 0);

  return (
    <div style={{ color:"#F0EDE8", fontFamily:"sans-serif" }}>

      {/* ── Métricas ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:12, marginBottom:20 }}>
        {[
          { label:"Total conos en stock", value:totalConos,   badge:"todas las marcas",    bc:"#4CAF82" },
          { label:"Tipos registrados",    value:conos.length, badge:`${MARCAS.length} marcas`, bc:"#C8873A" },
          { label:"Críticos (≤3 conos)",  value:criticos,     badge:"requieren reposición", bc:criticos>0?"#E05555":"#4CAF82" },
          { label:"Movimientos hoy",      value:entradasHoy + salidasHoy, badge:`↑${entradasHoy} entradas · ↓${salidasHoy} salidas`, bc:"#5BA3D4" },
        ].map(m => (
          <div key={m.label} style={{ ...S.card, padding:14 }}>
            <div style={{ fontSize:10, color:"rgba(240,237,232,0.4)", textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontFamily:"monospace" }}>{m.label}</div>
            <div style={{ fontSize:26, color:"#F0EDE8", lineHeight:1, fontFamily:"Georgia, serif" }}>{m.value}</div>
            <div style={{ marginTop:6, fontSize:10, color:m.bc, background:m.bc+"22", padding:"2px 8px", borderRadius:20, display:"inline-block", fontFamily:"monospace" }}>{m.badge}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs + Acciones ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", gap:6 }}>
          {[
            { key:"stock",    label:"📦 Stock actual" },
            { key:"historial",label:"📋 Historial" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:11, fontFamily:"monospace",
              background: tab === t.key ? "#C8873A" : "rgba(255,255,255,0.05)",
              color: tab === t.key ? "#fff" : "rgba(240,237,232,0.5)",
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={exportarKardex} style={{
            padding:"7px 14px",
            background:"rgba(76,175,130,0.12)",
            border:"0.5px solid rgba(76,175,130,0.3)",
            borderRadius:8, color:"#4CAF82",
            cursor:"pointer", fontSize:11,
            fontFamily:"monospace",
            display:"flex", alignItems:"center", gap:5,
          }}>
            📊 Exportar Kardex Excel
          </button>
          <button onClick={() => setModalCono(true)} style={S.btnGhost}>＋ Nuevo cono</button>
          <button onClick={() => setModalMov(true)}  style={S.btnPrimary}>↑↓ Registrar movimiento</button>
        </div>
      </div>

      {/* ── Filtro por marca ── */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {["Todas", ...MARCAS].map(m => (
          <button key={m} onClick={() => setFiltroMarca(m)} style={{
            padding:"5px 13px",
            border:`0.5px solid ${filtroMarca===m?"#C8873A":"rgba(255,255,255,0.10)"}`,
            borderRadius:20, fontSize:10,
            background: filtroMarca===m ? "rgba(200,135,58,0.12)" : "rgba(255,255,255,0.04)",
            color: filtroMarca===m ? "#C8873A" : "rgba(240,237,232,0.5)",
            cursor:"pointer", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1,
          }}>
            {m}
          </button>
        ))}
      </div>

      {/* ── TAB: Stock actual ── */}
      {tab === "stock" && (
        <div style={{ ...S.card, padding:0, overflow:"hidden" }}>
          <div style={{ 
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: 8,
          }}>
            <table style={{ width:"100%", minWidth: 600, borderCollapse:"collapse", fontSize:11, fontFamily:"monospace" }}>
              <thead>
                <tr>
                  {["Código","Marca","Color","Peso/cono","Proveedor","Stock","Estado","Movimiento rápido"].map(h => (
                    <th key={h} style={{
                      textAlign:"left", padding:"10px 14px",
                      color:"rgba(240,237,232,0.3)", fontSize:9,
                      letterSpacing:1, textTransform:"uppercase",
                      borderBottom:"0.5px solid rgba(255,255,255,0.08)",
                      whiteSpace:"nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {conosFiltrados.map(c => {
                  const estado = c.stock === 0 ? "agotado"
                    : c.stock <= 3 ? "critico"
                    : c.stock <= 8 ? "bajo"
                    : "normal";
                  const estadoConfig = {
                    agotado: { label:"Agotado", color:"#E05555", bg:"rgba(224,85,85,0.12)" },
                    critico: { label:"Crítico",  color:"#E05555", bg:"rgba(224,85,85,0.12)" },
                    bajo:    { label:"Bajo",     color:"#E8A23A", bg:"rgba(232,162,58,0.12)" },
                    normal:  { label:"Normal",   color:"#4CAF82", bg:"rgba(76,175,130,0.12)" },
                  }[estado];

                  return (
                    <tr key={c.id}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}
                      style={{ borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding:"10px 14px", color:"#C8873A", fontWeight:600 }}>{c.codigo}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ background:"rgba(200,135,58,0.12)", color:"#C8873A", padding:"2px 8px", borderRadius:6, fontSize:10 }}>
                          {c.marca}
                        </span>
                      </td>
                      <td style={{ padding:"10px 14px", color:"#F0EDE8" }}>{c.color}</td>
                      <td style={{ padding:"10px 14px", color:"rgba(240,237,232,0.5)" }}>{c.peso}</td>
                      <td style={{ padding:"10px 14px", color:"rgba(240,237,232,0.5)" }}>{c.proveedor}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:18, fontWeight:700, color:estadoConfig.color, fontFamily:"Georgia,serif" }}>
                          {c.stock}
                        </span>
                        <span style={{ fontSize:9, color:"rgba(240,237,232,0.3)", marginLeft:4 }}>conos</span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ background:estadoConfig.bg, color:estadoConfig.color, padding:"3px 9px", borderRadius:20, fontSize:10 }}>
                          {estadoConfig.label}
                        </span>
                      </td>
                      {/* Botones entrada/salida rápida */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => {
                            setFMov({ conoId:c.id, tipo:"entrada", cantidad:1, motivo:"", fecha:new Date().toISOString().split("T")[0] });
                            setModalMov(true);
                          }} style={{ padding:"4px 10px", background:"rgba(76,175,130,0.15)", color:"#4CAF82", border:"0.5px solid rgba(76,175,130,0.3)", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>
                            ↑ Entrada
                          </button>
                          <button onClick={() => {
                            setFMov({ conoId:c.id, tipo:"salida", cantidad:1, motivo:"", fecha:new Date().toISOString().split("T")[0] });
                            setModalMov(true);
                          }} style={{ padding:"4px 10px", background:"rgba(224,85,85,0.12)", color:"#E05555", border:"0.5px solid rgba(224,85,85,0.3)", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>
                            ↓ Salida
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Historial ── */}
      {tab === "historial" && (
        <div style={{ ...S.card, padding:0, overflow:"hidden" }}>
          {movimientos.length === 0 ? (
            <div style={{ padding:40, textAlign:"center", color:"rgba(240,237,232,0.3)", fontFamily:"monospace", fontSize:12 }}>
              Sin movimientos registrados aún — usa "↑↓ Registrar movimiento"
            </div>
          ) : (
            <div style={{ 
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: 8,
            }}>
              <table style={{ width:"100%", minWidth: 600, borderCollapse:"collapse", fontSize:11, fontFamily:"monospace" }}>
                <thead>
                  <tr>
                    {["Fecha","Hora","Código","Marca","Color","Tipo","Cantidad","Stock anterior","Stock nuevo","Motivo"].map(h => (
                      <th key={h} style={{
                        textAlign:"left", padding:"10px 14px",
                        color:"rgba(240,237,232,0.3)", fontSize:9,
                        letterSpacing:1, textTransform:"uppercase",
                        borderBottom:"0.5px solid rgba(255,255,255,0.08)",
                        whiteSpace:"nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map(m => {
                    const tc = MOVIMIENTO_TIPOS[m.tipo];
                    return (
                      <tr key={m.id}
                        onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}
                        style={{ borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding:"9px 14px", color:"rgba(240,237,232,0.5)" }}>{m.fecha}</td>
                        <td style={{ padding:"9px 14px", color:"rgba(240,237,232,0.3)" }}>{m.hora}</td>
                        <td style={{ padding:"9px 14px", color:"#C8873A" }}>{m.codigo}</td>
                        <td style={{ padding:"9px 14px" }}>
                          <span style={{ background:"rgba(200,135,58,0.10)", color:"#C8873A", padding:"1px 7px", borderRadius:6, fontSize:10 }}>{m.marca}</span>
                        </td>
                        <td style={{ padding:"9px 14px", color:"#F0EDE8" }}>{m.color}</td>
                        <td style={{ padding:"9px 14px" }}>
                          <span style={{ background:tc.bg, color:tc.color, padding:"2px 9px", borderRadius:20, fontSize:10 }}>
                            {tc.icono} {tc.label}
                          </span>
                        </td>
                        <td style={{ padding:"9px 14px", color:tc.color, fontWeight:700, fontSize:13 }}>
                          {m.tipo==="salida"?"-":m.tipo==="entrada"?"+":""}{m.cantidad}
                        </td>
                        <td style={{ padding:"9px 14px", color:"rgba(240,237,232,0.4)" }}>{m.stockAnterior}</td>
                        <td style={{ padding:"9px 14px", color:"#F0EDE8", fontWeight:600 }}>{m.stockNuevo}</td>
                        <td style={{ padding:"9px 14px", color:"rgba(240,237,232,0.5)", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.motivo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL: Registrar movimiento ── */}
      {modalMov && (
        <div onClick={() => setModalMov(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(6px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            ...S.card, background:"rgba(18,20,28,0.98)",
            padding:28, width:420, maxWidth:"95vw",
          }}>
            <div style={{ fontSize:16, color:"#F0EDE8", fontFamily:"Georgia,serif", marginBottom:20 }}>
              ↑↓ Registrar movimiento de conos
            </div>

            {/* Tipo */}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Tipo de movimiento</label>
              <div style={{ display:"flex", gap:8 }}>
                {Object.entries(MOVIMIENTO_TIPOS).map(([key, tc]) => (
                  <button key={key} onClick={() => setFMov({...fMov, tipo:key})} style={{
                    flex:1, padding:"8px 0", borderRadius:8, cursor:"pointer",
                    border:`0.5px solid ${fMov.tipo===key ? tc.color : "rgba(255,255,255,0.10)"}`,
                    background: fMov.tipo===key ? tc.bg : "transparent",
                    color: fMov.tipo===key ? tc.color : "rgba(240,237,232,0.4)",
                    fontSize:11, fontFamily:"monospace",
                  }}>
                    {tc.icono} {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cono */}
            <div style={{ marginBottom:12 }}>
              <label style={S.label}>Cono</label>
              <select style={S.input} value={fMov.conoId} onChange={e => setFMov({...fMov, conoId:e.target.value})}>
                <option value="">Seleccionar cono...</option>
                {conos.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.marca}] {c.codigo} — {c.color} (stock: {c.stock})
                  </option>
                ))}
              </select>
            </div>

            {/* Preview stock actual */}
            {conoSeleccionado && (
              <div style={{ marginBottom:12, padding:"8px 12px", background:"rgba(200,135,58,0.08)", border:"0.5px solid rgba(200,135,58,0.25)", borderRadius:7, fontSize:11, color:"#C8873A", fontFamily:"monospace" }}>
                Stock actual: <strong>{conoSeleccionado.stock} conos</strong> · {conoSeleccionado.peso} c/u
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              {/* Cantidad */}
              <div>
                <label style={S.label}>
                  {fMov.tipo === "ajuste" ? "Nuevo stock total" : "Cantidad de conos"}
                </label>
                <input style={S.input} type="number" min="1"
                  value={fMov.cantidad}
                  onChange={e => setFMov({...fMov, cantidad:e.target.value})}
                />
              </div>
              {/* Fecha */}
              <div>
                <label style={S.label}>Fecha</label>
                <input style={S.input} type="date"
                  value={fMov.fecha}
                  onChange={e => setFMov({...fMov, fecha:e.target.value})}
                />
              </div>
            </div>

            {/* Motivo */}
            <div style={{ marginBottom:20 }}>
              <label style={S.label}>Motivo / referencia</label>
              <input style={S.input}
                placeholder={
                  fMov.tipo==="entrada" ? "Ej: Compra factura 001-1234, Michell..." :
                  fMov.tipo==="salida"  ? "Ej: Producción lote ORD-042, María Q..." :
                  "Ej: Conteo físico de inventario..."
                }
                value={fMov.motivo}
                onChange={e => setFMov({...fMov, motivo:e.target.value})}
              />
            </div>

            {/* Preview resultado */}
            {conoSeleccionado && fMov.cantidad && (
              <div style={{ marginBottom:16, padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.10)", borderRadius:7, fontSize:11, fontFamily:"monospace" }}>
                <span style={{ color:"rgba(240,237,232,0.4)" }}>Stock después: </span>
                <strong style={{ color:"#F0EDE8", fontSize:14 }}>
                  {fMov.tipo==="entrada" ? conoSeleccionado.stock + parseInt(fMov.cantidad||0)
                   : fMov.tipo==="salida" ? Math.max(0, conoSeleccionado.stock - parseInt(fMov.cantidad||0))
                   : parseInt(fMov.cantidad||0)
                  } conos
                </strong>
              </div>
            )}

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={() => setModalMov(false)} style={S.btnGhost}>Cancelar</button>
              <button onClick={registrarMovimiento} style={S.btnPrimary}>✓ Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Nuevo cono ── */}
      {modalCono && (
        <div onClick={() => setModalCono(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(6px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            ...S.card, background:"rgba(18,20,28,0.98)",
            padding:28, width:420, maxWidth:"95vw",
          }}>
            <div style={{ fontSize:16, color:"#F0EDE8", fontFamily:"Georgia,serif", marginBottom:20 }}>
              ＋ Registrar nuevo cono
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={S.label}>Marca / Proveedor</label>
              <select style={S.input} value={fCono.marca} onChange={e => setFCono({...fCono, marca:e.target.value})}>
                {MARCAS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div>
                <label style={S.label}>Código del cono</label>
                <input style={S.input} placeholder="Ej: CN-01, GP-03..." value={fCono.codigo} onChange={e => setFCono({...fCono, codigo:e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Color</label>
                <input style={S.input} placeholder="Ej: Crema Natural" value={fCono.color} onChange={e => setFCono({...fCono, color:e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Peso por cono</label>
                <select style={S.input} value={fCono.peso} onChange={e => setFCono({...fCono, peso:e.target.value})}>
                  {["100g","200g","250g","500g","1kg","2kg"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Stock inicial</label>
                <input style={S.input} type="number" min="0" value={fCono.stock} onChange={e => setFCono({...fCono, stock:e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={S.label}>Proveedor / empresa</label>
              <input style={S.input} placeholder="Ej: Michell & Cía, Inca Tops SAC..." value={fCono.proveedor} onChange={e => setFCono({...fCono, proveedor:e.target.value})} />
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={() => setModalCono(false)} style={S.btnGhost}>Cancelar</button>
              <button onClick={agregarCono} style={S.btnPrimary}>✓ Guardar cono</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
