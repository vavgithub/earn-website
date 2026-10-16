import ButtonBlock from '@/components/blocks/ButtonBlock'

type ButtonLike = { _key: string } & Record<string, unknown>

/**
 * Renders zero or more Sanity `buttonBlock` entries (e.g. nested under Hero, Two columns, Image grid).
 * Layout fields (alignment, full width) are not used — see `ButtonBlock` `nested` prop.
 */
export function ButtonBlocksList({
  buttons,
  className = 'flex flex-col gap-4 mt-6',
}: {
  buttons?: ButtonLike[] | null
  /** e.g. `flex flex-wrap justify-center gap-4 mt-10` for a horizontal strip */
  className?: string
}) {
  if (!buttons?.length) return null
  return (
    <div className={className}>
      {buttons.map((btn) => (
        <ButtonBlock key={btn._key} block={btn} nested />
      ))}
    </div>
  )
}
