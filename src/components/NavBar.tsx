import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { setFlagsFromString } from 'v8';
import { LoginContext } from './LoginContext';
import { requestPath } from "../utils";
import Register from './Register';


interface MenuOption_t {
  name: string;
  link: string;
}


interface Menu_t {
    buttonName: string;
    options: Array<MenuOption_t>;
}


function BasicMenu(props: Menu_t) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx = {{color: "white"}}
        >
          {props.buttonName}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
            {props.options.map((menuOption, key) => (
              <MenuItem onClick={handleClose}>
                <Link to={menuOption.link} style = {{color: "black", textDecoration: "none"}}>
                  {menuOption.name}
                </Link>
              </MenuItem>
            ))}
        </Menu>
      </div>
    );
  }

const pages = new Map<string, Array<MenuOption_t>>();
pages.set('Cards', [{name: 'Card search', link: '/cardSearch'}]);
pages.set('Decks', [{name: 'Deck search', link: '/deckSearch'}, {name: 'My decks', link: '/userDecks'}, {name: 'Tournaments Archetypes', link: '/tournamentArchetypes'}]);

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { setLogin } = useContext(LoginContext);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToLogin = () => {
    handleCloseUserMenu();
    navigate("../login");
  };

  const handleToRegister = () => {
    handleCloseUserMenu();
    navigate("../register");
  };

  const handleLogout = async () => {
    handleCloseUserMenu();

    const logoutRequest = await fetch(`${requestPath}/auth/logout/`, {
      method: 'POST',
      headers: {
          'Authorization': 'Token ' + localStorage.getItem("token")
      }
    });

    if (!logoutRequest.ok) {
      return;
    }

    localStorage.removeItem("token");
    setLogin(false);
  }

  const { login } = useContext(LoginContext);

  return (
    <AppBar position="static" sx = {{width: "100%", marginTop: -3}}>
      <Container sx = {{minWidth: "100%"}}>
        <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/mtg-deck-builder/#/"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              StackOverdraw
            </Typography>

          
          <Box sx={{flexGrow: 1, display: "flex"}}>
            {Array.from(pages, ([name, value]) => ({ name, value })).map((elem, key) =>
                <BasicMenu key = {key} buttonName = {elem.name} options = {elem.value}/>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {login
              ?
                <MenuItem key="logout" onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              :
                <div>
                <MenuItem key="login" onClick={handleToLogin}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
                <MenuItem key="register" onClick={handleToRegister}>
                  <Typography textAlign="center">Register</Typography>
                </MenuItem>
                </div>
              
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;