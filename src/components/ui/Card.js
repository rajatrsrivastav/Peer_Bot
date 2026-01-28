export function Card({
  children,
  className = '',
  noPadding = false,
}) {
  return (
    <div
      className={`bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}