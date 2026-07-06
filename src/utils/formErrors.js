/* src/utils/formErrors.js
   Helpers for working with the API's validation error shape.

   The backend returns:
     { field: [messages] }      // Laravel-style field validation
     OR
     { field: 'single message' } // single message per field
     OR
     { code: 'auth.user_not_found' } // domain-level code

   The `toFieldErrors` helper flattens everything into a { field: msg }
   map so the form can render inline errors under each input. */

export const toFieldErrors = (errors = {}) => {
  const out = {};
  Object.entries(errors).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      out[field] = value[0];
    } else if (typeof value === 'string') {
      out[field] = value;
    }
  });
  return out;
};