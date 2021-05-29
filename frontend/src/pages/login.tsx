import React from "react";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "@gql-types/LoginMutation";
import { ErrMsg, Form, FormContainer, NuberLink, PageWrapper, StyledButton, StyledInput, SubTitle, Title } from "@components/FormComponents";
import Logo from "@components/Logo";
import { EMAIL_PATTERN } from "@constants";
import { Helmet } from "react-helmet-async";

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
        <PageWrapper >
            <Helmet>
                <title> Login | Nuber-eats </title>
            </Helmet>
            <FormContainer >
                <Logo className='w-48 mb-10 md:mb-16' />
                <Title > 돌아오신 것을 환영합니다 </Title>
                <SubTitle> 이메일과 비밀번호를 입력하여 로그인하세요. </SubTitle>
                <Form onSubmit={handleSubmit(onSubmit)} >
                    <StyledInput 
                        {...register('email', {
                            required: 'Email is required',
                            pattern: EMAIL_PATTERN
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
                    { touchedFields.email && errors.email?.type === 'pattern' && <ErrMsg > 이메일 양식에 맞지 않습니다. </ErrMsg> }
                    { errors.email?.message && <ErrMsg > {errors.email.message} </ErrMsg> }
                    { errors.password?.message && <ErrMsg > {errors.password.message} </ErrMsg> }
                    <StyledButton isVaild={isValid} >
                        { loading ? 'loading...' : 'Log in' }
                    </StyledButton>
                    { loginMutationResult?.login.error && <ErrMsg > {loginMutationResult?.login.error} </ErrMsg> }
                </Form>
                <span> 
                    New to Nuber? &nbsp;
                    <NuberLink to='/signup' >Create Account</NuberLink> 
                </span>
            </FormContainer>
        </PageWrapper>
    )
}

export default Login;