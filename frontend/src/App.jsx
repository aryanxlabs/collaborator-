import { useCallback, useEffect, useState } from 'react'
import {
  SECTORS,
  connectToListing,
  createListing,
  getListings,
  getMatches,
} from './api'
import { usePopIn } from './hooks'
import './index.css'

const SERVICES = [
  { icon: '🤝', title: 'Skill Exchange', text: 'Trade what you know for what you need. No money has to change hands.' },
  { icon: '💰', title: 'Paid Services', text: 'Hire a neighbour for packaging, marketing, transport or digital help.' },
  { icon: '🙌', title: 'Voluntary Help', text: 'Get a hand from people nearby who simply want local business to grow.' },
  { icon: '📦', title: 'Resource Sharing', text: 'Share machines, storage, vehicles and tools instead of buying new.' },
]

const FEATURES = [
  { icon: '🔍', title: 'Find the right match', text: 'Search offers and needs by sector and location, and see who is near you.' },
  { icon: '💬', title: 'Talk directly', text: 'Connect with the other business and agree on terms yourselves. No middleman.' },
  { icon: '📖', title: 'Learn from every job', text: 'Share what worked as Problem → Action → Outcome, so the next business learns faster.' },
  { icon: '🌾', title: 'Built for rural Maharashtra', text: 'Sectors, places and language that fit village businesses, not city marketplaces.' },
  { icon: '🤲', title: 'Help or hire, your choice', text: 'Skill exchange, paid work, voluntary help and joint projects all live in one place.' },
  { icon: '🔒', title: 'Your details stay yours', text: 'Listings are public. Your contact details are shared only when you connect.' },
]

const CASE_STUDIES = [
  {
    title: 'Spice producer finds packaging help',
    problem: 'Malvan Spice House sold great spice mixes, but loose pouches kept buyers away from shops.',
    action: 'They posted a need on Collaborator. Shree Packaging Solutions from Kolhapur answered and supplied printed pouches and labels.',
    outcome: 'The spice mixes now sit on shop shelves in three towns, and orders have doubled.',
  },
  {
    title: 'Warli artists open an online shop',
    problem: 'Warli painters in Palghar had buyers only at local fairs and no way to take online orders.',
    action: 'A digital-help volunteer from TechMitra showed them how to list paintings online and take UPI payments.',
    outcome: 'They now sell paintings to buyers in Pune and Mumbai without leaving the village.',
  },
  {
    title: 'Dairy farmers share a chilling unit',
    problem: 'Small dairy farmers in Sangli lost milk on hot days because no one could afford a chilling unit alone.',
    action: 'The Gokul Dairy Collective shared its spare chilling capacity with nearby farmers through Collaborator.',
    outcome: 'Milk wastage fell, and twelve families now earn a steady daily income from milk.',
  },
]

const FAQS = [
  {
    q: 'What is Collaborator?',
    a: 'Collaborator is a platform where rural entrepreneurs in Maharashtra find each other to exchange skills, share resources and work together. It is not a shop: it is for collaboration, not buying and selling products.',
  },
  {
    q: 'How does matching work?',
    a: 'You post a need or an offer with your sector and location. Other businesses browse the showcase and connect with you. You agree on the terms directly, face to face or on a call.',
  },
  {
    q: 'Do I have to pay to use it?',
    a: 'Posting a need or an offer is free. If you hire someone for a paid service, you pay them directly, and you both agree the amount together.',
  },
  {
    q: 'I am not good with computers. Can I still use it?',
    a: 'Yes. The site is simple: post what you need or what you offer, in a few lines. A friend, family member or local volunteer can help you post your first listing.',
  },
]

const CALENDAR_WEEKS = [
  { label: 'Week 1 · Days 1–7', text: 'Create your profile and post your first need or offer.' },
  { label: 'Week 2 · Days 8–14', text: 'Browse the showcase and find two or three good matches.' },
  { label: 'Week 3 · Days 15–21', text: 'Connect, talk, and agree on terms for your first collaboration.' },
  { label: 'Week 4 · Days 22–30', text: 'Work together and share your lesson as Problem → Action → Outcome.' },
]

function weekOf(day) {
  if (day <= 7) return 'w1'
  if (day <= 14) return 'w2'
  if (day <= 21) return 'w3'
  return 'w4'
}

