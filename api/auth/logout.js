import { clearSessionCookie } from '../_shared/cookies.js';
import { methodNotAllowed, withConfig } from '../_shared/http.js';

export default withConfig(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
});
