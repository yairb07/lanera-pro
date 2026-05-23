import { query } from './_shared/db.js';
import { methodNotAllowed, withConfig } from './_shared/http.js';

export default withConfig(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  await query('select 1');
  return res.status(200).json({ ok: true, service: 'lanera-pro-api' });
});
