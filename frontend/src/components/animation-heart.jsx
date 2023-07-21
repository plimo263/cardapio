import React from "react";
import dataLottie from "../lotties/curtida.json";
import Lottie from "react-lottie";
import { useTheme } from "@mui/material";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: dataLottie,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AnimationHeart() {
  const isMobile = useTheme()?.isMobile;
  //
  return (
    <Lottie
      options={defaultOptions}
      height={isMobile ? 300 : 600}
      width={isMobile ? 300 : 600}
    />
  );
}

export default AnimationHeart;
