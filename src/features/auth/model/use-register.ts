import { rqClient } from "@/shared/api/instance";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigation = useNavigate();

  const registerMutation = rqClient.useMutation("post", "/auth/register", {
    onSuccess() {
      navigation(ROUTES.HOME);
    },
  });

  const register = (data: ApiSchemas["RegisterRequest"]) => {
    registerMutation.mutate({ body: data });
  };

  const errorMessage = registerMutation.isError
    ? registerMutation.error.message
    : undefined;
  const isPending = registerMutation.isPending;

  return { register, errorMessage, isPending };
};
