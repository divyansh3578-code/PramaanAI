import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon.jsx'
import { NAV_ITEMS } from '../../data/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { motion } from 'framer-motion'

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
                `relative px-3 py-2.5 flex items-center gap-1 border-r border-navy-600 whitespace-nowrap ${
                  isActive ? 'text-saffron font-bold' : 'hover:bg-navy-700 text-navy-100'
                }`
              }
            >
              {({ isActive }) => <><Icon name={item.icon} size={15} />{item.label}{isActive && <motion.span layoutId="active-nav" className="absolute left-2 right-2 bottom-0 h-0.5 bg-saffron" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}</>}
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
