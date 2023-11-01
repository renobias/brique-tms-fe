import { isSessionClosed } from "../../rest-data-provider/queueMachine/utils/flag";
import { useLogout } from "../auth/useLogout.js/index.js";
import { useNotification } from "../utility/useNotification.js";
import { authProvider } from "../../authProvider.js";
import { useNavigate } from "react-router-dom";

export function useApiSecurity() {
  const { openNotification } = useNotification();
  const { fire: logout } = useLogout();
  const navigate = useNavigate();

  const identity = authProvider.getIdentity();

  function handle(statusCode) {
    const isSessionClosedd = isSessionClosed(statusCode);
    if (isSessionClosedd) {
      openNotification({
        title: "Closed",
        description: "Session Already Closed",
        type: "error",
      });
      navigate("/login", { replace: true });
      //   logout({
      //     username: identity?.username,
      //     branchCode: identity?.branchCode,
      //   });
      return;
    }
  }

  return handle;
}
