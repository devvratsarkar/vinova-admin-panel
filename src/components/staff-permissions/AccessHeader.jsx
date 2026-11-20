import { useNavigate } from 'react-router-dom'
import PageHeader from '../../layouts/layoutcomponents/pageheader'

const PAGES = [
  { key: 'permissions', label: 'Permissions', to: '/staff-permissions' },
  { key: 'staff', label: 'Staff users', to: '/staff-permissions/staff' },
]

export default function AccessHeader({ page }) {
  const navigate = useNavigate()
  const title = page === 'staff' ? 'Staff users' : 'Roles & access'

  return (
    <>
      <style>{`
        .roles-access-header__tabs { display: inline-flex; flex-shrink: 0; background: #fff; border: 1px solid #e6ebf2; border-radius: 999px; padding: 4px; }
        @media (max-width: 991px) {
          .page-header .roles-access-header__tabs { width: 100%; margin-top: 12px; }
          .page-header .roles-access-header__tabs button { flex: 1 1 0; }
        }
      `}</style>
      <PageHeader titles={title} active={title} items={['Home']} links={['/dashboard']}>
        <div className="roles-access-header__tabs">
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
      </PageHeader>
    </>
  )
}
