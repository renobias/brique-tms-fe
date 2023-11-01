import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../authProvider";
import { useNotification } from "../../utility";
// import { useRouter } from "next/router";
import { useState } from "react";

export function useLogout() {
  const { openNotification } = useNotification();
  // const { replace } = useRouter();
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
  });

  async function fire({ username, branchCode }) {
    setState({
      ...state,
      isLoading: true,
    });
    const { success, redirectTo, error } = await authProvider.logout({
      username,
      branchCode,
    });
    setState({
      ...state,
      isLoading: false,
    });
    if (success) {
      // replace({ pathname: redirectTo });
      navigate(redirectTo, { replace: true });
    }
    if (error) {
      openNotification({
        type: "error",
        title: error?.name,
        description: error?.message,
      });
    }
  }

  return { fire, state };
}
