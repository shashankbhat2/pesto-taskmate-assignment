import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate} from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
const LoginPage = () => {
    const { loginMutation, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if(isAuthenticated){
            navigate("/dashboard")
        }
    }, [isAuthenticated])
    

    const { register, handleSubmit, formState } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { errors, isValid, isLoading } = formState;

    const onSubmit = (data: any) => {
        loginMutation.mutate(data)
    };

    return (
        <section className="flex flex-col justify-center items-center gap-5 bg-red-100 min-h-screen">
            <img src="/logo_secondary.png" alt="taskmate" className='w-[200px]' />
            <form onSubmit={handleSubmit(onSubmit)} className='border p-4 bg-white flex justify-center items-center flex-col gap-4 rounded-md'>
                <h1 className='text-lg font-medium text-muted-foreground mb-2'>Welcome Back</h1>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="email" className='text-xs font-medium'>Email</label>
                    <input type="email"  {...register("email")} id="email" className='border p-2 rounded-md' placeholder='pikachu@gmail.com' />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="password" className='text-xs font-medium'>Password</label>
                    <input type="password" id="password" {...register("password")} className='border p-2 rounded-md' placeholder='*******' />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <Button disabled={!isValid || isLoading} type='submit' className='w-full bg-indigo-500'>Login</Button>
                <p className='text-xs'> Don't Have an account? <Link to="/signup" className="text-indigo-500 font-medium">Register</Link> </p>
            </form>
        </section>
    )
}

export default LoginPage