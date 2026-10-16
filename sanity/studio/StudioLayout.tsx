'use client'

import type { LayoutProps } from 'sanity'
import { PresentationStructureSync } from './PresentationStructureSync'
import { TextColorPairFieldsetStyles } from './TextColorPairFieldsetStyles'

/** Studio shell: injects form layout CSS for text + color fieldsets. */
export default function StudioLayout(props: LayoutProps) {
  return (
    <>
      <TextColorPairFieldsetStyles />
      <PresentationStructureSync />
      {props.renderDefault(props)}
    </>
  )
}
