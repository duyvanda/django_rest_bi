UI Rules & Design System

This document outlines the user interface standards, component patterns, and styling rules based on the Tracking_chi_phi_hcp module. These rules should be applied to future UI generation to maintain consistency.

1. Technology Stack

Core Framework: React (Hooks: useState, useEffect, useContext).

UI Library: react-bootstrap (Bootstrap 5).

Routing: react-router-dom.

Icons: Native Emojis (e.g., 🔍, 📖, 📤) are preferred over icon libraries for simple actions.

State Management: Context API (FeedbackContext) for global feedback (alerts, loading).

2. Layout & Grid System

Page Container:

Must use <Container fluid> with the class bg-teal-100 h-100.

This provides the signature full-height teal background.

Content Centering:

Content is restricted to a central column for a "mobile-first" or "form-focused" aesthetic.

Use <Row className="justify-content-center">.

Use <Col xs={12} md={4} lg={3} > as the main wrapper for the application content.

Behavior: This ensures full-width display on mobile devices (xs) while restricting width to 5 columns on tablets/desktops (md).

3. Component Styling Patterns

3.1. Cards / Content Blocks

Instead of the Bootstrap <Card> component, use <div> with standard utility classes to create card-like surfaces:

Standard Class: bg-white border rounded shadow-sm p-3

Usage: Wrap forms, lists, tables, and button groups in these blocks.

Spacing: Use mt-2 or mt-3 to separate blocks.

3.2. Navigation (Pills)

Component: <Nav variant="pills" fill>

Styling:

Container: bg-light p-2 rounded gap-2 fw-bold.

Active Item: bg-merap-active (Custom class), Text color defaults to white/light.

Inactive Item: bg-white shadow-sm border + optional text color (e.g., text-success, text-info).

3.3. Search & Filtering

Placement: Inside a Content Block (3.1).

Input Style: Standard Form.Control.

Placeholder: Must include a search icon emoji and instruction (e.g., 🔍 Tìm mã hoặc tên (KHÔNG DẤU)).

Logic: Filter arrays using toLowerCase() and includes().

3.4. Scrollable List

Container: <ListGroup> with inline styles for scrollability: style={{ maxHeight: "350px", overflowY: "auto" }}.

Items: <ListGroup.Item className="p-1 bg-white border rounded">.

Selection Mechanism:

Use <Form.Check type="switch"> inside the list item.

Labels should combine ID and Name (e.g., id + ')' + name).

4. Buttons & Actions

4.1. Button Variants

Primary Action (Save/Submit): variant="primary".

Positive Action (Approve/Add): variant="success".

Negative Action (Reject/Remove): variant="danger".

Informational (Rules/Help): variant="info".

Navigation/Back: variant="outline-success" or similar outlines.

4.2. Button Grouping

Bottom Action Bar:

Use a flex container: <div className="mt-2 d-grid gap-2 d-md-flex ...">.

Buttons should have className="flex-fill" to span evenly.

Use size="lg" for the main footer buttons.

5. Feedback & Interaction

5.1. Loading State

Implementation: Use a global loading state from Context.

UI: A centered <Modal> containing a generic disabled button with <Spinner animation="grow" size="sm"/>.

5.2. Alerts

Preferred: Use the Context-driven <Alert> inside the Loading Modal or at the top of the content column.

Must be dismissible.

Structure: <strong>Heading: </strong> Message.

Fallback (Legacy): window.alert() (Avoid for new features; prefer Context Alert).

5.3. Modals

Usage: For displaying static rules (read-only) or complex inputs (Excel upload).

Structure: Standard <Modal> with Header, Body, and Footer containing Close/Submit buttons.

6. Code Conventions

Naming: Snake_case is frequently used for variables and function names in this codebase (e.g., tracking_chi_phi_hcp, handle_submit, set_arr_hcp).

Imports: Group imports: React hooks first, Router second, Context third, Bootstrap components last.

Formatting: Numbers (currency) formatted using Intl.NumberFormat.

Context Boilerplate: Always destructure the full suite of utilities from FeedbackContext to ensure availability of loggers, loaders, and alerts:

const { get_id, Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)


7. Form Controls & Inputs

7.1. Text & Numeric Inputs

Component: <FloatingLabel> wrapping a <Form.Control>.

Styling:

Wrapper: className="border rounded mt-2".

Input: Standard Bootstrap styles.

Validation Feedback: Display error messages immediately below the input using <p className="ml-1 fw-bold text-danger">.

Grouping: Use <Stack gap={1}> to wrap the input and its error message together.

7.2. Select Menus (Native)

Component: <Form.Select>.

Styling:

Height: Use className="py-3" (standard Bootstrap padding) to achieve a large, touch-friendly height (~58-60px) without hardcoded inline styles.

Font Size: style={{ fontSize: "15px" }}.

Spacing: className="mt-2 py-3".

Layout: Use <Stack direction="horizontal" gap={2}> to group multiple selects on a single line (e.g., Province, District, Ward).

7.3. Advanced Searchable Dropdowns

Usage: For selecting items from large datasets (e.g., Hospitals, HCPs) where a simple <select> is insufficient.

Structure:

Wrapper: <Dropdown autoClose="true" block="true" onSelect={...}>

Toggle: className="bg-white border-0 text-dark text-left flex-grow-1 w-100 py-3" (Using py-3 replaces the need for style={{ height: "60px" }}).

Menu: className="w-100" with style={{ maxHeight: "410px", overflowY: "auto" }}.

Internal Search: Inside the menu, include a <Form.Control placeholder="Tìm không dấu"> followed by a <Dropdown.Divider>.