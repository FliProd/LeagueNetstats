import React, {Component} from 'react'
import clsx from 'clsx'
import {withStyles} from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TrendingUpSharpIcon from '@material-ui/icons/TrendingUpSharp';
import ListAltSharpIcon from '@material-ui/icons/ListAltSharp';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {withRouter} from "react-router";
import {Image} from "react-bootstrap";
import Slide from '@material-ui/core/Slide';
import {useTranslation} from 'react-i18next'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


const drawerWidth = 240

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        borderRightWidth: theme.border.width,
        borderRightColor: theme.border.color,
        borderRightStyle: 'solid',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        height: '100%'
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 60,
        height: '100%'

    },
    menuitem: {
        height: '100%',
        width: '100%',
    }
})

class MenuDrawer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }


    render() {
        const classes = this.props.classes

        const open = this.state.open

        const handleDrawerOpen = () => {
            this.setState({open: this.props.logged_in})
        }

        const handleDrawerClose = () => {
            this.setState({open: false})
        }

        return (
            <div className={classes.root}>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                >
                    <Box height={'33%'}>
                        <MenuProfile profile={this.props.profile} open={open}
                                     className={this.props.classes.menuitem}/>
                    </Box>
                    <Box height={'57%'}>
                        <List>
                            <ListButtonRouter open={open} path={'/dashboard'} name={'menudrawer.dashboard'}
                                              icon={<TrendingUpSharpIcon />}/>
                            <ListButtonRouter open={open} path={'/matches'} name={'menudrawer.matches'}
                                              icon={<ListAltSharpIcon />}/>
                            <ListButtonRouter open={open} path={'/upload'} name={'menudrawer.upload'}
                                              icon={<CloudUploadIcon />}/>
                            <ListButtonRouter open={open} path={'/account'} name={'menudrawer.account'}
                                              icon={<AccountBoxIcon />}/>
                            <ListButtonRouter open={open} path={'/feedback'} name={'menudrawer.feedback'}
                                              icon={<FeedbackIcon />}/>
                        </List>
                    </Box>
                    <Box display={'flex'} alignItems={'flex-end'} height={'10%'}>
                        <List>
                            <ListButtonRouter path={'/logout'} name={'menudrawer.logout'} icon={<ExitToAppIcon/>}/>
                        </List>

                    </Box>
                </Drawer>
            </div>
        )
    }

}

export default withStyles(styles)(MenuDrawer)


function MenuProfile(props) {
    const {t} = useTranslation()

    const icon_url = props.profile.game_info.icon_id != '' ? '/static/img/profileicon/' + props.profile.game_info.icon_id + '.png' : ''
    const summoner_name = props.profile.user.username

    return (

        <Slide direction="right" in={props.open}
               timeout={500}>
            <Box height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"}
                 justifyContent={"center"}>
                <Image width={"150px"} src={icon_url} roundedCircle/>
                <Typography variant={'h5'}>{summoner_name}</Typography>
                <Typography variant={'h6'}>{t('level')} {props.profile.game_info.level}</Typography>
            </Box>
        </Slide>
    )
}

const ListItemTextStyles = (theme) => (
    {
        root: {
            flex: '1 1 auto',
            minWidth: 0,
            marginTop: 1,
            marginBottom: 7,
        },
    }
)


function ListButton(props) {


    const {t} = useTranslation()

    const {classes} = props;

    const onClick = (event) => {
        event.stopPropagation()
        event.preventDefault()
        props.history.push(props.path)
    }

    return (
        <ListItem onClick={onClick} button key={props.name}>
            <Box display={"flex"} justifyContent={"center"}>
                <ListItemIcon>{props.icon}</ListItemIcon>
                <ListItemText className={classes.root}><Typography>{t(props.name)}</Typography></ListItemText>
            </Box>
        </ListItem>
    )
}

const ListButtonRouter = withRouter(withStyles(ListItemTextStyles)(ListButton))