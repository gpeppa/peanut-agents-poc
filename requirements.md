# Requirements

## Feature
Build a single-page web application for email address validation.

## UI
- A centered card on the page with:
  - A title: "Email Validator"
  - A text input field with placeholder "Enter email address"
  - A "Validate" button next to the input
  - A result area below that displays the validation outcome

## Behaviour
- When the user clicks "Validate" (or presses Enter in the input field):
  - If the email is valid: show a green success message "✓ Valid email address"
  - If the email is invalid: show a red error message "✗ Invalid email address"
- The result clears when the user starts typing a new value
- The input field is focused automatically on page load

## Validation Rules
An email is valid if it meets all of the following:
- Contains exactly one `@` symbol
- Has a non-empty local part before `@`
- Has a domain after `@` that contains at least one `.`
- Has a non-empty part after the last `.` (TLD)
- Contains no spaces

## Technical Requirements
- Implemented as a single self-contained `index.html` file
- No external libraries or frameworks — plain HTML, CSS, and JavaScript only
- Must work by opening the file directly in a browser (no server needed)
- Responsive layout that works on both desktop and mobile

## Acceptance Criteria
- Valid inputs that must pass: `user@example.com`, `name.surname@domain.co.uk`
- Invalid inputs that must fail: `notanemail`, `missing@domain`, `@nodomain.com`, `two@@at.com`, `has space@email.com`
- All acceptance criteria cases must be covered by the tester's test plan
