import type { CSSProperties } from 'react'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'

export type TableBlockProps = {
  /** Column headings, left to right */
  columns: string[]
  /** Each row: cell strings in the same order as `columns` */
  rows: string[][]
  columnHeadingTextSize?: TextSizeValue
  columnHeadingColor?: TextColorValue
  cellTextSize?: TextSizeValue
  cellTextColor?: TextColorValue
  className?: string
}

const tone = 'border-solid [border-color:var(--Base-Color-A0A691,#A0A691)]'

/** Figma body: bottom + `border-left` on cols 1..n for column dividers. */
function bodyCellBorderClasses(columnIndex: number) {
  const isFirstCol = columnIndex === 0
  return [tone, 'border-b', !isFirstCol && 'border-l'].filter(Boolean).join(' ')
}

/** Header: bottom rule only — no verticals in thead (no column / side borders). */
function headerCellBorderClasses() {
  return [tone, 'border-b'].join(' ')
}

/** Figma header cells: pt/pb 12, first col pr 10, detail col px 10 */
function headerPadding(columnIndex: number) {
  if (columnIndex === 0) return 'py-3 pr-[10px] pl-4'
  return 'py-3 px-[10px]'
}

/** Figma body: first col py 16 pr 10 pl-4; other cols padding 16 */
function bodyPadding(columnIndex: number) {
  if (columnIndex === 0) return 'py-4 pr-[10px] pl-4'
  return 'p-4'
}

export function TableBlock({
  columns,
  rows,
  columnHeadingTextSize = 'md',
  columnHeadingColor = 'darkSlate',
  cellTextSize = 'md',
  cellTextColor = 'darkSlate',
  className = '',
}: TableBlockProps) {
  if (!columns.length || !rows.length) return null

  const twoCols = columns.length === 2

  const thSizeClass = textSizeBodyClass(columnHeadingTextSize, 'md')
  const thStyle: CSSProperties = {
    ...textColorStyle(columnHeadingColor, 'darkSlate'),
    fontWeight: 700,
  }
  const tdSizeClass = textSizeBodyClass(cellTextSize, 'md')
  const tdStyle = textColorStyle(cellTextColor, 'darkSlate')
  const thType = `font-inter font-bold ${thSizeClass}`
  const tdType = `font-inter font-normal ${tdSizeClass}`

  return (
    <div className={`overflow-x-auto bg-transparent font-inter ${className}`}>
      <table
        className={`w-full min-w-[320px] border-collapse text-left ${twoCols ? 'table-fixed' : ''}`}
      >
        <thead>
          <tr>
            {columns.map((heading, ci) => (
              <th
                key={ci}
                scope="col"
                className={`${headerCellBorderClasses()} ${headerPadding(ci)} ${thType} ${
                  twoCols && ci === 0 ? 'w-[34%] md:w-[32%]' : ''
                }`}
                style={thStyle}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri}>
              {columns.map((_, ci) => (
                <td
                  key={ci}
                  className={`align-top ${bodyCellBorderClasses(ci)} ${bodyPadding(ci)} ${tdType}`}
                  style={tdStyle}
                >
                  {cells[ci] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
