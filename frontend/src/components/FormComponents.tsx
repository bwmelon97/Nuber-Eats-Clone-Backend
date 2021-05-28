import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";


export const PageWrapper = tw.div`h-screen flex justify-center bg-white`;
export const FormContainer = tw.div`mt-8 md:mt-24 px-5 w-full max-w-xl flex flex-col items-center`;

export const Title = tw.h1`self-start text-2xl font-normal mb-8 md:text-3xl`
export const SubTitle = tw.h2`self-start text-base font-light mb-4`
export const Form = tw.form`grid gap-3 w-full mb-4`;
export const ErrMsg = tw.span`font-light text-red-500`;
export const NuberLink = tw(Link)`text-lime-600 hover:underline`


/* */
const baseBoxStyle = `
    py-3 px-4 
    focus:outline-none 
    transition
    duration-300
`

const inputStyle = `
    ${baseBoxStyle}
    ring-1 ring-gray-200

    focus:ring-1 
    focus:ring-black 
`

type InputProps = {
    isDirty: boolean;
}
export const StyledInput = styled.input<InputProps>`
    ${tw`${inputStyle}`}

    ${props => props.isDirty && tw`
        ring-black
    `}
`

/*  */
const buttonStyle = `
    ${baseBoxStyle}

    mt-3
    bg-lime-600 
    text-white 
    hover:bg-lime-700
`

type ButtonProps = {
    isVaild: boolean;
}
export const StyledButton = styled.button<ButtonProps>`
    ${tw`${buttonStyle}`}

    ${props => !props.isVaild && tw`
        bg-gray-300
        pointer-events-none
    `}
`