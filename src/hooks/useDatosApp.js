import { useState, useEffect } from 'react';
import { api } from '../services/clienteApi';

export const useDatosApp = () => {
  const [conos, setConos] = useState([]);
  const [produccion, setProduccion] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await api.get('/api/empleados').catch(() => []);
        const conosData = await api.get('/api/conos').catch(() => []);
        const prodData = await api.get('/api/produccion').catch(() => []);
        
        // Mapeo de Empleados (Backend snake_case -> Frontend camelCase)
        const mappedEmpleados = (Array.isArray(empData) ? empData : []).map(e => ({
          id: e.id,
          nombre: e.full_name,
          rol: e.job_role,
          turno: e.shift,
          pago: e.payment_type === 'salary' ? 'sueldo' : 'destajo',
          monto: Number(e.base_amount),
          estado: e.status === 'active' ? 'activo' : 'inactivo',
          prendas: e.total_prendas || 0,
          tareas: e.active_tasks || 0
        }));

        // Mapeo de Conos
        const mappedConos = (Array.isArray(conosData) ? conosData : []).map(c => ({
          id: c.id,
          codigo: c.code,
          marca: c.brand || 'Desconocida',
          color: c.color,
          material: c.material || 'Hilo',
          peso: c.weight_grams + 'g',
          pesoGramos: c.weight_grams,
          stock: c.stock_cones,
          minimo: c.min_stock_cones,
          proveedor: c.supplier || '',
          precio: c.unit_price
        }));

        setEmpleados(mappedEmpleados);
        setConos(mappedConos);
        
        if (Array.isArray(prodData)) {
          setProduccion(prodData.map(p => ({
            id: p.id,
            empleadoId: p.employee_id,
            prendaTipo: p.garment_type || 'Desconocido',
            conoUsadoId: p.cone_id,
            cantidad: p.quantity,
            gramaje: p.weight_per_garment,
            fecha: p.created_at
          })));
        }

      } catch (error) {
        console.error("Error cargando datos desde la API remota:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { 
    conos, setConos, 
    produccion, setProduccion, 
    empleados, setEmpleados,
    prendas, setPrendas,
    loading
  };
};
