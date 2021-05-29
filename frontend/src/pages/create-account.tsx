import React from "react";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ErrMsg, Form, FormContainer, NuberLink, PageWrapper, StyledButton, StyledInput, StyledSelect, SubTitle, Title } from "@components/FormComponents";
import Logo from "@components/Logo";
import { CreateAccountMutation, CreateAccountMutationVariables } from "@gql-types/CreateAccountMutation";
import { UserRole } from "@gql-types/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
    mutation CreateAccountMutation($createUserInput: CreateUserInput!) {
        createUser(input: $createUserInput) {
            ok
            error
        }
    }
`;

type CreateAccountFormInput = {
    email: string;
    password: string;
    password_confirm: string;
    role: UserRole;
}

function CreateAccount () {
    const { 
        register, getValues, handleSubmit, 
        formState: { errors, isValid, touchedFields } 
    } = useForm<CreateAccountFormInput>({ mode: 'onChange' })
    
    const onCompleted = (data: CreateAccountMutation) => {
        console.log('create account success')
    }
    const [
        createAccountMutation, 
        { loading, data: createAccountMutationResult }
    ] = useMutation< CreateAccountMutation, CreateAccountMutationVariables >(CREATE_ACCOUNT_MUTATION, { onCompleted })
    
    const onSubmit = () => {
        if (!loading) {
            const { email, password, role } = getValues()
            createAccountMutation({
                variables: {
                    createUserInput: {
                        email, password, role
                    }
                }
            })
        }
    }

    return (
        <PageWrapper >
            <FormContainer >
                <Logo className='w-48 mb-10 md:mb-16' />
                <Title > 시작하기 </Title>
                <SubTitle> 이메일과 비밀번호, 사용자 역할을 입력해주세요. </SubTitle>
                <Form onSubmit={handleSubmit(onSubmit)} >
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
                    <StyledInput 
                        {...register('password_confirm', {
                            required: 'Confirm Password is required',
                            validate: value => value === getValues('password') || '비밀번호가 일치하지 않습니다.'
                        })}
                        type='password'
                        placeholder='Confirm Password' 
                        isDirty={ false }
                    />
                    <StyledSelect {...register('role')} >
                        { Object.keys(UserRole).map( 
                            (role, idx) => <option key={idx} > {role} </option> 
                        ) }
                    </StyledSelect>
                    { touchedFields.email && errors.email?.type === 'pattern' && <ErrMsg > 이메일 양식에 맞지 않습니다. </ErrMsg> }
                    { errors.email?.message && <ErrMsg > {errors.email.message} </ErrMsg> }
                    { errors.password?.message && <ErrMsg > {errors.password.message} </ErrMsg> }
                    { errors.password_confirm?.message && <ErrMsg > {errors.password_confirm.message} </ErrMsg> }
                    <StyledButton isVaild={isValid} >
                        { loading ? 'loading...' : 'Create Account' }
                    </StyledButton>
                    { createAccountMutationResult?.createUser.error && <ErrMsg > {createAccountMutationResult?.createUser.error} </ErrMsg> }
                </Form>
                <span> 
                    Already use Nuber? &nbsp;
                    <NuberLink to='/' >Sign in</NuberLink> 
                </span>
            </FormContainer>
        </PageWrapper>
    )
}

export default CreateAccount;