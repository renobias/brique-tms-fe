export function notAllowedNumberRegex() {
  return /^([^0-9]*)$/;
}

export function notAllowedAlphabetRegex() {
  return /^([^a-z][^A-Z]*)$/g;
}

export function alphabetRegex() {
  return /([a-z][A-Z]*)/;
}