export default function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [type, setType] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const loadListings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getListings({ search, sector, type })
      setListings(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Could not load listings.')
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [search, sector, type])

  useEffect(() => {
    const timer = setTimeout(loadListings, 300)
    return () => clearTimeout(timer)
  }, [loadListings])

  usePopIn([listings, loading])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#top">
            Collaborator<span>.</span>
          </a>
          <nav className="nav-links">
            <a href="#showcase">Showcase</a>
            <a href="#how">How it works</a>
            <a href="#plan">30-day plan</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="btn btn-blue nav-cta" href="#post">
            Post a listing
          </a>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <div className="hero" id="top">
        <div className="container hero-grid">
          <div>
            <h1 className="pop in-view">
              Find skills. <span className="strike">Buy things.</span>
              <br />
              Share skills. <span className="hl-teal">Grow Together.</span>
            </h1>
            <p className="lead pop in-view" style={{ '--d': '0.1s' }}>
              Collaborator connects rural entrepreneurs across Maharashtra to exchange
              skills, share resources and discover partners — so a small business is
              never stuck for help.
            </p>
            <div className="hero-actions pop in-view" style={{ '--d': '0.2s' }}>
              <a className="btn btn-primary" href="#post">
                Get started
              </a>
              <a className="btn btn-outline" href="#showcase">
                Explore opportunities
              </a>
            </div>
            <div className="service-cards">
              {SERVICES.map((s, i) => (
                <div className="service-card pop in-view" key={s.title} style={{ '--d': `${0.25 + i * 0.08}s` }}>
                  <div className="icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="phone-wrap pop in-view" style={{ '--d': '0.3s' }}>
            <div className="phone">
              <div className="phone-screen">
                <img
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80"
                  alt="A farmer holding freshly harvested produce"
                />
                <div className="phone-body">
                  <span className="phone-tag">NEED · PACKAGING</span>
                  <h3>Spice producer needs packaging help</h3>
                  <p>Malvan, Sindhudurg · Posted by Malvan Spice House</p>
                </div>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat">
                <b>{listings.length || '12'}</b>
                <span>Live listings</span>
              </div>
              <div className="stat">
                <b>8</b>
                <span>Sectors</span>
              </div>
              <div className="stat">
                <b>30</b>
                <span>Day plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- showcase ---------- */}
      <section id="showcase">
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">Showcase</span>
            <h2 className="section-title">Offers and needs near you</h2>
            <p className="section-sub">
              Real offers and needs from rural businesses. Search, filter, and connect
              with the ones that fit you.
            </p>
          </div>

          <div className="filters pop">
            <input
              type="search"
              placeholder="Search skills, places, businesses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search listings"
            />
            <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector">
              <option value="">All sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="chips pop">
            {['', 'offer', 'need'].map((t) => (
              <button
                key={t || 'all'}
                type="button"
                className={`chip${type === t ? ' active' : ''}`}
                onClick={() => setType(t)}
              >
                {t === '' ? 'All' : t === 'offer' ? 'Offers' : 'Needs'}
              </button>
            ))}
          </div>

          {error && (
            <div className="error-box" role="alert">
              <strong>Listings could not be loaded.</strong>
              <br />
              {error} Check that the backend and the MySQL database are running.
            </div>
          )}

          {loading ? (
            <p className="empty">Loading listings…</p>
          ) : listings.length === 0 && !error ? (
            <p className="empty">No listings match your search yet. Try a different word or sector.</p>
          ) : (
            <div className="cards">
              {listings.map((l, i) => (
                <button
                  type="button"
                  className="card pop"
                  key={l.id}
                  style={{ '--d': `${(i % 3) * 0.08}s` }}
                  onClick={() => setSelected(l)}
                >
                  <span className={`badge ${l.type}`}>{l.type === 'offer' ? 'Offer' : 'Need'}</span>
                  <h3>{l.title}</h3>
                  <p>{l.description}</p>
                  <div className="meta">
                    <b>{l.provider_name}</b> · {l.location}
                    <br />
                    Sector: {l.sector} · Contact: {l.contact_name}
                  </div>
                  <span className="btn btn-blue">View details</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section id="how" style={{ background: '#fff' }}>
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">Need → Match → Collaborate → Learn</h2>
            <p className="section-sub">Four simple steps. No complicated forms, no middleman.</p>
          </div>
          <div className="steps">
            {[
              { n: '1', t: 'Post a need or offer', d: 'Say what you need or what you can offer, with your sector and location.' },
              { n: '2', t: 'Find your match', d: 'Browse the showcase and see who nearby fits what you are looking for.' },
              { n: '3', t: 'Connect and agree', d: 'Send a connect request, talk directly, and agree on terms together.' },
              { n: '4', t: 'Work and share lessons', d: 'Collaborate, then share the lesson as Problem → Action → Outcome.' },
            ].map((s, i) => (
              <div className="step pop" key={s.n} style={{ '--d': `${i * 0.08}s` }}>
                <div className="num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- statement / features ---------- */}
      <section className="statement">
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">Why Collaborator</span>
            <h2 className="section-title">Skills are everywhere. Connections are not.</h2>
            <p className="section-sub">
              Useful skills already exist in nearby villages, but offers and needs are
              scattered across personal contacts, WhatsApp groups and local markets.
              Collaborator brings them into one place.
            </p>
          </div>
          <div className="features">
            {FEATURES.map((f, i) => (
              <div className="feature pop" key={f.title} style={{ '--d': `${(i % 3) * 0.08}s` }}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 30-day plan ---------- */}
      <section id="plan">
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">Your first 30 days</span>
            <h2 className="section-title">A simple plan to your first collaboration</h2>
            <p className="section-sub">
              Follow the calendar. In one month you can go from your first listing to
              your first finished collaboration.
            </p>
          </div>
          <div className="calendar pop">
            <div className="cal-weeks">
              {CALENDAR_WEEKS.map((w) => (
                <div className="cal-week" key={w.label}>
                  <b>{w.label}</b>
                  {w.text}
                </div>
              ))}
            </div>
            <div className="cal-grid">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div className={`cal-day ${weekOf(day)}`} key={day}>
                  {day}
                  <span>Day {day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- case studies ---------- */}
      <section id="cases" style={{ background: '#fff' }}>
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">Case studies</span>
            <h2 className="section-title">Real collaborations, real lessons</h2>
            <p className="section-sub">
              Every collaboration ends with a lesson, shared as Problem → Action →
              Outcome, so the next business starts ahead.
            </p>
          </div>
          <div className="case-cards">
            {CASE_STUDIES.map((c, i) => (
              <article className="case-card pop" key={c.title} style={{ '--d': `${i * 0.08}s` }}>
                <h3>{c.title}</h3>
                <div className="case-row">
                  <b>Problem</b>
                  <p>{c.problem}</p>
                </div>
                <div className="case-row">
                  <b>Action</b>
                  <p>{c.action}</p>
                </div>
                <div className="case-row">
                  <b>Outcome</b>
                  <p>{c.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- post a listing ---------- */}
      <section id="post">
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">Post a listing</span>
            <h2 className="section-title">Tell others what you need or offer</h2>
            <p className="section-sub">
              It takes two minutes. Your listing appears in the showcase for every
              business to find.
            </p>
          </div>
          <PostForm onPosted={(listing) => { setListings((prev) => [listing, ...prev]); setToast('Your listing is live in the showcase.'); }} />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" style={{ background: '#fff' }}>
        <div className="container">
          <div className="center pop">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title">Questions, answered</h2>
          </div>
          <div className="faq">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- pink CTA + scan card ---------- */}
      <section>
        <div className="container">
          <div className="scan-cta pop">
            <div>
              <h2>Your next partner might be one village away.</h2>
              <p>
                Post your need or offer today, or scan your location to see who is
                already looking for someone like you.
              </p>
              <a className="btn btn-blue" href="#post">
                Get started — it is free
              </a>
            </div>
            <ScanCard onPick={(listing) => setSelected(listing)} />
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>Collaborator – Grow Together</h3>
              <p>
                A rural entrepreneur collaboration and skill exchange platform for
                Maharashtra. Idea Lab III · Department of Computer Engineering.
              </p>
            </div>
            <div>
              <h3>Explore</h3>
              <a href="#showcase">Showcase</a>
              <a href="#how">How it works</a>
              <a href="#plan">30-day plan</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h3>About</h3>
              <a href="#cases">Case studies</a>
              <a href="#post">Post a listing</a>
              <a href="#top">Back to top</a>
            </div>
          </div>
          <div className="footer-bottom">
            Collaborator – Grow Together · Tech4Startup: Enabling Rural Entrepreneurship
            through Digital Tools in Maharashtra
          </div>
        </div>
      </footer>

      {selected && (
        <ListingModal
          listing={selected}
          onClose={() => setSelected(null)}
          onConnected={() => {
            setSelected(null)
            setToast('Connect request sent. The business will get back to you.')
          }}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="faq-item pop">
      <button type="button" className="faq-q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {q}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="faq-a">
          <p>{a}</p>
        </div>
      )}
    </div>
  )
}

function PostForm({ onPosted }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'offer',
    sector: '',
    location: '',
    provider_name: '',
    contact_name: '',
  })
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    setOk(false)
    if (!form.title.trim() || !form.description.trim() || !form.sector || !form.location.trim() || !form.provider_name.trim() || !form.contact_name.trim()) {
      setMsg('Please fill in every field before posting.')
      return
    }
    setBusy(true)
    try {
      const created = await createListing(form)
      setOk(true)
      setMsg('Posted! Your listing is now in the showcase.')
      setForm({ title: '', description: '', type: 'offer', sector: '', location: '', provider_name: '', contact_name: '' })
      onPosted(created)
    } catch (err) {
      setMsg(err.details ? err.details.join(' ') : err.message || 'Could not post your listing.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="post-form pop" onSubmit={submit}>
      <div className="field">
        <label>Type</label>
        <div className="type-toggle">
          <button type="button" className={form.type === 'offer' ? 'active-offer' : ''} onClick={() => setForm((f) => ({ ...f, type: 'offer' }))}>
            I offer something
          </button>
          <button type="button" className={form.type === 'need' ? 'active-need' : ''} onClick={() => setForm((f) => ({ ...f, type: 'need' }))}>
            I need something
          </button>
        </div>
      </div>
      <div className="field">
        <label htmlFor="pf-title">Title</label>
        <input id="pf-title" value={form.title} onChange={set('title')} placeholder="e.g. Need packaging help for spice powders" />
      </div>
      <div className="field">
        <label htmlFor="pf-desc">Description</label>
        <textarea id="pf-desc" value={form.description} onChange={set('description')} placeholder="Describe what you need or offer, in a few lines." />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="pf-sector">Sector</label>
          <select id="pf-sector" value={form.sector} onChange={set('sector')}>
            <option value="">Choose a sector</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-location">Location</label>
          <input id="pf-location" value={form.location} onChange={set('location')} placeholder="e.g. Malvan, Sindhudurg" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="pf-provider">Business / group name</label>
          <input id="pf-provider" value={form.provider_name} onChange={set('provider_name')} placeholder="e.g. Malvan Spice House" />
        </div>
        <div className="field">
          <label htmlFor="pf-contact">Your name</label>
          <input id="pf-contact" value={form.contact_name} onChange={set('contact_name')} placeholder="e.g. Lata Sawant" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Posting…' : 'Post listing'}
      </button>
      {msg && <p className={`form-msg ${ok ? 'ok' : 'err'}`}>{msg}</p>}
    </form>
  )
}

function ScanCard({ onPick }) {
  const [location, setLocation] = useState('')
  const [results, setResults] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function scan(e) {
    e.preventDefault()
    setMsg('')
    setResults(null)
    if (!location.trim()) {
      setMsg('Enter your town or district to scan for matches.')
      return
    }
    setBusy(true)
    try {
      const data = await getMatches(location.trim())
      setResults(data)
      if (data.count === 0) setMsg(`No listings found in ${data.location} yet. Try a nearby district.`)
    } catch (err) {
      setMsg(err.message || 'Could not scan for matches.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="scan-card">
      <h3>🔍 Scan for matches near you</h3>
      <p>Enter your location and see the offers and needs around you.</p>
      <form onSubmit={scan}>
        <div className="field">
          <label htmlFor="scan-location">Your location</label>
          <input
            id="scan-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kolhapur"
          />
        </div>
        <button type="submit" className="btn btn-blue" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Scanning…' : 'Scan for matches'}
        </button>
      </form>
      {msg && <p className="form-msg err">{msg}</p>}
      {results && results.count > 0 && (
        <div className="scan-results">
          <p className="form-msg ok">
            {results.count} {results.count === 1 ? 'listing' : 'listings'} found for {results.location}
          </p>
          {results.matches.slice(0, 4).map((m) => (
            <button type="button" className="scan-result" key={m.id} onClick={() => onPick(m)}>
              <b>{m.type === 'offer' ? 'Offer' : 'Need'} · {m.sector}</b> — {m.title} ({m.location})
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ListingModal({ listing, onClose, onConnected }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function connect(e) {
    e.preventDefault()
    setMsg('')
    if (!name.trim()) {
      setMsg('Please enter your name so they know who is connecting.')
      return
    }
    setBusy(true)
    try {
      await connectToListing(listing.id, { requester_name: name.trim(), message: message.trim() || undefined })
      onConnected()
    } catch (err) {
      setMsg(err.message || 'Could not send the connect request.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <span className={`badge ${listing.type}`}>{listing.type === 'offer' ? 'Offer' : 'Need'}</span>
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <p>
          <b>{listing.provider_name}</b> · {listing.location}
          <br />
          Sector: {listing.sector} · Contact: {listing.contact_name}
        </p>
        <form onSubmit={connect}>
          <div className="field">
            <label htmlFor="cn-name">Your name</label>
            <input id="cn-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="cn-msg">Message (optional)</label>
            <textarea id="cn-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say hello and explain what you need or offer." />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Sending…' : 'Send connect request'}
          </button>
          {msg && <p className="form-msg err">{msg}</p>}
        </form>
      </div>
    </div>
  )
}
