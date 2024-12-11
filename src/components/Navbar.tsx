import { Link, useLocation, useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const Navbar = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const signUserOut = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const noNavBar = ['/login'];
    const {pathname} = useLocation();

   if (noNavBar.some((item) => pathname.includes(item))) return null;

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* Home Link */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{ textDecoration: "none", color: "inherit", flexGrow: 1, textAlign: 'left' }}
                >
                    PawBook
                </Typography>

                {/* User Info */}
                {user && (
                    <Box display="flex" alignItems="center" ml={2}>
                        {/* User Avatar */}
                        <Avatar
                            alt={user.displayName || "User"}
                            src={user.photoURL || ""}
                            sx={{ width: 30, height: 30, marginRight: 2, cursor: "pointer" }}
                            onClick={handleAvatarClick}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    signUserOut();
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}