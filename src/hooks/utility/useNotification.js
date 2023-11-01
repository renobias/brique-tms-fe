import { notificationContext } from "../../contexts/utility";
import React, { useContext } from "react";

export const useNotification = () => useContext(notificationContext);
