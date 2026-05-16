import React, { useState } from 'react';
import './index.css';

// Views
import DashboardView from './views/DashboardView';
import OrdersView from './views/OrdersView';
import EmployeesView from './views/EmployeesView';
import SecurityView from './views/SecurityView';
import LoginView from './views/LoginView';
import FinancesView from './views/FinancesView';
import GarmentsView from './views/GarmentsView';


// Hooks (Controller)
import { useAppData } from './hooks/useAppData';

// Icons
const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Orders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Package: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.27 6.96 8.73 5.04 8.73-5.04"></path><path d="M12 22.08V12"></path></svg>,
  Camera: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
  Dollar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lanera_session');
    return saved ? JSON.parse(saved) : null;
  });

  const { orders, setOrders } = useAppData();

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
      case 'dashboard': return <DashboardView user={currentUser} />;
      case 'orders': return <OrdersView user={currentUser} orders={orders} setOrders={updateOrders} />;
      case 'finances': return <FinancesView />;
      case 'importers': return <div className="animate-fade"><h1>Importadoras</h1></div>;
      case 'employees': return <EmployeesView user={currentUser} />;
      case 'garments': return <GarmentsView />;

      case 'security': return <SecurityView />;
      default: return <DashboardView user={currentUser} />;
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar glass-panel">
        <h2 style={{ color: 'var(--accent)', marginBottom: '2rem', fontWeight: '800' }}>LANERAPRO</h2>
        
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Icons.Dashboard /> Dashboard
        </div>
        
        <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <Icons.Orders /> {currentUser.role === 'admin' ? 'Pedidos B2B' : 'Mis Tareas'}
        </div>

        {currentUser.role === 'admin' && (
          <div className={`nav-item ${activeTab === 'finances' ? 'active' : ''}`} onClick={() => setActiveTab('finances')}>
            <Icons.Dollar /> Finanzas
          </div>
        )}
        
        {currentUser.role === 'admin' && (
          <>
            <div className={`nav-item ${activeTab === 'importers' ? 'active' : ''}`} onClick={() => setActiveTab('importers')}>
              <Icons.Users /> Importadoras
            </div>
            <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
              <Icons.Users /> Empleados
            </div>
          </>
        )}

        <div className={`nav-item ${activeTab === 'garments' ? 'active' : ''}`} onClick={() => setActiveTab('garments')}>
          <Icons.Package /> Prendas
        </div>

        {currentUser.role === 'admin' && (
          <div className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Icons.Camera /> Cámaras
          </div>
        )}

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }}></div>
            {currentUser.name} ({currentUser.role})
          </div>
          <button className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }} onClick={handleLogout}>
            <Icons.Logout /> Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
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
      </main>
    </div>
  );
}

export default App;
