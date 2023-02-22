import React, { useRef, useId, ElementType } from 'react'

import { arrow, FloatingPortal, offset, shift, useFloating, type Placement } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}
export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen,
  placement
}: Props) {
  const [open, setOpen] = React.useState(initialOpen ?? false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, strategy, refs, reference, floating, middlewareData } = useFloating({
    middleware: [offset(3), shift(), arrow({ element: arrowRef })],
    placement: placement ?? 'bottom-end'
  })
  const idPopover = useId()
  // handle open close popover
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(initialOpen ?? false)
  }
  return (
    <Element className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal id={idPopover}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px} top`
              }}
            >
              <span
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-t-transparent border-b-white'
                ref={arrowRef}
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />

              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
