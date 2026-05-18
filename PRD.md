# Planning Guide

A software test notebook application that allows quality assurance teams to document test procedures with rich media support, track pass/fail criteria via checkboxes, and export/import test data in JSON format.

**Experience Qualities**:
1. **Efficient** - Quick data entry with keyboard shortcuts and inline image pasting for rapid test documentation
2. **Visual** - Rich text support with embedded icons and screenshots to create clear, illustrative test procedures
3. **Reliable** - Automatic persistence and JSON export/import to prevent data loss and enable sharing

**Complexity Level**: Light Application (multiple features with basic state)
- This is a focused test documentation tool with multiple interconnected features (test items, requirements, criteria, media handling) but remains a single-view application with straightforward CRUD operations and file I/O.

## Essential Features

### Test Item Management
- **Functionality**: Create, edit, and delete test items (end items) that represent software components or features being tested
- **Purpose**: Organize tests by the specific software elements under evaluation
- **Trigger**: Click "Add Test Item" button or use keyboard shortcut
- **Progression**: Click add button → Enter item name → Item appears in list → Can be selected to view/edit requirements
- **Success criteria**: Users can create multiple test items, switch between them, and each maintains its own set of requirements

### Requirement Entry with Rich Media
- **Functionality**: Add test requirements with embedded images (icons, screenshots) and formatted text describing test steps
- **Purpose**: Create clear, visual test procedures that are easy to follow
- **Trigger**: Click "Add Requirement" within a test item
- **Progression**: Click add → Enter requirement text → Paste or upload images inline → Images appear embedded in text → Requirement saved
- **Success criteria**: Users can paste screenshots directly, upload small icons, and see images rendered inline with text; images are preserved in JSON export

### Pass/Fail Criteria Tracking
- **Functionality**: Define multiple pass/fail criteria as checkboxes for each requirement
- **Purpose**: Track which validation points have been completed during testing
- **Trigger**: Add criteria to a requirement
- **Progression**: Click "Add Criterion" → Enter criterion text → Checkbox appears → Click to toggle pass/fail → State persists
- **Success criteria**: Each requirement can have multiple checkboxes that maintain their state and are included in exports

### JSON Export/Import
- **Functionality**: Save all test data (items, requirements, criteria, images) to a JSON file and reload previously saved tests
- **Purpose**: Enable data persistence, backup, and sharing of test notebooks between team members
- **Trigger**: Click "Export JSON" or "Import JSON" buttons
- **Progression**: Export: Click button → Browser downloads JSON file with all data | Import: Click button → Select file → All data loads into application
- **Success criteria**: Exported JSON contains all text, checkbox states, and base64-encoded images; imported files fully restore application state

## Edge Case Handling
- **Empty States**: Show helpful prompts when no test items or requirements exist
- **Large Images**: Display warning if pasted image exceeds 2MB; suggest optimization
- **Invalid JSON Import**: Show error message with specific issue (malformed JSON, wrong schema)
- **Unsaved Changes**: Persist data to localStorage automatically to prevent loss on accidental closure
- **Long Requirement Text**: Auto-expand text areas and maintain readability with proper wrapping

## Design Direction
The design should evoke a professional laboratory notebook feeling - clean, organized, and trustworthy like scientific documentation, with subtle technical sophistication through precision typography and a structured layout.

## Color Selection

- **Primary Color**: Deep Technical Blue `oklch(0.45 0.15 250)` - Communicates precision, reliability, and technical expertise
- **Secondary Colors**: 
  - Neutral Slate `oklch(0.96 0.005 250)` for backgrounds - Creates a clean workspace
  - Charcoal `oklch(0.30 0.01 250)` for text - Professional and readable
- **Accent Color**: Success Green `oklch(0.65 0.18 145)` for checkboxes and positive actions - Clear visual feedback for passed tests
- **Foreground/Background Pairings**: 
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(0.99 0 0)) - Ratio 8.2:1 ✓
  - Neutral Background (oklch(0.96 0.005 250)): Charcoal text (oklch(0.30 0.01 250)) - Ratio 11.5:1 ✓
  - Accent Green (oklch(0.65 0.18 145)): White text (oklch(0.99 0 0)) - Ratio 5.8:1 ✓

## Font Selection
Typefaces should balance technical precision with excellent readability for documentation work - a technical sans-serif for UI elements paired with a highly legible monospace for test data.

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 32px / -0.02em letter spacing
  - H2 (Test Item Names): Space Grotesk SemiBold / 24px / -0.01em
  - H3 (Requirement Headers): Space Grotesk Medium / 18px / normal
  - Body (General UI): Inter Regular / 15px / normal / 1.6 line height
  - Monospace (IDs, JSON): JetBrains Mono Regular / 14px / 0.5ch letter spacing

## Animations
Animations should feel precise and technical, with quick, purposeful transitions that emphasize the structured nature of test documentation - smooth expansions for adding items, subtle checkbox confirmations, and quick fade-ins for new content.

## Component Selection

- **Components**:
  - `Card` with subtle shadows for test items - organized, contained sections
  - `Accordion` for collapsible requirements - efficient space usage
  - `Checkbox` for pass/fail criteria - clear, accessible interaction
  - `Button` variants (default for primary actions, outline for secondary) - clear action hierarchy
  - `Textarea` auto-resizing for requirement text - flexible input
  - `Input` for test item names and criterion labels
  - `Dialog` for JSON import and confirmation actions
  - `Badge` to show requirement counts and status
  - `Separator` to divide sections
  - `ScrollArea` for long lists of requirements
  
- **Customizations**:
  - Custom image upload/paste component with preview and inline rendering
  - Custom JSON viewer for debugging exports
  - Rich text editor component with image embedding capability
  - Drag-and-drop reordering for requirements
  
- **States**:
  - Buttons: Subtle scale-down on press, color shift on hover
  - Checkboxes: Smooth checkmark animation with green highlight
  - Cards: Elevated shadow on hover for test items, border highlight when selected
  - Inputs: Focused state with blue ring and subtle background shift
  
- **Icon Selection**:
  - `Plus` for adding items/requirements/criteria
  - `Trash` for deletion actions
  - `Image` for image upload triggers
  - `DownloadSimple` for JSON export
  - `UploadSimple` for JSON import
  - `FloppyDisk` for save indicators
  - `Check` for completed criteria
  - `ClipboardText` for test items
  
- **Spacing**: 
  - Container padding: `p-6`
  - Card padding: `p-4`
  - Section gaps: `gap-6`
  - List item gaps: `gap-3`
  - Inline spacing: `gap-2`
  
- **Mobile**: 
  - Stack test items vertically on mobile
  - Full-width cards below 768px
  - Floating action button for "Add" on mobile
  - Side-by-side buttons become stacked
  - Reduced padding (p-4 instead of p-6)
