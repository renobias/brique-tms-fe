import { authProvider } from "../../../authProvider";
import { useNotification } from "../../../hooks/utility";
// import { useRouter } from "next/router";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRegister() {
  const { openNotification } = useNotification();
  const navigate = useNavigate();
  // const { replace } = useRouter();
  const [state, setState] = useState({
    isLoading: false,
  });

  async function fire({ email, username, password }) {
    setState({
      ...state,
      isLoading: true,
    });
    const { success, redirectTo, error, data } =
      await authProvider.registerIdentity({
        email,
        username,
        password,
      });
    setState({
      ...state,
      isLoading: false,
    });
    if (success) {
      openNotification({
        type: "success",
        title: "Success",
        description: data?.massage,
      });
      setTimeout(() => {
        // replace({ pathname: redirectTo });
        navigate(redirectTo, { replace: true });
      }, 3000);
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
