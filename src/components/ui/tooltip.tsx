"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

/**
 * Tooltip - Accessible tooltip component
 * 
 * This component provides a fully accessible tooltip system based on Radix UI.
 * It displays additional information when users hover over or focus on an element.
 * 
 * Features:
 * - Accessible by default with proper ARIA attributes
 * - Customizable appearance and positioning
 * - Keyboard navigation support
 * - Consistent styling with the site's design system
 * 
 * The component is composed of several subcomponents:
 * - TooltipProvider: Context provider for tooltips
 * - Tooltip: The root container
 * - TooltipTrigger: Element that triggers the tooltip
 * - TooltipContent: Content displayed in the tooltip
 */
const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 