"use client"
import { motion } from 'framer-motion'

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:
      'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-sm border border-transparent',
    secondary:
      'bg-white text-brand-text border border-brand-border hover:bg-gray-50 shadow-sm',
    outline:
      'bg-transparent text-brand-text border border-brand-border hover:bg-gray-50',
    ghost:
      'bg-transparent text-brand-textLight hover:text-brand-text hover:bg-gray-100',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  const widthClass = fullWidth ? 'w-full' : ''
  return (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}