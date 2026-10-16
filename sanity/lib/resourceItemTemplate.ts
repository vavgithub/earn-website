/** Pre-selects the tab when creating a card from a tab-specific Studio list. */
export const resourceItemForTabTemplate = {
  id: 'resourceItem-for-tab',
  title: 'Resource card in tab',
  schemaType: 'resourceItem',
  parameters: [{ name: 'tabId', type: 'string' }],
  value: ({ tabId }: { tabId: string }) => ({
    tab: { _type: 'reference', _ref: tabId },
  }),
}
