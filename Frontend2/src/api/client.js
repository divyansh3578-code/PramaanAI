// Thin fetch wrapper around the SIH Procurement Backend REST API.
// Reads the API base URL from VITE_API_URL (see .env.example), defaulting to
// the local dev server so `npm run dev` works out of the box against
// `npm run dev` on the backend.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'tenderverify_token'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, isMultipart = false, auth = true } = {}) {
  const headers = {}
  if (!isMultipart && body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isMultipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the backend. Check your connection and try again.', 0)
  }

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.details)
  }
  return data
}

export const api = {
  // --- token management (used by AuthContext) ---
  getToken,
  setToken,

  // --- auth ---
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  // --- bidders ---
  getMe: () => request('/bidders/me'),
  updateMe: (payload) => request('/bidders/me', { method: 'PATCH', body: payload }),
  listBidders: () => request('/bidders'),
  getBidder: (id) => request(`/bidders/${id}`),
  createBidder: (payload) => request('/bidders', { method: 'POST', body: payload }),

  // --- tenders ---
  listTenders: () => request('/tenders'),
  getTender: (id) => request(`/tenders/${id}`),
  createTender: (payload) => request('/tenders', { method: 'POST', body: payload }),

  // --- documents ---
  listDocuments: (bidderId) => request(`/documents/bidder/${bidderId}`),
  uploadDocument: (bidderId, file, documentType) => {
    const form = new FormData()
    form.append('document', file)
    if (documentType) form.append('documentType', documentType)
    return request(`/documents/bidder/${bidderId}`, { method: 'POST', body: form, isMultipart: true })
  },
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),

  // --- verification / evaluation matrix ---
  startVerification: (bidderId, tenderId) => request('/verification/start', { method: 'POST', body: { bidderId, tenderId } }),
  runAllVerification: (tenderId, rerun = false) => request('/verification/run-all', { method: 'POST', body: { tenderId, rerun } }),
  getMatrix: (tenderId) => request(`/verification/matrix${tenderId ? `?tenderId=${encodeURIComponent(tenderId)}` : ''}`),
  getConnectorsStatus: () => request('/verification/connectors/status'),
  getBidById: (bidId) => request(`/verification/bid/${bidId}`),confirmBidAction: (bidId, action) =>
  request('/verification/confirm-action', {
    method: 'POST',
    body: { bidId, action },
  }),

  // --- grievances (RTI & vigilance) ---
  createGrievance: (payload) => request('/grievances', { method: 'POST', body: payload }),
  myGrievances: () => request('/grievances/mine'),
  listGrievances: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/grievances${qs ? `?${qs}` : ''}`)
  },
  respondGrievance: (id, payload) => request(`/grievances/${id}`, { method: 'PATCH', body: payload }),

  // --- audit ---
  listAudit: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/audit${qs ? `?${qs}` : ''}`)
  },
}
