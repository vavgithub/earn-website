import {GenerateIcon, SortIcon} from '@sanity/icons'
import type {ConfigContext} from 'sanity'
import type {ComponentType} from 'react'
import {OrderableDocumentList} from '@sanity/orderable-document-list'
import type {OrderableListConfig} from '@sanity/orderable-document-list'
import {StructureBuilder, type ListItem, type MenuItem} from 'sanity/structure'

/** Same as @sanity/orderable-document-list internal client API version */
const ORDERABLE_LIST_API_VERSION = 'v2025-06-27' as const

/**
 * Drop-in replacement for `orderableDocumentListDeskItem` from
 * `@sanity/orderable-document-list`, with one fix: when `context.perspectiveStack[0]`
 * is missing (common with Sanity 5 + Presentation), the upstream plugin omits
 * `$currentVersion` from GROQ params and the list never loads. Defaulting to
 * `'drafts'` restores the query and drag-and-drop ordering.
 */
export function orderableDocumentListDeskItemFixed(config: OrderableListConfig): ListItem {
  if (!config?.type || !config.context || !config.S) {
    throw new Error(`
    type, context and S (StructureBuilder) must be provided.
    context and S are available when configuring structure.
    Example: orderableDocumentListDeskItemFixed({type: 'category', S, context})
    `)
  }

  const {type, filter, menuItems = [], createIntent, params, title, icon, id, context, S} = config
  const {schema, getClient} = context
  const perspectiveStack = (context as {perspectiveStack?: string[]}).perspectiveStack || []
  const client = getClient({apiVersion: ORDERABLE_LIST_API_VERSION})

  const rawPerspective = perspectiveStack[0]
  const currentVersion =
    rawPerspective === undefined || rawPerspective === null || rawPerspective === ''
      ? 'drafts'
      : rawPerspective

  const listTitle = title ?? `Orderable ${type}`
  const listId = id ?? `orderable-${type}`
  const listIcon = icon ?? SortIcon
  const typeTitle = schema.get(type)?.title ?? type

  const items: MenuItem[] = [...menuItems]
  if (createIntent !== false) {
    items.push(
      S.menuItem()
        .title(`Create new ${typeTitle}`)
        .intent({type: 'create', params: {type}})
        .serialize(),
    )
  }

  return S.listItem()
    .title(listTitle)
    .id(listId)
    .icon(listIcon)
    .schemaType(type)
    .child(
      Object.assign(
        S.documentTypeList(type)
          .canHandleIntent(() => !!createIntent)
          .serialize(),
        {
          __preserveInstance: true,
          key: listId,
          type: 'component',
          component: OrderableDocumentList,
          options: {type, filter, params, client, currentVersion},
          menuItems: [
            ...items,
            S.menuItem().title(`Reset Order`).icon(GenerateIcon).action(`resetOrder`).serialize(),
            S.menuItem()
              .title(`Toggle Increments`)
              .icon(SortIcon)
              .action(`showIncrements`)
              .serialize(),
          ],
        },
      ),
    )
    .serialize()
}
