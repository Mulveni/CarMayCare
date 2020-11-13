import React, { useState } from 'react';
import { IconButton, Grid, makeStyles, AppBar, Toolbar, Button, Drawer, List, ListItem, MenuItem, Menu } from '@material-ui/core';
import { AccountBox, Close, DriveEta } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const drawerWidth = 240;
const useStyles = makeStyles({
    header: {
        background: "blue",
        position: "static"
    },
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

    const { t } = useTranslation();
    const classes = useStyles();
    const navButtons = useSelector(state => state.navButtonsReducer);

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
        console.log(e.target.id);
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
                        <IconButton disabled={navButtons.disabled} onClick={handleLeftMenuOpening}>
                            <MenuIcon visibility={navButtons.visibility} />
                        </IconButton>
                    </Grid>

                    <Grid container item md={2} />
                    <Grid item md={1} />

                    <Grid container justify={"center"}>
                        <div>
                            <h1>{t('app_name')}</h1>

                            <h2>{t('header')}</h2>
                        </div>
                    </Grid>

                    <Grid container item md={2}>
                        <Grid item>
                            <Button size="small" onClick={() => changeLanguage('fi')}>fi</Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" onClick={() => changeLanguage('en')}>en</Button>
                        </Grid>
                    </Grid>
                    <Grid item md={1} />

                    <Grid item>
                        <IconButton disabled={navButtons.disabled} onClick={handleRightMenuOpening}>
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
                    <IconButton onClick={handleLeftMenuOpening}>
                        <Close />
                    </IconButton>
                </div>

                <List>
                    <ListItem button>
                        <IconButton className={classes.menuItem} disableRipple={true}>
                            <DriveEta />
                            {t('menu_own_cars')}
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
                <MenuItem id="profile" onClick={(e) => handleClose(e)}>{t('profile')}</MenuItem>
                <MenuItem id="settings" onClick={(e) => handleClose(e)}>{t('settings')}</MenuItem>
                <MenuItem id="logout" onClick={(e) => handleClose(e)}>{t('logout')}</MenuItem>
            </Menu>
        </div>
    )
}

export default Navigation;