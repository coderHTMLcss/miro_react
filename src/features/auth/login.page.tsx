import { Link } from "react-router-dom";
import AuthLayout from "./ui/auth-layout";
import { ROUTES } from "@/shared/model/routes";
import LoginForm from "./ui/login-form";

function LoginPage() {
    return (
        <AuthLayout
            title="Вхід до системи"
            description="Введіть адресу електронної пошти та пароль, який ви використовували для входу"
            footerText={
                <>
                    Немає акаунта?
                    <Link to={ROUTES.REGISTER}>Реєструйтеся</Link>
                </>
            }
            form={<LoginForm />}
        >
        </AuthLayout >
    );
};

export const Component = LoginPage;
