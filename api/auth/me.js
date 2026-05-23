import { getCurrentUser, serializeUser } from '../_shared/auth.js';
import { methodNotAllowed, withConfig } from '../_shared/http.js';

export default withConfig(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({ message: 'No autenticado.' });
  }

  return res.status(200).json({ user: serializeUser(user) });
});
