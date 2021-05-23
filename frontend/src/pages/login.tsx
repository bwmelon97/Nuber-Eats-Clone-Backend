import React from "react";
import { useForm } from "react-hook-form";

type LoginFormInput = {
    email: string;
    password: string;
}

function Login () {
    const { register, getValues, handleSubmit, formState: { errors } } = useForm<LoginFormInput>()
    const onSubmit = () => console.log(getValues())

    return (
        <div className='h-screen flex justify-center items-center  bg-gray-800' > { /* 배경 */ }
            <div className='bg-white w-full max-w-lg py-10 rounded-lg flex flex-col items-center' > {/* 로그인 배경 */}
                <h1 className='text-2xl text-gray-800 mb-5 select-none' > Login Page </h1>
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 w-full px-8' >
                    <input 
                        {...register('email', {
                            required: 'Email is required'
                        })}
                        type='email'
                        placeholder='email' 
                        className='login-input'
                    />
                    <input 
                        {...register('password', {
                            required: 'Password is required',
                            minLength: 5
                        })}
                        type='password'
                        placeholder='password' 
                        className='login-input'
                    />
                    { errors.email?.message && <span className='err-msg' > {errors.email.message} </span> }
                    { errors.password?.type === 'minLength' && <span className='err-msg' > Password should longer or same with 5. </span> }
                    { errors.password?.message && <span className='err-msg' > {errors.password.message} </span> }
                    <button className='py-3 px-4 rounded-lg bg-gray-800 text-white text-lg focus:outline-none hover:bg-opacity-90' >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;