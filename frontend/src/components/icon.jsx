import * as MuiIcons from "@mui/icons-material";
import React from "react";

export default function Icon(props) {
  const Icon = MuiIcons[props.icon];
  if (!Icon) return <p>None</p>;

  return React.createElement(Icon, { ...props });
}
