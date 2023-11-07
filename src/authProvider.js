import { encryptContent } from "./crypto";
import { baseAPI } from "./definitions";
import { briqueTmsDataProvider } from "./rest-data-provider";
import nookies from "nookies";

export const authProvider = {
  login: async ({ clientKey, email, password }) => {
    let user = null;

    try {
      console.log("base api to send -> ", baseAPI.briqueTms);
      const { data: dataHandshake } = await briqueTmsDataProvider(
        baseAPI.briqueTms
      ).post({
        resource: "auth/handshake",
        variables: clientKey,
        meta: { headers: { "Content-Type": "text/plain" } },
      });
      const { handshakeCode, sharedKey } = dataHandshake;

      const payload = {
        clientKey,
        sharedKey,
        payload: {
          email,
          password,
        },
      };
      const { data: dataLogin } = await briqueTmsDataProvider(
        baseAPI.briqueTms
      ).post({
        resource: "auth/login",
        variables: encryptContent(payload),
        query: { hsCode: handshakeCode },
        meta: { headers: { "Content-Type": "text/plain" } },
      });
      user = {
        ...dataLogin,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "Login Error",
          message: `Error (status code: ${error?.statusCode} description: ${error?.message})`,
        },
      };
    }

    if (user) {
      nookies.set(null, "auth", JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "Login Error",
        message: "Unknown Error",
      },
    };
  },
  logout: async ({ username, branchCode }) => {
    try {
      // logoutMock({ username, branchCode });
      // const { data } = await queueMachineDataProvider(
      //   baseAPI.queueMachine
      // ).getQuery({
      //   resource: "endShift",
      //   query: { username, branchCode },
      // });

      // if (isSuccesfullRequest(data?.respCode)) {
      //   nookies.destroy(null, "auth");
      //   return {
      //     success: true,
      //     redirectTo: "/login",
      //   };
      // }

      nookies.destroy(null, "auth");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "Logout Error",
          message: `Error (status code: ${error?.statusCode} description: ${error?.message})`,
        },
      };
    }

    return {
      success: false,
      error: {
        name: "Logout Error",
        message: "Unknown Error",
      },
    };
  },
  check: (ctx) => {
    const cookies = nookies.get(ctx);
    if (cookies["auth"]) {
      return {
        authenticated: true,
        logout: false,
        redirectTo: "/",
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  registerIdentity: async ({ email, username, password }) => {
    let user = null;

    try {
      // const { data } = await simpleMovieDataProvider(
      //   baseAPI.simpleMovie
      // ).create({
      //   resource: "user/register",
      //   variables: {
      //     email,
      //     username,
      //     password,
      //   },
      // });
      // user = { ...data };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: `Error (status code: ${error?.statusCode} description: ${error?.message})`,
        },
      };
    }

    if (user) {
      return {
        success: true,
        redirectTo: "/login",
        data: user,
      };
    }

    return {
      success: false,
      error: {
        name: "RegisterError",
        message: "Unknown Error",
      },
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
