import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'indigo' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  external?: boolean
  className?: string
  children: ReactNode
}

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
  }

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

export type Props = AnchorProps | ButtonProps

const base =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-transparent font-medium tracking-body no-underline transition-all duration-150'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-white font-[550] hover:bg-[#27272a]',
  secondary:
    'bg-bg text-fg border-border-3 hover:bg-bg-muted hover:border-fg-4',
  indigo:
    'bg-indigo text-white font-[550] shadow-[0_0_0_1px_rgba(79,70,229,0.2),0_6px_16px_-6px_rgba(79,70,229,0.4)] hover:bg-[#4338ca] hover:-translate-y-[0.5px]',
  ghost:
    'bg-transparent text-fg-2 hover:text-fg hover:bg-bg-card',
}

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-3.5 py-1.5',
  md: 'text-[13.5px] px-4 py-2.5',
  lg: 'text-[14.5px] px-5 py-3 rounded-lg',
}

export function Button(props: Props) {
  const {
    variant = 'primary',
    size = 'md',
    external,
    className,
    children,
  } = props

  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in props && props.href !== undefined) {
    const {
      variant: _v, size: _s, external: _e, className: _c, children: _ch,
      href, target, rel, ...rest
    } = props
    void _v; void _s; void _e; void _c; void _ch
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : target}
        rel={external ? 'noopener' : rel}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const { variant: _v, size: _s, external: _e, className: _c, children: _ch, ...rest } = props
  void _v; void _s; void _e; void _c; void _ch
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
