export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-textLight mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 bg-white border rounded-lg text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-brand-border text-brand-text placeholder-gray-400'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}