

export class ErrorApi extends Error {
  constructor(mensaje, estado, detalles) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
    this.detalles = detalles;
  }
}

export async function peticionApi(ruta, opciones = {}) {
  const API_URL = import.meta.env.VITE_API_URL || '';

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
    ...opciones,
  });

  const esJson = respuesta.headers.get('content-type')?.includes('application/json');
  const cargaDatos = esJson ? await respuesta.json() : null;

  if (!respuesta.ok) {
    throw new ErrorApi(cargaDatos?.message || 'Error de API.', respuesta.status, cargaDatos);
  }

  return cargaDatos;
}

export const api = {
  get: (ruta) => peticionApi(ruta),
  post: (ruta, cuerpo) => peticionApi(ruta, { method: 'POST', body: JSON.stringify(cuerpo) }),
  put: (ruta, cuerpo) => peticionApi(ruta, { method: 'PUT', body: JSON.stringify(cuerpo) }),
  patch: (ruta, cuerpo) => peticionApi(ruta, { method: 'PATCH', body: JSON.stringify(cuerpo) }),
  delete: (ruta) => peticionApi(ruta, { method: 'DELETE' }),
};
