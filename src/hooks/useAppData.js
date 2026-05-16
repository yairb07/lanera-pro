import { useState, useEffect } from 'react';

export const useAppData = () => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lanera_orders');
    return saved ? JSON.parse(saved) : [
      { id: '1024', country: 'Chile', value: 5000, stage: 'En producción', assignedTo: 'emp_1', deadline: '2026-05-15' },
      { id: '1025', country: 'USA', value: 12000, stage: 'Confirmado', assignedTo: 'admin', deadline: '2026-06-01' },
      { id: '1026', country: 'España', value: 8500, stage: 'En producción', assignedTo: 'emp_1', deadline: '2026-05-20' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('lanera_orders', JSON.stringify(orders));
  }, [orders]);

  return { orders, setOrders };
};
