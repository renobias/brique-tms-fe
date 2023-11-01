import React, { useState } from "react";

export const useFocus = () => {
  const [focused, setFocused] = useState();

  window.onfocus = function () {
    setFocused(true);
  };

  window.onblur = function () {
    setFocused(false);
  };

  return { focused };
};
