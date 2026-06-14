import { useState, useEffect } from 'react';
import { api } from '../services/clienteApi';

export const useDatosApp = () => {
  const [conos, setConos] = useState([]);
  const [produccion, setProduccion] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [prendas, setPrendas] = useState([]);
  const [categoriasPrendas, setCategoriasPrendas] = useState(['General']);
  const [rolesEmpleados, setRolesEmpleados] = useState(['Tejedora', 'Remalladora', 'Acabados']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await api.get('/api/empleados').catch(() => []);
        const conosData = await api.get('/api/conos').catch(() => []);
        const prodData = await api.get('/api/produccion').catch(() => []);
        const prendasData = await api.get('/api/prendas').catch(() => []);
        const categoriasData = await api.get('/api/prendas/categorias').catch(() => []);
        const rolesData = await api.get('/api/empleados/roles').catch(() => []);
        
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
        
        // Mapeo de Categorías
        const mappedCats = (Array.isArray(categoriasData) ? categoriasData : []).map(c => c.name);
        if(mappedCats.length === 0) mappedCats.push('General');

        // Mapeo de Roles de Empleados
        const mappedRoles = (Array.isArray(rolesData) ? rolesData : []).map(r => r.name);
        if(mappedRoles.length > 0) setRolesEmpleados(mappedRoles);

        // Mapeo de Prendas
        const mappedPrendas = (Array.isArray(prendasData) ? prendasData : []).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category_name || 'General',
          image: p.image_url || "https://images.unsplash.com/photo-1434031219129-14e5c876f628?q=80&w=1170&auto=format&fit=crop",
          programFile: p.file_program || "diseño_heng_qiang.hcd",
          isFavorite: p.is_favorite || false,
          createdAt: p.created_at || new Date().toISOString(),
          machineType: p.machine_type || 'computarizada',
          patternReference: p.pattern_reference || '',
          manualTension: p.manual_tension || '',
          notes: {
            vueltas: p.laps,
            tension: p.tension,
            hilo: p.yarn_type,
            aguja: p.needle
          }
        }));

        setEmpleados(mappedEmpleados);
        setConos(mappedConos);
        setCategoriasPrendas(mappedCats);
        setPrendas(mappedPrendas);
        
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
    categoriasPrendas, setCategoriasPrendas,
    rolesEmpleados, setRolesEmpleados,
    loading
  };
};
