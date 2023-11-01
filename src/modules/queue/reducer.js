import { jsonFormatFromNDSToJSON } from "@/helper";
import * as actionTypes from "./actionTypes";

const initialState = {
  queue: {
    env: "server",
    callCounter: 0,
    dataCall: null,
    dataSummary: null,
    deferredList: [],
    customerForm: {},
    formDataCustomerTitle: [],
    formDataCustomerValue: [],
    residueList: null,
    disabledBtn: {
      next: false,
      recall: false,
      pause: false,
      start: false,
      stop: false,
    },
    currentTransaction: {
      index: null,
      key: null,
    },
  },
  isLoading: false,
};

const cleanStateQueue = {
  env: "server",
  callCounter: 0,
  dataCall: null,
  dataSummary: null,
  deferredList: [],
  residueList: null,
  customerForm: {},
  formDataCustomerTitle: [],
  formDataCustomerValue: [],
  disabledBtn: {
    next: false,
    recall: false,
    pause: false,
    start: false,
    stop: false,
  },
  currentTransaction: {
    index: null,
    key: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_COUNTER:
      state.queue.callCounter += 1;
      return {
        ...state,
      };
    case actionTypes.RESET_STATE:
      console.log("initial state -> ", cleanStateQueue);
      state.queue = { ...cleanStateQueue };
      return {
        ...state,
      };
    case actionTypes.RESET_COUNTER:
      state.queue.callCounter = 0;
      return {
        ...state,
      };
    case actionTypes.RESET_DATA_CALL:
      state.queue.dataCall = null;
      return {
        ...state,
      };
    // case actionTypes.RESET_CUSTOMER_FORM:
    //   state.queue = initialState;
    //   return {
    //     ...initialState,
    //   };
    case actionTypes.SET_DATA_CALL:
      state.queue.dataCall = {
        ...action?.payload,
        respCode: null,
        respMessage: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_DATA_SUMMARY:
      state.queue.dataSummary = {
        ...action?.payload,
        respCode: null,
        respMessage: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_DEFERRED_LIST:
      state.queue.deferredList = [...action?.payload?.deferredList];
      return {
        ...state,
      };
    case actionTypes.SET_RESIDUE_LIST:
      state.queue.residueList = {
        ...action?.payload,
        respCode: null,
        respMessage: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_RESIDUE_LIST:
      state.queue.residueList = {
        ...action?.payload,
        respCode: null,
        respMessage: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_CUSTOMER_FORM:
      state.queue.customerForm = {
        ...action?.payload,
        formData: action?.payload?.formData
          ? jsonFormatFromNDSToJSON(action?.payload?.formData)
          : null,
        respCode: null,
        respMssg: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_CUSTOMER_FORM_DATA_TITLE:
      if (action?.payload) {
        state.queue.formDataCustomerTitle = Object.keys(
          jsonFormatFromNDSToJSON(action?.payload)
        );
      }
      return {
        ...state,
      };
    case actionTypes.SET_CUSTOMER_FORM_DATA_VALUE:
      if (action?.payload) {
        state.queue.formDataCustomerValue = Object.values(
          jsonFormatFromNDSToJSON(action?.payload)
        );
      }
      return {
        ...state,
      };
    case actionTypes.SET_DISABLED_BTN:
      state.queue.disabledBtn[action?.btnType] = action?.isDisabled;
      return {
        ...state,
      };
    case actionTypes.SET_CURRENT_TRANSACTION_KEY:
      console.log("transaction key to change -> ", action?.payload);
      state.queue.currentTransaction.key = action?.payload;
      return {
        ...state,
      };
    case actionTypes.SET_CURRENT_TRANSACTION_INDEX:
      state.queue.currentTransaction.index = action?.payload;
      return {
        ...state,
      };
    default:
      return state;
  }
}
