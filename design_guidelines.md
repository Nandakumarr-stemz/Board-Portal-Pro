# Board Portal Management System - Design Guidelines

## Design Approach
**System Selected:** Microsoft Fluent Design + Enterprise Dashboard Patterns
**Rationale:** Board portals require trust, clarity, and efficiency. Fluent's emphasis on depth, motion (subtle), and material creates professional credibility while maintaining usability for executives who may not be tech-savvy.

**Key References:** Microsoft Teams, Notion, Linear (for clean data presentation)

## Core Design Principles
1. **Executive Clarity:** Information hierarchy optimized for quick scanning during high-stakes meetings
2. **Document-Centric:** Prioritize easy access to agendas, minutes, and materials
3. **Trust Signals:** Professional aesthetic that conveys security and confidentiality
4. **Efficient Workflows:** Minimize clicks for common tasks (view agenda, approve minutes, access documents)

---

## Typography System

**Font Family:** Inter (primary), SF Pro Display (headings)
- **Headings:** 32px/28px/24px (H1/H2/H3) - Medium weight (500)
- **Body:** 16px - Regular (400)
- **Labels/Metadata:** 14px - Medium (500)
- **Captions:** 12px - Regular (400)
- **Emphasis:** Use Medium (500) weight, never bold

---

## Layout System

**Spacing Scale:** Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-6
- Section spacing: py-12 or py-16
- Card gaps: gap-6
- Inner component spacing: space-y-4

**Grid Structure:**
- Dashboard: 12-column grid (grid-cols-12)
- Content areas: max-w-7xl mx-auto
- Sidebar: Fixed 280px width (w-70)
- Main content: Fluid with 64px padding (px-16)

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Height: 72px
- Company logo (left) + Search bar (center) + User profile/notifications (right)
- Sticky positioning

**Sidebar Navigation:**
- Dashboard, Meetings, Documents, Board Members, Settings
- Active state: Subtle left border (4px) with filled background
- Icon + label pattern throughout

### Dashboard Widgets
**Meeting Overview Card:**
- Next meeting countdown with date/time
- Quick access to agenda and materials
- Attendee avatars (max 8 visible, +N indicator)
- Action buttons: "Join Meeting" / "Review Agenda"

**Upcoming Meetings List:**
- Table format with columns: Date, Title, Status, Actions
- Row height: 64px with hover state
- Status badges: Scheduled, In Progress, Completed

**Documents Grid:**
- 3-column grid (grid-cols-3) of document cards
- Card includes: Document type icon, title, last modified, download button
- Hover: Subtle elevation increase

**Action Items Panel:**
- Checklist format with assignee avatars
- Priority indicators (High/Medium/Low as colored dots)
- Due date with proximity warnings

### Meeting Detail View
**Header Section:**
- Meeting title (H1), date/time, location/virtual link
- Status indicator and participant count
- Primary actions: Edit, Share, Export PDF

**Tabbed Content:**
- Tabs: Agenda, Documents, Minutes, Participants
- Tab bar with underline indicator for active state

**Agenda Builder:**
- Drag-and-drop items with reorder handles
- Time allocation per item with visual timeline
- Nested items support (indent with ml-8)
- Expandable/collapsible sections

### Document Repository
**Filter Bar:**
- Date range selector, document type dropdown, search input
- Horizontal layout with gap-4 between filters

**Document Table:**
- Sortable columns: Name, Type, Date, Size, Owner
- Batch selection checkboxes
- Quick preview on row click (modal or side panel)

### Forms & Inputs
**Input Fields:**
- Height: 48px with rounded-lg borders
- Label above input (14px, Medium weight)
- Placeholder text at 90% opacity
- Focus state: 2px border with subtle shadow

**Buttons:**
- Primary: h-12 px-6 rounded-lg (Medium weight text)
- Secondary: Same size with border treatment
- Icon buttons: 40px square with rounded-md

**Date/Time Pickers:**
- Inline calendar widget for date selection
- Time slots in 15-minute increments
- Timezone display for distributed boards

---

## Images

**Hero Section (Login/Welcome Page):**
- Full-width background image (h-screen): Professional boardroom or modern office space
- Overlay: Dark gradient (opacity-60) for text legibility
- Centered login card with blurred background (backdrop-blur-xl)
- Image should convey: Trust, professionalism, collaboration

**Empty States:**
- Illustrations for "No meetings scheduled," "No documents," etc.
- Style: Line art with minimal accent treatment
- Placement: Centered in content area with descriptive text below

**User Avatars:**
- Circular, 40px diameter (meeting lists), 32px (participants)
- Stack with -ml-2 overlap when showing multiple users
- Placeholder: Initials on solid background for users without photos

---

## Accessibility Standards
- WCAG AA compliance minimum (4.5:1 contrast for body text)
- Keyboard navigation for all interactive elements with visible focus indicators
- ARIA labels for icon-only buttons
- Screen reader announcements for dynamic updates (new documents, meeting changes)
- Skip navigation links

---

## Animation Philosophy
**Minimal Motion:**
- Sidebar expand/collapse: 200ms ease-out
- Modal entry: 150ms scale + fade
- List item hover: Instant background transition
- No scroll-triggered animations
- Prefer instant feedback over decorative motion