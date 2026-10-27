import type { CSSProperties } from 'react'
import { stegaClean } from 'next-sanity'
import { TEXT_COLOR_HEX, parseTextColor, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import type { ButtonShape, ButtonSize } from '@/components/ui/Button'
import { normalizeButtonShape } from '@/components/ui/Button'

export type ButtonBlockType = 'fill' | 'ghost' | 'textLink'

export type ResolvedButtonBlock = {
  buttonType: ButtonBlockType
  textColor: TextColorValue
  fillColor: TextColorValue
  outlineColor: TextColorValue
  showTopLine: boolean
  lineColor: TextColorValue
  size: ButtonSize
  shape: ButtonShape
}

const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

function clean(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? '')).trim()
}

function pickSize(v: unknown): ButtonSize {
  const s = clean(v) as ButtonSize
  return SIZES.includes(s) ? s : 'md'
}

function pickButtonType(v: unknown): ButtonBlockType | null {
  const s = clean(v)
  if (s === 'fill' || s === 'ghost' || s === 'textLink') return s
  return null
}

type LegacyVariant =
  | 'primary'
  | 'primaryRule'
  | 'outline'
  | 'brand'
  | 'textLink'
  | 'textRule'

function migrateFromLegacyVariant(variant: LegacyVariant): Omit<ResolvedButtonBlock, 'size' | 'shape'> {
  switch (variant) {
    case 'primary':
      return {
        buttonType: 'fill',
        textColor: 'offWhite',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: false,
        lineColor: 'yellow',
      }
    case 'primaryRule':
      return {
        buttonType: 'fill',
        textColor: 'offWhite',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: true,
        lineColor: 'yellow',
      }
    case 'outline':
      return {
        buttonType: 'ghost',
        textColor: 'medSlate',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: false,
        lineColor: 'yellow',
      }
    case 'brand':
      return {
        buttonType: 'fill',
        textColor: 'darkSlate',
        fillColor: 'yellow',
        outlineColor: 'medSlate',
        showTopLine: false,
        lineColor: 'yellow',
      }
    case 'textLink':
      return {
        buttonType: 'textLink',
        textColor: 'medSlate',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: false,
        lineColor: 'yellow',
      }
    case 'textRule':
      return {
        buttonType: 'textLink',
        textColor: 'medSlate',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: true,
        lineColor: 'yellow',
      }
    default:
      return {
        buttonType: 'fill',
        textColor: 'offWhite',
        fillColor: 'medSlate',
        outlineColor: 'medSlate',
        showTopLine: false,
        lineColor: 'yellow',
      }
  }
}

/** Maps CMS button block (new fields + legacy `variant`) to render options. */
export function resolveButtonBlock(block: Record<string, unknown>): ResolvedButtonBlock {
  const explicitType = pickButtonType(block.buttonType)
  const legacyVariant = clean(block.variant) as LegacyVariant

  const migrated = explicitType
    ? null
    : migrateFromLegacyVariant(
        (
          [
            'primary',
            'primaryRule',
            'outline',
            'brand',
            'textLink',
            'textRule',
          ] as const
        ).includes(legacyVariant as LegacyVariant)
          ? legacyVariant
          : 'primary',
      )

  const base = migrated ?? {
    buttonType: explicitType!,
    textColor:
      explicitType === 'fill'
        ? ('offWhite' as TextColorValue)
        : ('medSlate' as TextColorValue),
    fillColor: 'medSlate' as TextColorValue,
    outlineColor: 'medSlate' as TextColorValue,
    showTopLine: false,
    lineColor: 'yellow' as TextColorValue,
  }

  const labelColorFallback = block.labelColor
  const textColorRaw = block.textColor ?? labelColorFallback

  return {
    buttonType: base.buttonType,
    textColor: parseTextColor(textColorRaw, base.textColor),
    fillColor: parseTextColor(block.fillColor, base.fillColor),
    outlineColor: parseTextColor(block.outlineColor, base.outlineColor),
    showTopLine:
      typeof block.showTopLine === 'boolean'
        ? block.showTopLine
        : base.showTopLine,
    lineColor: parseTextColor(block.lineColor, base.lineColor),
    size: pickSize(block.size),
    shape: normalizeButtonShape(block.shape),
  }
}

export function linkRuleWrapperProps(lineColor: TextColorValue): {
  className: string
  style: CSSProperties
} {
  return {
    className: 'inline-flex flex-col items-start border-t-[3px] pt-6',
    style: {
      borderTopColor: TEXT_COLOR_HEX[parseTextColor(lineColor, 'yellow')],
    },
  }
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-earn-paper'

const baseLayout =
  'inline-flex items-center justify-center font-plex-sans font-medium whitespace-nowrap transition-[color,background-color,border-color,transform,opacity,box-shadow] duration-200'

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'min-h-8 px-3 text-sm gap-1.5',
  sm: 'min-h-9 px-4 text-base gap-2',
  md: 'min-h-10 px-5 text-base gap-2',
  lg: 'min-h-11 px-6 text-lg gap-2',
  xl: 'min-h-12 px-8 text-lg gap-2.5',
}

const shapeClasses: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
}

export function fillButtonClasses(
  config: ResolvedButtonBlock,
  extra?: string,
): { className: string; style: CSSProperties } {
  return {
    className: [
      baseLayout,
      focusRing,
      sizeClasses[config.size],
      shapeClasses[config.shape],
      'border-2 border-transparent',
      'hover:brightness-110 active:scale-[0.98]',
      extra,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      backgroundColor: TEXT_COLOR_HEX[config.fillColor],
      ...textColorStyle(config.textColor, config.textColor),
    },
  }
}

export function ghostButtonClasses(
  config: ResolvedButtonBlock,
  extra?: string,
): { className: string; style: CSSProperties } {
  const outlineHex = TEXT_COLOR_HEX[config.outlineColor]
  return {
    className: [
      baseLayout,
      focusRing,
      sizeClasses[config.size],
      shapeClasses[config.shape],
      'bg-transparent border-2 hover:bg-[var(--ghost-hover-bg)] hover:text-earn-paper',
      'active:scale-[0.98]',
      extra,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      borderColor: outlineHex,
      ['--ghost-hover-bg' as string]: outlineHex,
      ...textColorStyle(config.textColor, config.textColor),
    },
  }
}

export const textLinkAnchorClass =
  'inline-flex items-center gap-0 font-plex-sans text-xl font-medium leading-5 no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-earn-paper'

export function textLinkButtonClasses(
  config: ResolvedButtonBlock,
  extra?: string,
): { className: string; style: CSSProperties } {
  return {
    className: [textLinkAnchorClass, extra].filter(Boolean).join(' '),
    style: textColorStyle(config.textColor, config.textColor),
  }
}
