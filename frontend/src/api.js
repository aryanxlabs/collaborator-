const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || 'Request failed');
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

export function getHealth() {
  return request('/api/health');
}

export function getListings({ search = '', sector = '', type = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (sector) params.set('sector', sector);
  if (type) params.set('type', type);
  const qs = params.toString();
  return request(`/api/listings${qs ? `?${qs}` : ''}`);
}

export function getListing(id) {
  return request(`/api/listings/${id}`);
}

export function createListing(payload) {
  return request('/api/listings', { method: 'POST', body: JSON.stringify(payload) });
}

export function connectToListing(id, payload) {
  return request(`/api/listings/${id}/connect`, { method: 'POST', body: JSON.stringify(payload) });
}

export function getMatches(location) {
  return request(`/api/matches?location=${encodeURIComponent(location)}`);
}

export const SECTORS = [
  'Packaging',
  'Marketing',
  'Transport',
  'Digital Help',
  'Food Processing',
  'Textiles',
  'Dairy',
  'Handicrafts',
];
