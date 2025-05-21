import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import AuthLayout from "./ui/auth-layout";
import RegisterForm from "./ui/register-form";

function RegisterPage() {
    return (
        <AuthLayout
            title="Реєструйтеся"
            description="Введіть адресу електронної пошти та пароль для реєстрації"
            footerText={
                <>
                    У Вас вже є акаунт?
                    <Link to={ROUTES.REGISTER}>Увійти</Link>
                </>
            }
            form={<RegisterForm />}
        >
        </AuthLayout >
    )
}

export const Component = RegisterPage;
