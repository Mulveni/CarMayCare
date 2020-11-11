import React, { useState } from 'react';
import { IconButton, Grid, makeStyles, AppBar, Toolbar, Button, Drawer, List, ListItem, MenuItem, Menu } from '@material-ui/core';
import { AccountBox, Close, DriveEta } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;
const useStyles = makeStyles({
    menuItem: {
        fontSize: 20,
        borderRadius: "0%",
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    menuHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    }
});

const Navigation = () => {
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(null);

    const classes = useStyles();

    const handleLeftMenuOpening = () => {
        console.log("left_menu");
        if (leftMenuOpen === true) {
            setLeftMenuOpen(false);
        } else {
            setLeftMenuOpen(true);
        }
    }

    const handleRightMenuOpening = (event) => {
        console.log("right_menu");
        setRightMenuOpen(event.currentTarget);
    }

    const handleClose = (e) => {
        console.log(e.target.id);
        setRightMenuOpen(null);
    };
    return (
        <div>
            <AppBar position="static" style={{ background: "blue" }}>
                <Toolbar>
                    <Grid item>
                        <IconButton onClick={handleLeftMenuOpening}>
                            <MenuIcon />
                        </IconButton>
                    </Grid>

                    <Grid item md={1}>

                    </Grid>
                    <Grid container justify={"center"}>
                        <div>
                            <h1>APP_NAME</h1>

                            <h2>HEADER</h2>
                        </div>

                    </Grid>
                    <Grid item>
                        <Button size="small">fi</Button>
                    </Grid>
                    <Grid item>
                        <Button size="small">en</Button>
                    </Grid>
                    <Grid item md={1}>

                    </Grid>
                    <Grid item>
                        <IconButton>
                            <AccountBox onClick={handleRightMenuOpening} />
                        </IconButton>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Drawer
                id="left-menu"
                className={classes.drawer}
                anchor="left"
                open={leftMenuOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.menuHeader}>
                    <IconButton>
                        <Close onClick={handleLeftMenuOpening} />
                    </IconButton>
                </div>

                <List>
                    <ListItem button>
                        <IconButton className={classes.menuItem} disableRipple={true}>
                            <DriveEta />
                            OWN_CARS
                        </IconButton>
                    </ListItem>
                </List>
            </Drawer>

            <Menu
                id="right-menu"
                anchorEl={rightMenuOpen}
                keepMounted
                open={Boolean(rightMenuOpen)}
                onClose={handleClose}
            >
                <MenuItem id="profile" onClick={(e) => handleClose(e)}>Profile</MenuItem>
                <MenuItem id="settings" onClick={(e) => handleClose(e)}>Settings</MenuItem>
                <MenuItem id="logout" onClick={(e) => handleClose(e)}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default Navigation;