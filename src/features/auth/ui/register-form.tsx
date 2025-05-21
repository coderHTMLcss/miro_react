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
import { useRegister } from "../model/use-register";

const registerSchema = z.object({
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
    confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Паролі не співпадають",
});

const RegisterForm = () => {
    const form = useForm({
        resolver: zodResolver(registerSchema),
    });

    const { register, isPending, errorMessage } = useRegister()

    const onSubmit = form.handleSubmit(register);

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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Підтвердити пароль</FormLabel>
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
                <Button disabled={isPending} type="submit">Увійти</Button>
            </form>
        </Form>
    );
};

export default RegisterForm;

