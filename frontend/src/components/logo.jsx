import React from "react";

const logoImg = "/static/logo.png";
const logoImg2 = "/static/logo2.png";

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
