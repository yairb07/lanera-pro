import { useState } from 'react';
import * as XLSX from "xlsx";

const FinancesView = ({ produccion = [], conos = [], pedidos = [], empleados = [] }) => {
  const exportarExcel = () => {
    const mes = new Date().toLocaleDateString("es-PE", { month:"long", year:"numeric" });
    const wb = XLSX.utils.book_new();

    // ── Hoja 1: Producción ───────────────────────
    const prodData = [
      ["REPORTE DE PRODUCCIÓN — " + mes.toUpperCase()],
      [],
      ["Empleada", "Prenda", "Cono usado", "Gramos", "Cantidad", "Tipo pago", "Monto S/", "Fecha"],
      ...produccion.map(r => [
        empleados.find(e => e.id == r.empleadaId)?.nombre || r.empleadaId,
        r.prendaTipo,
        r.conoId,
        r.totalGramos + "g",
        r.cantidad,
        empleados.find(e => e.id == r.empleadaId)?.pago || "—",
        empleados.find(e => e.id == r.empleadaId)?.monto || 0,
        new Date(r.fecha).toLocaleDateString("es-PE")
      ])
    ];
    const wsProd = XLSX.utils.aoa_to_sheet(prodData);
    wsProd["!cols"] = [20,16,14,10,10,12,12,14].map(w=>({wch:w}));
    XLSX.utils.book_append_sheet(wb, wsProd, "Producción");

    // ── Hoja 2: Inventario de conos ──────────────
    const conosData = [
      ["INVENTARIO DE CONOS — " + mes.toUpperCase()],
      [],
      ["Código", "Color", "Material", "Peso/cono", "Stock actual", "Mínimo", "Proveedor", "Precio S//kg", "Estado"],
      ...conos.map(c => [
        c.id, c.color, c.material,
        c.peso + "g", c.stock, c.minimo,
        c.proveedor, c.precio,
        c.stock <= c.minimo ? "CRÍTICO" : "Normal"
      ])
    ];
    const wsConos = XLSX.utils.aoa_to_sheet(conosData);
    wsConos["!cols"] = [14,14,12,10,12,10,20,14,10].map(w=>({wch:w}));
    XLSX.utils.book_append_sheet(wb, wsConos, "Conos");

    // ── Hoja 3: Pedidos B2B ──────────────────────
    const pedidosData = [
      ["PEDIDOS B2B — " + mes.toUpperCase()],
      [],
      ["N° Pedido", "Importadora", "País", "Prendas", "Material", "Valor S/", "Adelanto %", "Saldo S/", "Entrega", "Estado"],
      ...pedidos.map(p => {
        const adelanto = p.adelanto || 50;
        return [
          p.id, p.importadora || p.country, p.pais || p.country,
          p.prendas || "100", p.material || "Lana",
          p.valor || p.value, adelanto + "%",
          Math.round((p.valor || p.value) * (1 - adelanto/100)),
          p.entrega || p.deadline, (p.estado || p.stage || "").toUpperCase()
        ];
      })
    ];
    const wsPedidos = XLSX.utils.aoa_to_sheet(pedidosData);
    wsPedidos["!cols"] = [16,22,14,16,14,12,10,12,12,14].map(w=>({wch:w}));
    XLSX.utils.book_append_sheet(wb, wsPedidos, "Pedidos B2B");

    // ── Hoja 4: Nómina ───────────────────────────
    const nominaData = [
      ["NÓMINA DE EMPLEADAS — " + mes.toUpperCase()],
      [],
      ["Nombre", "Rol", "Turno", "Tipo pago", "Prendas mes", "Monto S/", "Estado"],
      ...empleados.map(e => [
        e.nombre, e.rol, e.turno,
        e.pago === "sueldo" ? "Sueldo fijo" : "Por destajo",
        e.prendas, e.monto, (e.estado || "").toUpperCase()
      ]),
      [],
      ["", "", "", "TOTAL NÓMINA", "", empleados.reduce((s,e)=>s+(e.monto||0),0)]
    ];
    const wsNomina = XLSX.utils.aoa_to_sheet(nominaData);
    wsNomina["!cols"] = [22,18,12,14,14,12,12].map(w=>({wch:w}));
    XLSX.utils.book_append_sheet(wb, wsNomina, "Nómina");

    // ── Descargar ────────────────────────────────
    const nombreArchivo = `LaneraPro_Reporte_${new Date().toLocaleDateString("es-PE").replace(/\//g,"-")}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  };
  const [activeSubTab, setActiveSubTab] = useState('income'); // 'income' or 'expenses'

  const income = [
    { id: 1, customer: 'Expo Andes S.A.C.', order: '#1024', amount: 2500, type: 'Adelanto (50%)', date: '2026-05-01', status: 'Cobrado' },
    { id: 2, customer: 'Global Textile', order: '#1025', amount: 6000, type: 'Adelanto (50%)', date: '2026-05-05', status: 'Cobrado' },
    { id: 3, customer: 'Expo Andes S.A.C.', order: '#1024', amount: 2500, type: 'Saldo Final', date: '2026-05-20', status: 'Pendiente' },
  ];

  const expenses = [
    { id: 1, employee: 'Juan Perez', concept: 'Producción Pedido #1024', amount: 450.00, date: '2026-05-07', status: 'Pagado' },
    { id: 2, employee: 'Maria Lopez', concept: 'Producción Pedido #1025', amount: 820.00, date: '2026-05-07', status: 'Pendiente' },
    { id: 3, employee: 'Carlos Ruíz', concept: 'Acabados Mayo', amount: 1200.00, date: '2026-05-01', status: 'Pagado' },
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestión Financiera</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Seguimiento de ingresos por ventas y egresos por pagos a trabajadores.</p>
        </div>
        <button
          onClick={exportarExcel}
          style={{
            padding:"8px 16px",
            background:"rgba(76,175,130,0.12)",
            border:"0.5px solid rgba(76,175,130,0.4)",
            borderRadius:8, color:"#4CAF82",
            cursor:"pointer", fontSize:12,
            fontFamily:"monospace", fontWeight:500,
            display:"flex", alignItems:"center", gap:6
          }}
        >
          📊 Exportar reporte Excel
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          className="btn-primary" 
          style={{ background: activeSubTab === 'income' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', flex: 1 }}
          onClick={() => setActiveSubTab('income')}
        >
          Ingresos (Ventas)
        </button>
        <button 
          className="btn-primary" 
          style={{ background: activeSubTab === 'expenses' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', flex: 1 }}
          onClick={() => setActiveSubTab('expenses')}
        >
          Egresos (Pagos a Personal)
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{activeSubTab === 'income' ? 'Pagos Recibidos de Clientes' : 'Pagos a Trabajadores (Destajo)'}</h2>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: activeSubTab === 'income' ? '#27ae60' : '#e74c3c' }}>
            Total: {activeSubTab === 'income' ? '$8,500.00' : '$2,470.00'}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th>{activeSubTab === 'income' ? 'Cliente / Pedido' : 'Empleado / Concepto'}</th>
              <th>Monto</th>
              <th>Tipo/Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {(activeSubTab === 'income' ? income : expenses).map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.date}</td>
                <td>
                  <div style={{ fontWeight: '500' }}>{item.customer || item.employee}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.order || item.concept}</div>
                </td>
                <td style={{ fontWeight: 'bold' }}>${item.amount.toFixed(2)}</td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                    background: item.status === 'Pendiente' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(39, 174, 96, 0.2)',
                    color: item.status === 'Pendiente' ? '#e74c3c' : '#27ae60'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status === 'Pendiente' && (
                    <button className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}>
                      {activeSubTab === 'income' ? 'Confirmar Cobro' : 'Pagar Ahora'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancesView;
