import { useState } from 'react';
import './index.css';

// Views
import DashboardView from './views/DashboardView';
import OrdersView from './views/OrdersView';
import EmployeesView from './views/EmployeesView';
import LoginView from './views/LoginView';
import GarmentsView from './views/GarmentsView';
import ProductionView from './views/ProductionView';
import KardexView from './views/KardexView';



// Hooks (Controller)
import { useAppData } from './hooks/useAppData';
import { useMediaQuery } from './hooks/useMediaQuery';

// Icons
const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Orders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Package: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.27 6.96 8.73 5.04 8.73-5.04"></path><path d="M12 22.08V12"></path></svg>,
  Kardex: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  Camera: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
  Dollar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Factory: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lanera_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const isMobile = useMediaQuery('(max-width: 767px)');

  const { orders, setOrders, conos, setConos, produccion, setProduccion, empleados, garments, setGarments } = useAppData();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('lanera_session', JSON.stringify(user));
    setActiveTab('dashboard');
    showToast(`Bienvenido, ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lanera_session');
    showToast('Sesión cerrada correctamente');
  };

  const updateOrders = (newOrders) => {
    setOrders(newOrders);
    showToast('¡Pedido actualizado con éxito!');
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView user={currentUser} produccion={produccion} pedidos={orders} conos={conos} setActiveTab={setActiveTab} />;
      case 'orders': return <OrdersView user={currentUser} orders={orders} setOrders={updateOrders} />;

      case 'employees': return <EmployeesView user={currentUser} />;
      case 'garments': return <GarmentsView garments={garments} setGarments={setGarments} />;
      case 'production': return <ProductionView conos={conos} setConos={setConos} produccion={produccion} setProduccion={setProduccion} empleados={empleados} garments={garments} />;
      case 'kardex': return <KardexView />;

      default: return <DashboardView user={currentUser} produccion={produccion} pedidos={orders} conos={conos} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      <nav 
        className={`glass-panel`} 
        style={{
          width: isSidebarCollapsed ? 80 : 260,
          flexShrink: 0,
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 200 : 100,
          height: "100vh",
          display: isMobile && isSidebarCollapsed ? "none" : "flex",
          flexDirection: "column",
          transition: "width .25s",
          padding: isSidebarCollapsed ? "2rem 1rem" : "2rem",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          {!isSidebarCollapsed && <h2 style={{ color: 'var(--accent)', margin: 0, fontWeight: '800' }}>LANERAPRO</h2>}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ 
              background: 'var(--accent-soft)', border: 'none', color: 'var(--accent)', 
              borderRadius: '8px', cursor: 'pointer', padding: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: isSidebarCollapsed ? '0 auto' : '0'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); if(isMobile) setIsSidebarCollapsed(true); }}>
            <Icons.Dashboard /> {!isSidebarCollapsed && <span className="nav-text">Dashboard</span>}
          </div>
          
          <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); if(isMobile) setIsSidebarCollapsed(true); }}>
            <Icons.Orders /> {!isSidebarCollapsed && <span className="nav-text">{currentUser.role === 'admin' ? 'Pedidos B2B' : 'Mis Tareas'}</span>}
          </div>
          
          {currentUser.role === 'admin' && (
            <>
              <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => { setActiveTab('employees'); if(isMobile) setIsSidebarCollapsed(true); }}>
                <Icons.Users /> {!isSidebarCollapsed && <span className="nav-text">Empleados</span>}
              </div>
            </>
          )}

          <div className={`nav-item ${activeTab === 'garments' ? 'active' : ''}`} onClick={() => { setActiveTab('garments'); if(isMobile) setIsSidebarCollapsed(true); }}>
            <Icons.Package /> {!isSidebarCollapsed && <span className="nav-text">Prendas</span>}
          </div>

          <div className={`nav-item ${activeTab === 'production' ? 'active' : ''}`} onClick={() => { setActiveTab('production'); if(isMobile) setIsSidebarCollapsed(true); }}>
            <Icons.Factory /> {!isSidebarCollapsed && <span className="nav-text">Producción</span>}
          </div>

          <div className={`nav-item ${activeTab === 'kardex' ? 'active' : ''}`} onClick={() => { setActiveTab('kardex'); if(isMobile) setIsSidebarCollapsed(true); }}>
            <Icons.Kardex /> {!isSidebarCollapsed && <span className="nav-text">Kardex Conos</span>}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          {!isSidebarCollapsed && (
            <div className="user-info" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }}></div>
              {currentUser.name} ({currentUser.role})
            </div>
          )}
          <button className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }} onClick={handleLogout}>
            <Icons.Logout /> {!isSidebarCollapsed && <span className="nav-text">Cerrar Sesión</span>}
          </button>
        </div>
      </nav>

      {/* OVERLAY PARA MÓVIL */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          onClick={() => setIsSidebarCollapsed(true)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }}
        />
      )}

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: isMobile ? "100%" : "auto",
        minWidth: 0,
      }}>
        {/* TOPBAR EN MÓVIL PARA ABRIR SIDEBAR */}
        {isMobile && (
          <div style={{ display: 'flex', padding: '12px', background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center' }}>
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 style={{ color: 'var(--accent)', margin: '0 0 0 1rem', fontSize: '1.2rem', fontWeight: '800' }}>LANERAPRO</h2>
          </div>
        )}

        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: isMobile ? "12px" : "2rem",
          WebkitOverflowScrolling: "touch",
        }}>
          {toast && (
            <div className="animate-fade" style={{
              position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--accent)',
              color: 'white', padding: '1rem 2rem', borderRadius: '8px', zIndex: 2000,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: '600'
            }}>
              {toast}
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
