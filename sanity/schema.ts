import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './schemas/blockContent'
import { notificationBarContent } from './schemas/notificationBarContent'
import siteNotificationBar from './schemas/siteNotificationBar'
import heroBlog from './schemas/blocks/heroBlog'
import multiColumnBlock from './schemas/blocks/multiColumnBlock'
import gridCell from './schemas/blocks/gridCell'
import gridBlock from './schemas/blocks/gridBlock'
import ctaBlock from './schemas/blocks/ctaBlock'
import buttonBlock from './schemas/blocks/buttonBlock'
import imageBlock from './schemas/blocks/imageBlock'
import richTextSection from './schemas/blocks/richTextSection'
import accordionBlock from './schemas/blocks/accordionBlock'
import tableBlock from './schemas/blocks/tableBlock'
import codeEmbedBlock from './schemas/blocks/codeEmbedBlock'
import howItWorksStepsBlock from './schemas/blocks/howItWorksStepsBlock'
import hubspotFormBlock from './schemas/blocks/hubspotFormBlock'
import contentPanelBlock from './schemas/blocks/contentPanelBlock'
import blogPost from './schemas/blogPost'
import blogCategory from './schemas/blogCategory'
import blogTag from './schemas/blogTag'
import blogSettings from './schemas/blogSettings'
import page from './schemas/page'
import siteNavigation, { navigationTypes } from './schemas/siteNavigation'
import siteFooter, { footerSchemaTypes } from './schemas/siteFooter'
import siteSettings from './schemas/siteSettings'
import resourceTab from './schemas/resourceTab'
import resourceItem from './schemas/resourceItem'
import resourcesHubSpotSettings from './schemas/resourcesHubSpotSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    notificationBarContent,
    siteNotificationBar,
    heroBlog,
    multiColumnBlock,
    gridCell,
    gridBlock,
    ctaBlock,
    buttonBlock,
    imageBlock,
    richTextSection,
    accordionBlock,
    tableBlock,
    codeEmbedBlock,
    howItWorksStepsBlock,
    hubspotFormBlock,
    contentPanelBlock,
    blogPost,
    blogCategory,
    blogTag,
    blogSettings,
    resourceTab,
    resourceItem,
    resourcesHubSpotSettings,
    page,
    ...navigationTypes,
    siteNavigation,
    ...footerSchemaTypes,
    siteFooter,
    siteSettings,
  ],
}
