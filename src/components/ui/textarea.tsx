import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea - Styled multiline text input component
 *
 * This component provides a styled textarea field that matches the site's design system.
 * It extends the native HTML textarea element with consistent styling while maintaining
 * all standard functionality and accessibility features.
 *
 * Features:
 * - Consistent styling with the site's design system
 * - Supports all standard HTML textarea attributes
 * - Proper focus and hover states
 * - Accessible by default
 * - Resizable by users for better UX
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
