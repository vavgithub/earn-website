import { useRef } from 'react'
import { set, unset, type FormPatch, type InputProps, type ObjectInputProps, type Path } from 'sanity'
import { AddIcon, DragHandleIcon, TrashIcon } from '@sanity/icons'
import { Box, Button, Flex, Select, Stack, Text, TextInput } from '@sanity/ui'

type WidthValue = {
  _key?: string
  _type?: string
  widthUnit?: string
  widthValue?: number
}

function newKey() {
  return [...crypto.getRandomValues(new Uint8Array(6))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function isColumnsPath(path: Path | undefined) {
  return Array.isArray(path) && path[path.length - 1] === 'columns'
}

function readWidth(item: WidthValue | undefined) {
  const unit = item?.widthUnit === 'pixel' || item?.widthUnit === 'percent' ? item.widthUnit : ''
  const value = typeof item?.widthValue === 'number' && Number.isFinite(item.widthValue) ? String(item.widthValue) : ''
  return { unit, value }
}

function writeWidths(units: string[], amounts: string[], previous: WidthValue[]): WidthValue[] | undefined {
  const next = units.map((unit, index) => {
    const trimmed = amounts[index]?.trim() ?? ''
    const num = trimmed === '' ? undefined : Number(trimmed)
    const hasNumber = typeof num === 'number' && Number.isFinite(num)
    const hasUnit = unit === 'percent' || unit === 'pixel'
    if (!hasUnit && !hasNumber) return undefined
    return {
      _type: 'tableColumnWidth',
      _key: previous[index]?._key || newKey(),
      ...(hasUnit ? { widthUnit: unit } : {}),
      ...(hasNumber ? { widthValue: num } : {}),
    }
  })
  if (next.every((item) => !item)) return undefined
  return next.map((item) => item ?? { _type: 'tableColumnWidth', _key: newKey() })
}

function ColumnRows({
  columns,
  widths,
  readOnly,
  onCommit,
}: {
  columns: string[]
  widths: WidthValue[]
  readOnly?: boolean
  onCommit: (columns: string[], widths: WidthValue[] | undefined) => void
}) {
  function commit(nextColumns: string[], units: string[], amounts: string[]) {
    onCommit(nextColumns, writeWidths(units, amounts, widths))
  }

  function update(index: number, heading: string, unit: string, amount: string) {
    const nextColumns = columns.slice()
    nextColumns[index] = heading
    const units = columns.map((_, i) => readWidth(widths[i]).unit)
    const amounts = columns.map((_, i) => readWidth(widths[i]).value)
    units[index] = unit
    amounts[index] = amount
    commit(nextColumns, units, amounts)
  }

  function remove(index: number) {
    const units = columns.map((_, i) => readWidth(widths[i]).unit)
    const amounts = columns.map((_, i) => readWidth(widths[i]).value)
    commit(
      columns.filter((_, i) => i !== index),
      units.filter((_, i) => i !== index),
      amounts.filter((_, i) => i !== index),
    )
  }

  function add() {
    const units = columns.map((_, i) => readWidth(widths[i]).unit)
    const amounts = columns.map((_, i) => readWidth(widths[i]).value)
    commit([...columns, ''], [...units, ''], [...amounts, ''])
  }

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= columns.length || to >= columns.length) return
    const nextColumns = columns.slice()
    const units = columns.map((_, i) => readWidth(widths[i]).unit)
    const amounts = columns.map((_, i) => readWidth(widths[i]).value)
    const [heading] = nextColumns.splice(from, 1)
    const [unit] = units.splice(from, 1)
    const [amount] = amounts.splice(from, 1)
    nextColumns.splice(to, 0, heading)
    units.splice(to, 0, unit)
    amounts.splice(to, 0, amount)
    commit(nextColumns, units, amounts)
  }

  const dragFrom = useRef<number | null>(null)

  return (
    <Stack space={3}>
      {columns.map((heading, index) => {
        const width = readWidth(widths[index])
        return (
          <Flex
            key={widths[index]?._key || `column-${index}`}
            gap={2}
            align="flex-end"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const from = dragFrom.current
              dragFrom.current = null
              if (from === null) return
              move(from, index)
            }}
          >
            <Box
              padding={2}
              draggable={!readOnly}
              aria-label="Drag to reorder"
              style={{ cursor: readOnly ? 'default' : 'grab' }}
              onDragStart={(event) => {
                dragFrom.current = index
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', String(index))
              }}
              onDragEnd={() => {
                dragFrom.current = null
              }}
            >
              <DragHandleIcon />
            </Box>
            <Stack flex={1} space={2}>
              {index === 0 ? (
                <Text size={1} weight="medium">
                  Heading
                </Text>
              ) : (
                <Box />
              )}
              <TextInput
                value={heading}
                readOnly={readOnly}
                onChange={(event) => update(index, event.currentTarget.value, width.unit, width.value)}
              />
            </Stack>
            <Stack space={2} style={{ width: '8.5rem' }}>
              {index === 0 ? (
                <Text size={1} weight="medium">
                  Width
                </Text>
              ) : (
                <Box />
              )}
              <Select
                value={width.unit}
                disabled={readOnly}
                onChange={(event) => update(index, heading, event.currentTarget.value, width.value)}
              >
                <option value="">Same as now</option>
                <option value="percent">Percent</option>
                <option value="pixel">Pixels</option>
              </Select>
            </Stack>
            <Stack space={2} style={{ width: '5.5rem' }}>
              {index === 0 ? (
                <Text size={1} weight="medium">
                  Number
                </Text>
              ) : (
                <Box />
              )}
              <TextInput
                type="number"
                value={width.value}
                readOnly={readOnly}
                placeholder={width.unit === 'percent' ? '1–100' : ''}
                onChange={(event) => update(index, heading, width.unit, event.currentTarget.value)}
              />
            </Stack>
            <Button
              mode="bleed"
              icon={TrashIcon}
              tone="critical"
              padding={3}
              disabled={readOnly || columns.length <= 2}
              onClick={() => remove(index)}
            />
          </Flex>
        )
      })}
      <Button icon={AddIcon} mode="ghost" text="Add item" disabled={readOnly || columns.length >= 12} onClick={add} />
    </Stack>
  )
}

export function TableBlockInput(props: ObjectInputProps) {
  const widths = Array.isArray(props.value?.columnWidths) ? (props.value.columnWidths as WidthValue[]) : []

  return props.renderDefault({
    ...props,
    renderInput: (inputProps: Omit<InputProps, 'renderDefault'>) => {
      if (!isColumnsPath(inputProps.path)) return props.renderInput(inputProps)
      const columns = Array.isArray(inputProps.value)
        ? inputProps.value.filter((item): item is string => typeof item === 'string')
        : []
      return (
        <ColumnRows
          columns={columns}
          widths={widths}
          readOnly={inputProps.readOnly}
          onCommit={(nextColumns, nextWidths) => {
            const patches: FormPatch[] = [set(nextColumns, ['columns'])]
            if (nextWidths) patches.push(set(nextWidths, ['columnWidths']))
            else if (widths.length > 0) patches.push(unset(['columnWidths']))
            props.onChange(patches)
          }}
        />
      )
    },
  })
}
