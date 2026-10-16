'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'
import '../../../sanity/studio/textColorPairFieldsets.css'

/** Subpaths such as `/studio/presentation` and `/studio/structure/...`. */
export default function StudioCatchAllPage() {
  return <NextStudio config={config} />
}
