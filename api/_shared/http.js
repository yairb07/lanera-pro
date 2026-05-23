import { assertApiConfig } from './config.js';

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed);
  return res.status(405).json({ message: 'Metodo no permitido.' });
}

export function handleApiError(res, error) {
  console.error(error);

  if (error.name === 'ZodError') {
    return res.status(400).json({ message: 'Datos invalidos.', errors: error.issues });
  }

  return res.status(500).json({ message: 'Error interno del servidor.' });
}

export function withConfig(handler) {
  return async (req, res) => {
    try {
      assertApiConfig();
      return await handler(req, res);
    } catch (error) {
      return handleApiError(res, error);
    }
  };
}
