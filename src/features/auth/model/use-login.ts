import { publicRqClient } from "@/shared/api/instance";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigation = useNavigate();

  const session = useSession();

  const loginMutation = publicRqClient.useMutation("post", "/auth/login", {
    onSuccess(data) {
      session.login(data.accessToken);
      navigation(ROUTES.HOME);
    },
  });

  const login = (data: ApiSchemas["LoginRequest"]) => {
    loginMutation.mutate({ body: data });
  };

  const errorMessage = loginMutation.isError
    ? loginMutation.error.message
    : undefined;
  const isPending = loginMutation.isPending;

  return { login, errorMessage, isPending };
};
