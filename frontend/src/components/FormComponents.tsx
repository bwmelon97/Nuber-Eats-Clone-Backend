import tw, { styled } from "twin.macro";


const baseStyle = `
    py-3 px-4 
    focus:outline-none 
    transition
    duration-300
`

const inputStyle = `
    ${baseStyle}
    ring-1 ring-gray-200

    focus:ring-1 
    focus:ring-black 
`

const buttonStyle = `
    ${baseStyle}

    mt-3
    bg-lime-600 
    text-white 
    hover:bg-lime-700
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