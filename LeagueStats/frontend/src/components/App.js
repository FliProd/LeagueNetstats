import React, {Component} from "react"
import {Switch, Route} from "react-router-dom"
import {ThemeProvider, createMuiTheme, withStyles, responsiveFontSizes} from '@material-ui/core/styles';
import {Container} from "react-bootstrap"
import Login from "./login"
import Logout from "./logout"
import Signup from "./signup"
import Home from "./home"
import Account from "./account"
import MenuDrawer from "./menudrawer";
import {axiosInstance} from "../axiosApi";
import Dashboard from "./dashboard";

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
});
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
            }
        }
    }

    componentDidMount() {
        if(window.location.pathname != '/login/') {
            this.getAccount()
        }
    }

    async getAccount() {
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
            }
        })
    }

    render() {
        return (
            <div className={"site"}>
                <ThemeProvider theme={theme}>
                    <MenuDrawer profile={this.state.profile}/>
                    <main className={this.props.classes.container}>
                        <Switch>
                            <Route exact path={"/login/"} component={Login}/>
                            <Route exact path={"/logout/"} component={Logout}/>
                            <Route exact path={"/signup/"} component={Signup}/>
                            <Route exact path={"/account/"} component={Account}/>
                            <Route path={"/dashboard"} render={() => <Dashboard profile={this.state.profile}/>}/>
                            <Route path={"/"} render={() => <Dashboard profile={this.state.profile}/>}/>
                        </Switch>
                    </main>
                </ThemeProvider>
            </div>)
    }
}

export default withStyles(styles)(App)
