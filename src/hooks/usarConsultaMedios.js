import { useEffect, useState } from 'react';

export function usarConsultaMedios(consulta) {
  const obtenerCoincidencias = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(consulta).matches;
  };

  const [coincide, setCoincide] = useState(obtenerCoincidencias);

  useEffect(() => {
    const consultaMedio = window.matchMedia(consulta);
    const manejarCambio = () => setCoincide(consultaMedio.matches);

    manejarCambio();
    consultaMedio.addEventListener('change', manejarCambio);

    return () => consultaMedio.removeEventListener('change', manejarCambio);
  }, [consulta]);

  return coincide;
}
