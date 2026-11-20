// Data layer for the Collaborator frontend.
//
// The frontend talks DIRECTLY to Supabase (Postgres) — there is no custom
// backend server. Every function below keeps the same name, arguments and
// return shape the UI already uses; only the data source changed from
// `fetch` to the Supabase JS client.
//
// Tables (see db/schema.sql, db/rls_policies.sql):
//   listings         — public offers and needs
//   connect_requests — connect requests sent for a listing
import { configError, supabase, supabaseConfigured } from './supabase'

function toError(error) {
  // A failed network request (Supabase unreachable) comes back as a plain
  // "Failed to fetch" — turn it into a message the UI can show.
  const message = error && error.message ? String(error.message) : 'Request failed'
  if (/failed to fetch|networkerror|network request failed|load failed/i.test(message)) {
    return new Error('The Supabase database is unreachable. Check your connection and try again.')
  }
  const err = new Error(message)
  if (error && error.code) err.code = error.code
  if (error && error.details) err.details = error.details
  return err
}

function requireConfig() {
  if (!supabaseConfigured) throw configError()
}

// Escape the characters that are special inside a PostgREST `or(...)`
// filter or a Postgres ILIKE pattern, so a search word can never break
// the query or act as a wildcard.
function escapeSearchTerm(term) {
  return String(term)
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/[,()]/g, ' ')
    .trim()
}

export async function getHealth() {
  requireConfig()
  const { error } = await supabase.from('listings').select('id', { count: 'exact', head: true })
  if (error) throw toError(error)
  return { status: 'ok', db: 'connected' }
}

export async function getListings({ search = '', sector = '', type = '' } = {}) {
  requireConfig()
  let query = supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })

  if (type === 'offer' || type === 'need') query = query.eq('type', type)
  if (sector && SECTORS.includes(sector)) query = query.eq('sector', sector)
  if (search && String(search).trim() !== '') {
    const term = escapeSearchTerm(search)
    if (term !== '') {
      const pattern = `%${term}%`
      query = query.or(
        `title.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern},provider_name.ilike.${pattern}`,
      )
    }
  }

  const { data, error } = await query
  if (error) throw toError(error)
  return Array.isArray(data) ? data : []
}

export async function getListing(id) {
  requireConfig()
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) {
    const err = new Error('Invalid listing id')
    err.status = 400
    throw err
  }
  const { data, error } = await supabase.from('listings').select('*').eq('id', numericId).maybeSingle()
  if (error) throw toError(error)
  if (!data) {
    const err = new Error('Listing not found')
    err.status = 404
    throw err
  }
  return data
}

export async function createListing(payload) {
  requireConfig()
  const { title, description, type, sector, location, provider_name, contact_name } = payload || {}

  // Same validation the old backend did, so the form sees the same messages.
  const errors = []
  if (!title || String(title).trim() === '') errors.push('title is required')
  if (!description || String(description).trim() === '') errors.push('description is required')
  if (type !== 'offer' && type !== 'need') errors.push("type must be 'offer' or 'need'")
  if (!sector || !SECTORS.includes(sector)) errors.push(`sector must be one of: ${SECTORS.join(', ')}`)
  if (!location || String(location).trim() === '') errors.push('location is required')
  if (!provider_name || String(provider_name).trim() === '') errors.push('provider_name is required')
  if (!contact_name || String(contact_name).trim() === '') errors.push('contact_name is required')
  if (errors.length > 0) {
    const err = new Error('Validation failed')
    err.status = 400
    err.details = errors
    throw err
  }

  const { data, error } = await supabase
    .from('listings')
    .insert({
      title: String(title).trim(),
      description: String(description).trim(),
      type,
      sector,
      location: String(location).trim(),
      provider_name: String(provider_name).trim(),
      contact_name: String(contact_name).trim(),
    })
    .select()
    .single()
  if (error) throw toError(error)
  return data
}

export async function connectToListing(id, payload) {
  requireConfig()
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) {
    const err = new Error('Invalid listing id')
    err.status = 400
    throw err
  }
  const { requester_name, message } = payload || {}
  if (!requester_name || String(requester_name).trim() === '') {
    const err = new Error('Validation failed')
    err.status = 400
    err.details = ['requester_name is required']
    throw err
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id')
    .eq('id', numericId)
    .maybeSingle()
  if (listingError) throw toError(listingError)
  if (!listing) {
    const err = new Error('Listing not found')
    err.status = 404
    throw err
  }

  const { data, error } = await supabase
    .from('connect_requests')
    .insert({
      listing_id: numericId,
      requester_name: String(requester_name).trim(),
      message: message ? String(message).trim() : null,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw toError(error)
  return data
}

export async function getMatches(location) {
  requireConfig()
  const trimmed = location ? String(location).trim() : ''
  if (trimmed === '') {
    const err = new Error('location query parameter is required')
    err.status = 400
    throw err
  }
  const term = escapeSearchTerm(trimmed)
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .ilike('location', `%${term}%`)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
  if (error) throw toError(error)
  const matches = Array.isArray(data) ? data : []
  return { location: trimmed, count: matches.length, matches }
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
]
