/**
 * Thin wrapper around the "Material Symbols Outlined" variable font.
 * Keeps icon usage declarative and lets us tune size/weight/fill in one place.
 *
 * Usage: <Icon name="verified_user" size={16} className="text-saffron" />
 */
export default function Icon({ name, size = 16, weight = 400, fill = 0, className = '', ...rest }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  )
}
