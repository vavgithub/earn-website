'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../sanity.config'
import '../../sanity/studio/textColorPairFieldsets.css'

export default function StudioPage() {
  return <NextStudio config={config} />
}
