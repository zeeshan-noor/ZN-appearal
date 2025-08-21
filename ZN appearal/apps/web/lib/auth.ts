export function getToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('admin_token');
}

export function decodeJwt<T = any>(token: string): T | null {
	try {
		const payload = token.split('.')[1];
		const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decodeURIComponent(escape(json)));
	} catch {
		return null;
	}
}

export function isTokenValid(token: string | null): boolean {
	if (!token) return false;
	const payload = decodeJwt<{ exp?: number }>(token);
	if (!payload?.exp) return false;
	const now = Math.floor(Date.now() / 1000);
	return payload.exp > now;
}

export function requireTokenOrNull(): string | null {
	const token = getToken();
	return isTokenValid(token) ? (token as string) : null;
}

export function clearToken() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('admin_token');
}


