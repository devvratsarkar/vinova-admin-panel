import { useNavigate } from 'react-router-dom'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import './AccessHeader.css'

const PAGES = [
  { key: 'permissions', label: 'Permissions', to: '/staff-permissions' },
  { key: 'staff', label: 'Staff users', to: '/staff-permissions/staff' },
]

export default function AccessHeader({ page }) {
  const navigate = useNavigate()
  const title = page === 'staff' ? 'Staff users' : 'Roles & access'

  return (
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
  )
}
