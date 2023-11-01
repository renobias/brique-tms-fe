import * as actionTypes from "./actionTypes";

export function resetState() {
  return {
    type: actionTypes.RESET_STATE,
  };
}

export function setOutletCode(payload) {
  return {
    type: actionTypes.SET_OUTLET_CODE,
    payload,
  };
}

export function setFormCategories(payload) {
  return {
    type: actionTypes.SET_FORM_CATEGORIES,
    payload,
  };
}

export function setFormSubmissionList(payload) {
  return {
    type: actionTypes.SET_FORM_SUBMISSION_LIST,
    payload,
  };
}

export function setBookingInfo(payload) {
  return {
    type: actionTypes.SET_BOOKING_INFO,
    payload,
  };
}

export function setCustomerInfo(payload) {
  return {
    type: actionTypes.SET_CUSTOMER_INFO,
    payload,
  };
}
