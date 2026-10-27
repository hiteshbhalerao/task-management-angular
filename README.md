# Taskflow — Angular task manager

A compact task-management app built as a technical-assessment project. It supports creating, editing, searching, filtering and deleting tasks, with a live summary for total, completed, in-progress and overdue work.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm start
```

Open the local URL printed by Angular CLI (normally `http://localhost:4200`). The first run seeds four example tasks. Task data persists in the browser's local storage; clear the `taskflow.tasks.v1` key in devtools to restore the sample data.

## Tests and build

```bash
npm test
npm run build
```

The unit tests use Jasmine and Angular's Karma builder. Chrome or Chromium must be available for headless test execution.

## Structure

```text
src/app/
  data/       Task API boundary and local mock implementation
  models/     Strongly typed task and filter types
  pages/      Task list, reusable create/edit form, not-found page
  state/      Signal store, derived summary values, state tests
  app.routes.ts
  app.component.ts
```

Standalone page components are lazy-loaded through the router. `TaskApiService` owns persistence and the mock API operations. `TaskStoreService` is the single in-memory source of truth: it calls the API, publishes immutable signal updates, derives dashboard counts, and exposes loading, error and success feedback. Components bind to those signals and do not use `HttpClient` directly. The API boundary can be replaced with an HTTP-backed implementation without moving API calls into the UI.

The form is a single Reactive Form used for both new and existing tasks. It validates a required title of at least three characters plus status, priority and due date. Deletion uses the browser confirmation prompt.

## Requirements checklist

- [x] Task list, title search, status and priority filters, empty state and overdue marker
- [x] Reusable create/edit Reactive Form with validation messages
- [x] Confirmed deletion and dashboard summary
- [x] `/tasks`, `/tasks/new`, `/tasks/:id/edit`, default redirect and not-found route
- [x] Signal-based single source of truth, immutable updates and derived counts
- [x] Mock CRUD API with browser persistence, loading/error/success feedback
- [x] Tests for derived service behavior, component filtering, form validation and API error handling
- [x] Responsive layout and lazy-loaded routes
- [ ] Real backend/API integration and server-side validation
- [ ] Custom accessible confirmation dialog and end-to-end tests

## Decisions and trade-offs

1. **Why signals?** The data set is small and local. Signals keep reads and derived counts straightforward without adding NgRx ceremony; the API boundary still returns Observables for easy replacement with HTTP.
2. **How does data flow?** Components call store actions; the store calls the mock API and then commits a new immutable task array to its signal. Components read signals for lists, summaries, loading state and feedback.
3. **Time-limit trade-offs:** Persistence is local to one browser, errors are surfaced but not retried, and deletion uses the native confirmation prompt. The assessment does not include an authentication or multi-user model.
4. **Before production:** Connect an authenticated backend, validate on the server, add conflict handling and observability, review accessibility with assistive technology, and add broader integration/e2e coverage.
5. **Thousands of tasks:** Move filtering and pagination to the API, request only the visible page, debounce search, virtualize long lists, and index server-side query fields.

## Assumptions and AI declaration

Due dates use the browser's local calendar date and are stored as `YYYY-MM-DD`. Completed tasks are not counted as overdue. The local mock API seeds demo data on first use. **AI coding assistant used:** OpenAI Codex generated this initial implementation from the supplied assessment document. 
