# Project Plan: Supabase & Mobile Features

This document tracks the cumulative feature requirements and prompts requested for the Ark codebase.

## Chronological Prompts & Feature Requirements

### 1. Supabase Backend Integration
- **Database Connection**: Set up Supabase with credentials:
  - URL: `https://ghzqgphhpoqpjflujowj.supabase.co`
  - Publishable Key (Anon Key): `sb_publishable_GJe8D_gZg25qVaeu5gd0hg_BMlnyeoB`
- **Pains Board Storage**: All pains uploaded in the website should be sent to the database (in table `pains`), along with their upvote counts, voted states, and statuses.

### 2. Enhanced Solution Submission Flow
- **Additional Contributor Metadata**: When submitting a solution, ask for the contributor's name, email, category, and an optional screenshot/photo.
- **Moderation Queue**: Solutions go to a pending review state (`status: 'pending'`). They are not marked as solved immediately.
- **Success Acknowledgment**: Show a "Submitted for review ✓" modal confirmation.

### 3. Community Tool Submissions (`/submit-tool`)
- **Direct Submission**: A dedicated page where contributors can submit tools directly (not tied to a specific pain point).
- **Form Fields**: Tool name, URL, description, category, photo, and contributor metadata. Goes to pending review.

### 4. Agentic Search Overlay
- **Search Placement**: Search icon in the header navigation or triggerable via keyboard shortcut (`Ctrl+K`/`Cmd+K`).
- **Fuzzy Search Query**: Debounced fuzzy matching search across pains (titles, solution details) and approved tools.
- **No Results Action**: Suggest quick search tags, and provide a Call-To-Action (CTA) to submit a new pain point if no results are found.

### 5. Admin Control Panel (`/admin`)
- **Review Dashboard**: Authenticated screen (using password `ark2026`) to manage pending queues.
- **Action Handlers**:
  - Approve tool: Adds tool to the public search index.
  - Approve solution: Marks pain point as solved, attaches tool information.
  - Reject tool / solution.

### 6. Design and Mobile Polish
- **Padding Consistency**: Unified 10px spacing between modal inputs/labels and consistent row spacing.
- **Mobile Responsiveness**: Complete CSS media query optimizations to ensure all newly created pages (`/submit-tool`, `/admin`, search, modal) scale elegantly down to small screens (375px) without horizontal clipping or scrollbars.
- **Test cases**: Automated unit test coverage for the Supabase service logic to prevent regressions.
