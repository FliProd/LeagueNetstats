import React, {Component} from "react"
import {Switch, Route} from "react-router-dom"
import {ThemeProvider} from '@material-ui/core/styles';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Login from "./user/login"
import Logout from "./user/logout"
import Signup from "./user/signup"
import Account from "./user/account"
import MenuDrawer from "./menudrawer";
import {axiosInstance} from "../axiosApi";
import Dashboard from "./dashboard";
import Feedback from "./feedback";
import Home from "./home";
import Matches from "./matches";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";

let theme = createMuiTheme({
    palette: {
        background: {
            default: '#14253D',
            paper: '#14253D',
        },
        text: {
            primary: '#EBE0CB',
            secondary: '#B6893A',
        },
        primary: {
            main: '#EBE0CB',
        },
        secondary: {
            main: '#B6893A',
        },
        action: {
            active: '#EBE0CB',
        }
    },
    border: {
        color: '#B6893A',
        width: 1,
    }
})
theme = responsiveFontSizes(theme);


const styles = theme => ({
    container: {
        paddingLeft: 60,
    }
})

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {
                user: {
                    username: '',
                    email: ''
                },
                game_info: {
                    puuid: '',
                    game_region: '',
                    icon_id: '',
                    level: '',
                },
                location: {
                    country: '',
                    state: '',
                    city: '',
                    zipcode: '',
                },
            },
            logged_in: false
        }
    }

    componentDidMount() {
        this.getAccount()
    }

    async getAccount() {
        if (this.loggedIn()) {
            const response = await axiosInstance.get('/api/profile/get/');
            this.setState({
                profile: {
                    user: {
                        username: response.data.user.username,
                        email: response.data.user.email,
                    },
                    game_info: {
                        puuid: response.data.puuid,
                        game_region: response.data.game_region,
                        icon_id: response.data.icon_id,
                        level: response.data.level,
                    },
                    location: {
                        country: response.data.country,
                        state: response.data.state,
                        city: response.data.city,
                        zipcode: response.data.zipcode,
                    },
                },
            })
        }
    }

    loggedIn() {
        if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) {
            return false
        } else {
            return true
        }
    }

    render() {
        const classes = this.props.classes

        const logged_in = this.loggedIn()

        let home
        if (logged_in) {
            home = <Route path={"/"} render={() => <Dashboard profile={this.state.profile}/>}/>
        } else {
            home = <Route path={"/"} component={Home}/>
        }


        return (
            <div className={"site"}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {logged_in &&
                    <MenuDrawer profile={this.state.profile} logged_in={logged_in}/>
                    }
                    <main className={clsx({[classes.container]: logged_in})}>
                        <Switch>
                            <Route exact path={"/login/"} render={() => <Login/>}/>
                            <Route exact path={"/logout/"} render={() => <Logout/>}/>
                            <Route exact path={"/signup/"} component={Signup}/>
                            <Route exact path={"/account/"} component={Account}/>
                            <Route exact path={"/feedback/"} component={Feedback}/>
                            <Route exact path={"/matches/"} render={() => <Matches profile={this.state.profile}/>}/>
                            <Route path={"/dashboard"} render={({location, history}) => {
                                let match_id = location.search.match(/\d{9}/)
                                match_id = match_id && match_id.length > 0 ? match_id[0] : undefined
                                return <Dashboard match_id={match_id} profile={this.state.profile}/>
                            }}/>
                            {home}
                        </Switch>
                    </main>
                </ThemeProvider>
            </div>)
    }
}

export default withStyles(styles)(App)
