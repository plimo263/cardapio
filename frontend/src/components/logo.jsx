import React from "react";
import logoImg from "../images/logo.png";
import logoImg2 from "../images/logo2.png";

function Logo({ isMini, isLogo2 }) {
  return (
    <img
      src={isLogo2 ? logoImg2 : logoImg}
      style={{ height: isMini ? "36px" : "auto" }}
      alt="Logo Applicacao"
    />
  );
}

export default Logo;
