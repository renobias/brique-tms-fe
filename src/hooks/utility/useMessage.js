import { messageContext } from "../../contexts/utility/message";
import React, { useContext } from "react";

export const useMessage = () => useContext(messageContext);
