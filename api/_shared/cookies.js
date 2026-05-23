const COOKIE_NAME = 'lanera_session';

export function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(cookie => cookie.trim())
      .filter(Boolean)
      .map(cookie => {
        const separatorIndex = cookie.indexOf('=');
        const key = cookie.slice(0, separatorIndex);
        const value = cookie.slice(separatorIndex + 1);
        return [key, decodeURIComponent(value)];
      }),
  );
}

export function getSessionToken(req) {
  return parseCookies(req.headers.cookie)[COOKIE_NAME];
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax; Secure`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`);
}
