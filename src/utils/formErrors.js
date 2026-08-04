/* src/utils/formErrors.js
   Helpers for working with the API's validation error shape.

   The backend returns:
     { field: [messages] }      // Laravel-style field validation
     OR
     { field: 'single message' } // single message per field
     OR
     { code: 'auth.user_not_found' } // domain-level code

   The `toFieldErrors` helper flattens everything into a { field: msg }
   map so the form can render inline errors under each input.

   @see docs/API.md#sec-response-error
   @see docs/ARCHITECTURE.md#sec-api-error-normalization */

export const toFieldErrors = (errors = {}) => {
  // NOTE: we deliberately use `errors = {}` as the default rather than
  // checking `if (errors == null)`. The backend will sometimes return
  // an empty object {} on success-with-warning, sometimes nothing at
  // all on network errors — defaulting to {} lets both flow through
  // this function without a special-case.
  const out = {};
  Object.entries(errors).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      // NOTE: when there are multiple validation messages for one field,
      // we keep only the first. Forms have room for one error message
      // per input — showing the full list would crowd the UI. The other
      // messages remain available in the raw `errors` object if a caller
      // wants them.
      out[field] = value[0];
    } else if (typeof value === 'string') {
      out[field] = value;
    }
  });
  return out;
};