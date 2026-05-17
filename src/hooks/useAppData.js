import { useState, useEffect } from 'react';

export const useAppData = () => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lanera_orders');
    return saved ? JSON.parse(saved) : [
      { id: '1024', country: 'Chile', value: 5000, stage: 'En producción', assignedTo: 'emp_1', deadline: '2026-05-15', historial: [{ fecha: "2026-05-01T09:00:00", estado: "Cotización", usuario: "Becerra (admin)", nota: "Pedido creado" }] },
      { id: '1025', country: 'USA', value: 12000, stage: 'Confirmado', assignedTo: 'admin', deadline: '2026-06-01', historial: [{ fecha: "2026-05-01T09:00:00", estado: "Cotización", usuario: "Becerra (admin)", nota: "Pedido creado" }] },
      { id: '1026', country: 'España', value: 8500, stage: 'En producción', assignedTo: 'emp_1', deadline: '2026-05-20', historial: [{ fecha: "2026-05-01T09:00:00", estado: "Cotización", usuario: "Becerra (admin)", nota: "Pedido creado" }] },
    ];
  });

  const [conos, setConos] = useState(() => {
    const saved = localStorage.getItem('lanera_conos');
    return saved ? JSON.parse(saved) : [
      { id: "C-001", color: "Azul Marino", material: "Lana", peso: 1000, stock: 15, minimo: 5, proveedor: "TexAndes", precio: 25 },
      { id: "C-002", color: "Rojo Carmín", material: "Algodón", peso: 1000, stock: 3, minimo: 5, proveedor: "Hilandería Sur", precio: 20 },
    ];
  });

  const [produccion, setProduccion] = useState(() => {
    const saved = localStorage.getItem('lanera_produccion');
    return saved ? JSON.parse(saved) : [];
  });

  const [empleados, setEmpleados] = useState(() => {
    const saved = localStorage.getItem('lanera_empleados');
    return saved ? JSON.parse(saved) : [
      { id: "emp_1", nombre: "Maria Lopez", rol: "Tejedora", turno: "Mañana", pago: "destajo", prendas: 0, monto: 0, estado: "activo" },
      { id: "emp_2", nombre: "Juan Perez", rol: "Tejedora", turno: "Tarde", pago: "sueldo", prendas: 0, monto: 1200, estado: "activo" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lanera_orders', JSON.stringify(orders));
    localStorage.setItem('lanera_conos', JSON.stringify(conos));
    localStorage.setItem('lanera_produccion', JSON.stringify(produccion));
    localStorage.setItem('lanera_empleados', JSON.stringify(empleados));
  }, [orders, conos, produccion, empleados]);

  return { 
    orders, setOrders, 
    conos, setConos, 
    produccion, setProduccion, 
    empleados, setEmpleados 
  };
};
