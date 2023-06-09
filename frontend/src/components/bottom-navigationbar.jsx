import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import React from "react";
import Icon from "./icon";

function BottomNavigationBar({ menus, selectedMenu, onChange }) {
  return (
    <BottomNavigation
      value={selectedMenu}
      onChange={(e, val) => onChange(val)}
      showLabels
      sx={{ width: "100%", position: "fixed", bottom: 0 }}
    >
      {menus?.map((ele, idx) => (
        <BottomNavigationAction
          key={idx}
          label={ele[1]}
          icon={<Icon icon={ele[0]} />}
        />
      ))}
    </BottomNavigation>
  );
}

export default BottomNavigationBar;
