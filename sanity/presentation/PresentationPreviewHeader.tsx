'use client'

import type { PreviewHeaderProps } from 'sanity/presentation'
import { Box, Flex } from '@sanity/ui'
import { PresentationRoutePicker } from './PresentationRoutePicker'

function previewPathFromProps(props: PreviewHeaderProps): string {
  try {
    const url = new URL(props.previewUrl || '/', props.targetOrigin)
    return `${url.pathname}${url.search}`
  } catch {
    return '/'
  }
}

/**
 * Default Presentation toolbar + “Pages” dropdown beside the URL field
 * (sits just left of the open-preview control).
 */
export function PresentationPreviewHeader(props: PreviewHeaderProps) {
  const path = previewPathFromProps(props)

  return (
    <Box style={{ position: 'relative', width: '100%' }}>
      {props.renderDefault(props)}
      <Flex
        align="center"
        style={{
          position: 'absolute',
          right: 108,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        <PresentationRoutePicker currentPath={path} onSelect={props.onPathChange} />
      </Flex>
    </Box>
  )
}
