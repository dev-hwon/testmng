import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';

import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";
import CommonKey from "../../common/CommonKey";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  const onClickSetting = () => {
    if (user) {
      const partCode = user.partcode;
      if (partCode.includes('102205312')) {
        router.push("/setting/menu");
      } else {
        router.push(CommonKey.PERMISSION_DENIED);
      }
    }
  }

  return (
    <React.Fragment>
      <Tooltip title="메뉴관리">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={onClickSetting}
          color="inherit"
          size="large"
        >
          <SettingsRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="로그아웃">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <PowerSettingsNewRoundedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
