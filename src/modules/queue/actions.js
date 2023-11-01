import * as actionTypes from "./actionTypes";

export function addCounter() {
  return {
    type: actionTypes.ADD_COUNTER,
  };
}

export function resetState() {
  return {
    type: actionTypes.RESET_STATE,
  };
}

export function resetCounter() {
  return {
    type: actionTypes.RESET_COUNTER,
  };
}

export function resetDataCall() {
  return {
    type: actionTypes.RESET_DATA_CALL,
  };
}

export function resetCustomerForm() {
  return {
    type: actionTypes.RESET_CUSTOMER_FORM,
  };
}

export function setDataCall(payload) {
  return {
    type: actionTypes.SET_DATA_CALL,
    payload
  }
}

export function setDataSummary(payload) {
  return {
    type: actionTypes.SET_DATA_SUMMARY,
    payload
  }
}

export function setDeferredList(payload) {
  return {
    type: actionTypes.SET_DEFERRED_LIST,
    payload
  }
}

export function setResidueList(payload) {
  return {
    type: actionTypes.SET_RESIDUE_LIST,
    payload
  }
}

export function setCustomerForm(payload) {
  return {
    type: actionTypes.SET_CUSTOMER_FORM,
    payload
  }
}

export function setCustomerFormDataTitle(payload) {
  return {
    type: actionTypes.SET_CUSTOMER_FORM_DATA_TITLE,
    payload
  }
}

export function setCustomerFormDataValue(payload) {
  return {
    type: actionTypes.SET_CUSTOMER_FORM_DATA_VALUE,
    payload
  }
}

export function setDisabledBtn({ btnType, isDisabled }) {
  return {
    type: actionTypes.SET_DISABLED_BTN,
    btnType,
    isDisabled
  }
}

export function setCurrentTransactionKey(payload) {
  return {
    type: actionTypes.SET_CURRENT_TRANSACTION_KEY,
    payload
  }
}

export function setCurrentTransactionIndex(payload) {
  return {
    type: actionTypes.SET_CURRENT_TRANSACTION_INDEX,
    payload
  }
}