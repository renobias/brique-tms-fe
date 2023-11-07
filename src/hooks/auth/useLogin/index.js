import { authProvider } from "../../../authProvider";
import { useNotification } from "../../../hooks/utility";
// import { useRouter } from "next/router";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandom32UniqueCode } from "../../../utility";

export function useLogin() {
  const { openNotification } = useNotification();
  // const { replace } = useRouter();
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
    errorMsg: null,
  });

  async function fire({ email, password }) {
    const clientKey = getRandom32UniqueCode();
    console.log("client key ->", clientKey);
    setState({
      ...state,
      isLoading: true,
    });
    const { success, redirectTo, error } = await authProvider.login({
      clientKey,
      email,
      password,
    });
    setState({
      ...state,
      isLoading: false,
      errorMsg: error?.message,
    });
    if (success) {
      navigate(redirectTo, { replace: true });
      // replace({ pathname: redirectTo });
    }
    if (error) {
      openNotification({
        type: "error",
        title: error?.name,
        description: error?.message,
      });
    }
    return { state };
  }

  return { fire, state };
}
