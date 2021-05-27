import React from "react";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "@gql-types/LoginMutation";

const LOGIN_MUTATION = gql`
    mutation LoginMutation($loginInput: LoginInput!) {
        login(input: $loginInput) {
            ok
            error
            token
        }
    }
`;

type LoginFormInput = {
    email: string;
    password: string;
}

function Login () {
    const { register, getValues, handleSubmit, formState: { errors } } = useForm<LoginFormInput>()
    
    const onCompleted = (data: LoginMutation) => {
        const { login: { ok, token } } = data;
        if (ok) console.log(token)
    }
    const [
        loginMutation, 
        { loading, data: loginMutationResult }
    ] = useMutation< LoginMutation, LoginMutationVariables >(LOGIN_MUTATION, { onCompleted })
    
    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues()
            loginMutation({
                variables: {
                    loginInput: {
                        email, password
                    }
                }
            })
        }
    }

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
                        { loading ? 'loading...' : 'Log in' }
                    </button>
                    { loginMutationResult?.login.error && <span className='err-msg' > {loginMutationResult?.login.error} </span> }
                </form>
            </div>
        </div>
    )
}

export default Login;