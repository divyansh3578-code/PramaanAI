import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon.jsx'
import { NAV_ITEMS } from '../../data/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MainNav() {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)))

  return (
    <nav className="bg-navy text-white border-t border-navy-600 shadow-md px-4 overflow-x-auto">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between text-[12px] font-medium">
        <div className="flex items-center min-w-max">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2.5 flex items-center gap-1 border-r border-navy-600 whitespace-nowrap ${
                  isActive ? 'bg-saffron text-navy font-bold' : 'hover:bg-navy-700 text-navy-100'
                }`
              }
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono pr-2">
          <span className="bg-navy-700 text-saffron px-2 py-0.5 rounded border border-navy-600 whitespace-nowrap">
            PORTAL STATUS: OPERATIONAL
          </span>
        </div>
      </div>
    </nav>
  )
}
