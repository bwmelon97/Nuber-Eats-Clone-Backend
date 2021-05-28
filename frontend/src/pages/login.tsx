import React from "react";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "@gql-types/LoginMutation";
import { StyledButton, StyledInput } from "@components/FormComponents";
import { LOGO_IMG_URL } from "@constants";

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
    const { register, getValues, handleSubmit, formState: { errors, isValid, touchedFields },  } = useForm<LoginFormInput>({ mode: 'onChange' })
    
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
        <div className='h-screen flex justify-center bg-white' > { /* 배경 */ }
            <div className='mt-8 md:mt-24 px-5 w-full max-w-xl flex flex-col items-center' > {/* 로그인 배경 */}
                <img src={LOGO_IMG_URL} alt='logo' className='w-48 mb-10 md:mb-16' />
                <h3 className='self-start text-2xl font-normal mb-8 md:text-3xl' > 돌아오신 것을 환영합니다 </h3>
                <h4 className='self-start text-base font-light mb-4' > 이메일과 비밀번호를 입력하여 로그인하세요. </h4>
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 w-full' >
                    <StyledInput 
                        {...register('email', {
                            required: 'Email is required',
                            pattern: 
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })}
                        type='email'
                        placeholder='Email' 
                        isDirty={ false }
                    />
                    <StyledInput 
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        type='password'
                        placeholder='Password' 
                        isDirty={ false }
                    />
                    { touchedFields.email && errors.email?.type === 'pattern' && <span className='err-msg' > 이메일 양식에 맞지 않습니다. </span> }
                    { errors.email?.message && <span className='err-msg' > {errors.email.message} </span> }
                    { errors.password?.message && <span className='err-msg' > {errors.password.message} </span> }
                    <StyledButton isVaild={isValid} >
                        { loading ? 'loading...' : 'Log in' }
                    </StyledButton>
                    { loginMutationResult?.login.error && <span className='err-msg' > {loginMutationResult?.login.error} </span> }
                </form>
            </div>
        </div>
    )
}

export default Login;