# Elevate Training Camps - Documentation Guide

This guide outlines the documentation standards for the Elevate Training Camps website project. Consistent documentation helps maintain code quality and makes collaboration easier.

## Code Comments

### General Guidelines

- Use JSDoc style comments for functions, classes, and components
- Write comments in clear, concise English
- Explain "why" not just "what" the code does
- Keep comments up-to-date when modifying code

### Components

All React components should be documented with JSDoc comments that include:

```tsx
/**
 * ComponentName - Brief description of the component's purpose
 *
 * Detailed explanation of what the component does and when to use it.
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * @param {Object} props - Component props
 * @param {Type} props.propName - Description of the prop
 * @returns {JSX.Element} - Description of what is rendered
 */
```

### Functions

Functions should be documented with:

```tsx
/**
 * Brief description of what the function does
 *
 * @param {Type} paramName - Description of the parameter
 * @returns {Type} Description of the return value
 * @throws {ErrorType} Description of when errors are thrown (if applicable)
 */
```

### Complex Logic

For complex logic sections, add explanatory comments:

```tsx
// Calculate the position based on scroll progress
// This uses a non-linear easing function to create a smoother transition
const position = calculatePosition(scrollProgress);
```

## File Structure

Each file should begin with a brief comment explaining its purpose:

```tsx
/**
 * @file ComponentName.tsx
 * Description of the file's purpose and its role in the application
 */
```

## State Management

Document state variables with clear explanations:

```tsx
// Tracks whether the video has loaded and is ready to play
const [videoLoaded, setVideoLoaded] = useState(false);

// Stores the current scroll position for animation calculations
const scrollPositionRef = useRef(0);
```

## CSS and Styling

For complex CSS or styling logic, add comments explaining the purpose:

```tsx
// Add gradient overlay to improve text readability over images
const overlayStyles = {
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))',
};
```

## Error Tracking System

This project includes an error tracking system that helps document errors and their solutions. When you encounter an error:

1. First, check if there's already a solution in the error database:
   ```bash
   node .cursor/error-tracker.js search "Error message"
   ```

2. If you find a solution, apply it and rate its effectiveness:
   ```bash
   node .cursor/error-tracker.js update "Error message" "Solution description" "high|medium|low"
   ```

3. If you solve a new error, add it to the database:
   ```bash
   node .cursor/error-tracker.js add <category> <subcategory> "Error message" "Solution description" "Solution code"
   ```

Categories include:
- react (hooks, state, props, etc.)
- nextjs (routing, hydration, etc.)
- typescript (types, interfaces, etc.)
- sanity (queries, schemas, etc.)

The error solutions database is stored in `.cursor/error-solutions.json` and can be reviewed directly.

### Example Error Solution Entry

```json
{
  "error": "Invalid hook call. Hooks can only be called inside of the body of a function component.",
  "pattern": "Invalid hook call",
  "solutions": [
    {
      "description": "Move hooks to the top level of the component",
      "code": "// ❌ Don't call hooks inside loops, conditions, or nested functions\nif (condition) {\n  useEffect(() => {}, []); // This is invalid\n}\n\n// ✅ Call hooks at the top level\nuseEffect(() => {\n  if (condition) {\n    // Put the conditional logic inside the hook\n  }\n}, [condition]);",
      "effectiveness": "high"
    }
  ]
}
```

## Examples

### Component Example

```tsx
/**
 * NavigationMenu - Accessible navigation menu component
 *
 * This component provides a fully accessible navigation menu system based on Radix UI.
 * It supports dropdown menus, keyboard navigation, and proper ARIA attributes.
 *
 * Features:
 * - Dropdown menus with smooth animations
 * - Keyboard navigation support
 * - Mobile-responsive design
 * - Accessible by default with proper ARIA attributes
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the navigation menu
 * @param {string} [props.className] - Optional CSS class name
 * @returns {JSX.Element} The navigation menu component
 */
```

### Function Example

```tsx
/**
 * Fetches team members from the Sanity CMS
 *
 * @returns {Promise<TeamMember[]>} Array of team member objects
 * @throws {Error} If the Sanity API request fails
 */
async function getTeamMembers() {
  // Implementation...
}
```

## Commit Messages

Commit messages should be clear and descriptive:

- Use present tense ("Add feature" not "Added feature")
- Reference issue numbers when applicable
- Include a brief summary of what changed and why

## Maintaining This Guide

This documentation guide should be updated as the project evolves. If you find areas that need improvement or clarification, please update this guide accordingly.
