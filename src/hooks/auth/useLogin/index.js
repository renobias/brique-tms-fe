import { authProvider } from "../../../authProvider";
import { useNotification } from "../../../hooks/utility";
// import { useRouter } from "next/router";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const { openNotification } = useNotification();
  // const { replace } = useRouter();
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
    errorMsg: null,
  });

  async function fire({ username, mode, categoryId, counterNo, branchCode }) {
    setState({
      ...state,
      isLoading: true,
    });
    const { success, redirectTo, error } = await authProvider.login({
      username,
      mode,
      categoryId,
      counterNo,
      branchCode,
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
      //   openNotification({
      //     type: "error",
      //     title: error?.name,
      //     description: error?.message,
      //   });
    }
    return { state };
  }

  return { fire, state };
}
