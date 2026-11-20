import { Link, useNavigate } from 'react-router-dom'

const PAGES = [
  { key: 'permissions', label: 'Permissions', to: '/staff-permissions' },
  { key: 'staff', label: 'Staff users', to: '/staff-permissions/staff' },
]

export default function AccessHeader({ page }) {
  const navigate = useNavigate()
  const title = page === 'staff' ? 'Staff users' : 'Roles & access'

  return (
    <div className="d-flex align-items-start justify-content-between gap-3" style={{ margin: '1.25rem 0 1.25rem' }}>
      <div style={{ minWidth: 0 }}>
        <h1 className="mb-1" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: '#0f172a' }}>{title}</h1>
        <div className="d-flex align-items-center flex-wrap" style={{ gap: 6, fontSize: 13, lineHeight: 1.4 }}>
          <Link to="/dashboard" style={{ color: '#64748b' }}>Home</Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#293896', fontWeight: 600 }}>{title}</span>
        </div>
        <p className="mb-0 mt-1" style={{ color: '#64748b', fontSize: 14, lineHeight: 1.45 }}>Choose what each role can do, then give staff a role. Staff sign in with their email and password.</p>
      </div>
      <div className="d-inline-flex flex-shrink-0" style={{ background: '#fff', border: '1px solid #e6ebf2', borderRadius: 999, padding: 4, marginTop: 2 }}>
        {PAGES.map((item) => {
          const active = page === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => { if (!active) navigate(item.to) }}
              style={{
                border: 0,
                borderRadius: 999,
                padding: '7px 16px',
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.2,
                cursor: 'pointer',
                background: active ? '#293896' : 'transparent',
                color: active ? '#fff' : '#475569',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
