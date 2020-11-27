import React, { useState } from 'react';
import { IconButton, Grid, makeStyles, AppBar, Toolbar, Button, Drawer, List, ListItem, MenuItem, Menu, Typography } from '@material-ui/core';
import { AccountBox, Close, DriveEta } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logOut, removeToken } from '../actions';


const drawerWidth = 240;
const useStyles = makeStyles({
    header: {
        background: "#304269",
        position: "static",
        padding: 20
    },
    menuItem: {
        fontSize: 20,
        borderRadius: "0%",
        "&:hover": {
            backgroundColor: "transparent"
        },
        color: "white"
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
        background: "#304269"
    },
    rightMenu: {
        background: "#304269",
        color: "white"
    },
    icons: {
        color: "white",
        '&:hover': {
            backgroundColor: "#F26101"
        }
    },
    lngButtons: {
        color: "white",
        '&:hover': {
            backgroundColor: "#F26101"
        },
        fontWeight: "bold"
    },
    navLinks: {
        '&:hover': {
            backgroundColor: "#F26101"
        },
        marginRight: 5,
        marginTop: 5
    }
});

const Navigation = () => {
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(null);

    const { t } = useTranslation();
    const classes = useStyles();
    const navButtons = useSelector(state => state.navButtonsReducer);
    const dispatch = useDispatch();

    const handleLeftMenuOpening = () => {
        if (leftMenuOpen === true) {
            setLeftMenuOpen(false);
        } else {
            setLeftMenuOpen(true);
        }
    }

    const handleRightMenuOpening = (event) => {
        setRightMenuOpen(event.currentTarget);
    }

    const handleClose = (e) => {
        if (e.target.id === "logout") {
            dispatch(logOut());
            dispatch(removeToken());
        }
        setRightMenuOpen(null);
    }

    const changeLanguage = (lng) => {
        console.log(lng);
        i18n.changeLanguage(lng);
    }


    return (
        <div>
            <AppBar className={classes.header}>
                <Toolbar>
                    <Grid item>
                        <IconButton className={classes.icons} disabled={navButtons.disabled} onClick={handleLeftMenuOpening}>
                            <MenuIcon visibility={navButtons.visibility} />
                        </IconButton>
                    </Grid>

                    <Grid container item md={2} />
                    <Grid item md={1} />

                    <Grid container justify={"center"}>
                        <div>
                            <Typography variant="h4">
                                {t('app_name')}
                            </Typography>
                            <Typography variant="h5">
                                {t('header')}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid container item md={2}>
                        <Grid item>
                            <Button className={classes.lngButtons} size="small" onClick={() => changeLanguage('fi')}>fi</Button>
                        </Grid>
                        <Grid item>
                            <Button className={classes.lngButtons} size="small" onClick={() => changeLanguage('en')}>en</Button>
                        </Grid>
                    </Grid>
                    <Grid item md={1} />

                    <Grid item>
                        <IconButton className={classes.icons} disabled={navButtons.disabled} onClick={handleRightMenuOpening}>
                            <AccountBox visibility={navButtons.visibility} />
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
                    <IconButton className={classes.navLinks} onClick={handleLeftMenuOpening}>
                        <Close className={classes.menuItem} />
                    </IconButton>
                </div>

                <List>
                    <ListItem button className={classes.navLinks}>
                        <IconButton className={classes.menuItem} disableRipple={true}>
                            <DriveEta />
                            {t('menu_own_cars')}
                        </IconButton>
                    </ListItem>
                </List>
            </Drawer>

            <Menu
                id="right-menu"
                classes={{ paper: classes.rightMenu }}
                anchorEl={rightMenuOpen}
                keepMounted
                open={Boolean(rightMenuOpen)}
                onClose={handleClose}
            >
                <MenuItem className={classes.navLinks} id="profile" onClick={(e) => handleClose(e)}>{t('profile')}</MenuItem>
                <MenuItem className={classes.navLinks} id="settings" onClick={(e) => handleClose(e)}>{t('settings')}</MenuItem>
                <MenuItem className={classes.navLinks} id="logout" onClick={(e) => handleClose(e)}>{t('logout')}</MenuItem>
            </Menu>

        </div>
    )
}

export default Navigation;