import React from "react";
import { LOGO_IMG_URL } from "@constants";

type LogoProps = {
    className: string;
}
const Logo = ({className}: LogoProps) => <img src={LOGO_IMG_URL} alt='logo' className={className} />

export default Logo