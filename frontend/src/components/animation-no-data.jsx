import React from "react";
import dataLottie from "../lotties/sem-dados-encontrados.json";
import Lottie from "react-lottie";
import { Stack, Typography, useTheme } from "@mui/material";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: dataLottie,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AnimationNoData({ title }) {
  const isMobile = useTheme()?.isMobile;
  //
  return (
    <Stack>
      <Lottie
        options={defaultOptions}
        height={isMobile ? 200 : 400}
        width={isMobile ? 200 : 400}
      />
      <Typography align="center" sx={{ fontFamily: "Caveat" }} variant="h4">
        {title}
      </Typography>
    </Stack>
  );
}

export default AnimationNoData;
