import * as actionTypes from "./actionTypes";

const initialState = {
  brique: {
    outletCode: null,
    formCategories: { categories: [] },
    formSubmissionList: {},
    bookingInfo: {
      bookingCode: "",
      queueNo: "",
      queueLeft: "",
      magicLink: "",
      referenceCodeList: [""],
    },
    customerInfo: {
      email: "",
      photoBase64: "",
      isOpenModal: false,
    },
  },
  isLoading: false,
};

const cleanStateBrique = {
  outletCode: null,
  formCategories: { categories: [] },
  formSubmissionList: {},
  bookingInfo: {
    bookingCode: "",
    queueNo: "",
    queueLeft: "",
    magicLink: "",
    referenceCodeList: [""],
  },
  customerInfo: {
    email: "",
    photoBase64: "",
    isOpenModal: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      state.brique = { ...cleanStateBrique, outletCode: state?.brique?.outletCode };
      return {
        ...state,
      };
    case actionTypes.SET_OUTLET_CODE:
      state.brique.outletCode = action?.payload;
      return {
        ...state,
      };
    case actionTypes.SET_FORM_CATEGORIES:
      state.brique.formCategories = {
        ...action?.payload,
        errorCode: null,
        errorMssg: null,
      };
      return {
        ...state,
      };
    case actionTypes.SET_FORM_SUBMISSION_LIST:
      state.brique.formSubmissionList = {
        ...action?.payload,
      };
      return {
        ...state,
      };
    case actionTypes.SET_BOOKING_INFO:
      state.brique.bookingInfo = {
        ...action?.payload,
      };
      return {
        ...state,
      };
    case actionTypes.SET_CUSTOMER_INFO:
      state.brique.customerInfo = {
        ...action?.payload,
      };
      return {
        ...state,
      };
    default:
      return state;
  }
}
