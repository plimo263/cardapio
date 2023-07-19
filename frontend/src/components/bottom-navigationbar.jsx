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
          label={ele.descricao}
          icon={<Icon icon={ele.icone} />}
        />
      ))}
    </BottomNavigation>
  );
}

export default BottomNavigationBar;
