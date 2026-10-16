import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

function cn(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ')
}

/** Visual style presets (background, border, default text). */
export type ButtonVariant =
  | 'primary'
  | 'primaryRule'
  | 'outline'
  | 'brand'
  | 'textRule'
  | 'textLink'

/** Height, padding, and type scale. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Corner radius treatment. */
export type ButtonShape = 'pill' | 'rounded'

export type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfdfb]'

const baseLayout =
  'inline-flex items-center justify-center font-mokoko font-medium whitespace-nowrap transition-[color,background-color,border-color,transform,opacity,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed'

const textChevronVariants = new Set<ButtonVariant>(['textRule', 'textLink'])

type FilledButtonVariant = Exclude<ButtonVariant, 'textRule' | 'textLink' | 'primaryRule'>

const variantClasses: Record<FilledButtonVariant, string> = {
  primary:
    'bg-brand-darkgreen text-[#fdfdfb] border-2 border-transparent hover:bg-brand-green hover:shadow-md hover:shadow-black/20 active:bg-[#12261c] active:shadow-none active:scale-[0.98]',
  outline:
    'bg-transparent text-brand-darkgreen border-2 border-brand-darkgreen hover:bg-brand-darkgreen hover:text-[#fdfdfb] active:scale-[0.98]',
  brand:
    'bg-brand-red text-white border-2 border-transparent hover:brightness-110 active:brightness-95 active:scale-[0.98]',
}

/** Wrapper: coral top rule (How it works footer — not CMS button block). */
export const linkRuleWrapperClassName =
  'inline-flex flex-col items-start border-t-[3px] border-brand-red pt-6'

/** Text + chevron on dark panels (e.g. How it works footer). */
export const linkRuleAnchorClassName =
  'inline-flex items-center gap-0 font-mokoko text-xl font-medium leading-5 text-[#1AAC66] no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#142D21]'

/** Text + chevron for CMS Button block (`textRule` / `textLink`). */
export const linkRuleButtonAnchorClassName =
  'inline-flex items-center gap-0 font-mokoko text-xl font-medium leading-5 text-[#142D21] no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfdfb]'

export function LinkRuleChevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'min-h-8 px-3 text-sm gap-1.5',
  sm: 'min-h-9 px-4 text-base gap-2',
  md: 'min-h-10 px-5 text-base gap-2',
  lg: 'min-h-11 px-6 text-lg gap-2',
  xl: 'min-h-12 px-8 text-lg gap-2.5',
}

const shapeClasses: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  /** Clearly rounded, but nowhere near a capsule. */
  rounded: 'rounded-xl',
}

/** Maps CMS / legacy values onto supported shapes. */
export function normalizeButtonShape(raw: unknown): ButtonShape {
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (s === 'pill') return 'pill'
  if (s === 'rounded') return 'rounded'
  // Legacy: sharp / soft / square → rounded
  if (s === 'sharp' || s === 'soft' || s === 'square') return 'rounded'
  return 'pill'
}

/**
 * Merges all structural + variant classes for `<button>`, `<Link>`, or `<a>`.
 * Use when you need the same look outside `Button` / `ButtonLink` (e.g. legacy markup).
 */
/** Filled/outline styles; `primaryRule` uses `primary` classes (rule is a separate wrapper). */
export function resolveFilledButtonVariant(variant: ButtonVariant): FilledButtonVariant {
  if (variant === 'primaryRule') return 'primary'
  if (variant === 'textRule' || variant === 'textLink') return 'primary'
  return variant
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className,
}: ButtonStyleOptions & { className?: string }): string {
  if (textChevronVariants.has(variant)) {
    return cn(linkRuleButtonAnchorClassName, className)
  }
  const resolvedShape = normalizeButtonShape(shape)
  return cn(
    baseLayout,
    focusRing,
    variantClasses[resolveFilledButtonVariant(variant)],
    sizeClasses[size],
    shapeClasses[resolvedShape],
    className,
  )
}

export type ButtonProps = Omit<ComponentProps<'button'>, 'className'> &
  ButtonStyleOptions & {
    className?: string
    leftIcon?: ReactNode
    rightIcon?: ReactNode
  }

/**
 * Native `<button>` with shared Earn variants (size, shape, hover, active, focus, disabled).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className,
  type = 'button',
  leftIcon,
  rightIcon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, shape, className })}
      {...rest}
    >
      {leftIcon ? <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{rightIcon}</span> : null}
    </button>
  )
}

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'className'> &
  ButtonStyleOptions & {
    className?: string
    leftIcon?: ReactNode
    rightIcon?: ReactNode
  }

/**
 * Next.js `<Link>` with the same variants as `Button` (for CTAs that navigate in-app).
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, shape, className })} {...rest}>
      {leftIcon ? <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{rightIcon}</span> : null}
    </Link>
  )
}
