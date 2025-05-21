import { Button } from "@/shared/ui/kit/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../model/use-login";

const loginSchema = z.object({
    email: z
        .string({
            required_error: "Поле обов'язкове для заповнення",
        })
        .email("Невірна адреса електронної пошти"),
    password: z
        .string({
            required_error: "Поле обов'язкове для заповнення",
        })
        .min(6, "Пароль повинен мати довжину не менше 6 символів"),
});

const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(loginSchema),
    });

    const { login, isPending, errorMessage } = useLogin()

    const onSubmit = form.handleSubmit(login);

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Імейл</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {errorMessage && (
                    <div className="text-red-500 text-sm">
                        {errorMessage}
                    </div>
                )}
                <Button disabled={isPending} type="submit">Зареєструватися</Button>
            </form>
        </Form>
    );
};

export default LoginForm;

