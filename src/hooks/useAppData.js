import { useState, useEffect } from 'react';

export const useAppData = () => {


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

  const [garments, setGarments] = useState(() => {
    const saved = localStorage.getItem('lanera_garments');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Suéter Cuello en V - Colección Invierno",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop",
        programFile: "sueter_v_v1.hcd",
        notes: { vueltas: 450, tension: "7.2", hilo: "Lana Merino 2/28", aguja: "12G" }
      },
      {
        id: 2,
        name: "Cardigan Trenzado - Mujer",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1170&auto=format&fit=crop",
        programFile: "cardigan_trenza.hcd",
        notes: { vueltas: 680, tension: "6.5", hilo: "Algodón Peinado", aguja: "10G" }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lanera_conos', JSON.stringify(conos));
    localStorage.setItem('lanera_produccion', JSON.stringify(produccion));
    localStorage.setItem('lanera_empleados', JSON.stringify(empleados));
    localStorage.setItem('lanera_garments', JSON.stringify(garments));
  }, [conos, produccion, empleados, garments]);

  return { 
    conos, setConos, 
    produccion, setProduccion, 
    empleados, setEmpleados,
    garments, setGarments
  };
};
