import React, {Component, Fragment} from "react"
import {axiosInstance} from "../../axiosApi"
import {Alert, Form} from "react-bootstrap"
import {Grid, Paper, Box, Button} from '@material-ui/core'
import {StatusCodes} from 'http-status-codes'
import SummonerList from "./summoner"
import {withStyles} from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
        borderRadius: '5px',
        height: '100%',
    },
})


class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                username: "",
                password: "",
                email: "",
            },
            account: {},
            typing_timeout: '',
            loading_summoner: false,
            loading_location: false,
            location: {
                city: "",
                state: "",
                country: "",
                zipcode: 0,
            },
        }
        this.summonerListElement = React.createRef()

        this.handleLocation = this.handleLocation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getLocation = this.getLocation.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setSummoner = this.setSummoner.bind(this)
        this.renderForm = this.renderForm.bind(this)
    }

    handleChange(event) {
        this.setState(prevstate => {
            return prevstate.user[event.target.name] = event.target.value
        })

        if (event.target.name == 'username') {
            if (this.state.typing_timeout) {
                clearTimeout(this.state.typing_timeout)
            }
            this.setState({
                typing_timeout: setTimeout(() => {
                    this.summonerListElement.current.getSummonerInfo(event.target.value)
                }, 2000),
            })
        }

    }

    setSummoner(summoner) {
        this.setState({account: summoner})
    }

    async handleLocation(latitude, longitude) {
        try {
            const response = await axiosInstance.post('/geo/discreteLocation/', {
                location: {
                    latitude: latitude,
                    longitude: longitude,
                }
            })
            this.setState({
                loading_location: false,
                location: {
                    city: response.data.city,
                    country: response.data.country,
                    state: response.data.state,
                    zipcode: response.data.zipcode,
                }
            })
        } catch (error) {
            this.setState({
                loading_location: false,
                errors: {location: "Something went wrong while handling your Location."},
            })
        }
    }

    getLocation(event) {
        if (event.target.checked) {
            this.setState({loading_location: true})
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.handleLocation(position.coords.latitude, position.coords.longitude)
                    },
                    (error) => {
                        this.setState({
                            errors: {location: error.message},
                        })
                        //console.log(error)
                    }
                )
            } else {
                this.setState({
                    errors: {location: "Your Location cant be accessed. Try giving the right permission to your Browser."},
                })
            }
        } else {
            this.setState({
                location: {
                    city: "",
                    state: "",
                    country: "",
                    zipcode: "",
                }
            })
        }
    }

    async handleSubmit(event) {
        event.preventDefault()

        if (this.state.location.country == "") {
            this.setState({
                errors: {location: 'Your Location cant be loaded. Make sure your Browser and Operating System have allowed Location access for this site.'},
            })
            return
        }

        if (this.state.account.puuid == undefined) {
            this.setState({
                errors: {account: "Give a valid Summonername and choose a Summoner."},
            })
            return
        }

        const account = this.state.account

        axiosInstance.post('/api/profile/create/', {
            user: {
                username: this.state.user.username,
                email: this.state.user.email,
                password: this.state.user.password,
            },

            puuid: account.puuid,
            account_id: account.account_id,
            game_region: account.region,
            level: account.level,
            icon_id: account.icon_id,
            city: this.state.location.city,
            state: this.state.location.state,
            country: this.state.location.country,
            zipcode: this.state.location.zipcode,
        }).then((response) => {
            if (response.status != StatusCodes.BAD_REQUEST) {
                axiosInstance.post('/api/token/obtain/', {
                    email: this.state.user.email,
                    password: this.state.user.password
                }).then(response => {
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access
                    localStorage.setItem('access_token', response.data.access)
                    localStorage.setItem('refresh_token', response.data.refresh)
                    window.location.href = '/'
                }).catch(error => {
                    window.location.href = '/'
                })
            } else {
                return response
            }
        }).catch(error => {
            this.setState({errors: error.response.data})
        })
    }

    renderForm() {
        return (
            <Fragment>
                <h2>SignUp</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Summoner Name</Form.Label>
                        <Form.Control name="username" type="text" value={this.state.user.username}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.username) &&
                    <Alert variant={"danger"}>{this.state.errors.user.username}</Alert>
                    }
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="text" value={this.state.user.email}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.email) &&
                    <Alert variant={"danger"}>{this.state.errors.user.email}</Alert>
                    }
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" value={this.state.user.password}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.password) &&
                    <Alert variant={"danger"}>{this.state.errors.user.password}</Alert>
                    }
                    <Form.Group controlId="formBasicCheckbox">
                        <Grid container direction={'row'}>
                            <Grid item>
                                    {this.state.loading_location &&
                                    <Box mr={1}>
                                        <CircularProgress style={{"color": "white"}} size={25}/>
                                    </Box>
                                    }
                            </Grid>
                            <Grid item>
                                  <Form.Check className={"padding"} type="checkbox" label="Allow my location to be saved."
                                        onChange={(event) => {
                                            this.getLocation(event)}} />
                            </Grid>
                        </Grid>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.location) &&
                    <Alert variant={"danger"}>{this.state.errors.location}</Alert>
                    }
                    <Button variant={'contained'} type={'Submit'}>
                        Submit
                    </Button>
                </Form>
            </Fragment>
        )
    }

    render() {
        const classes = this.props.classes

        const Form = this.renderForm()

        return (
            <Grid className={"signup-grid"} container direction="row" alignItems="center" justify="center">
                <Grid item xs={6}>
                    <Box p={2}>
                        {Form}
                    </Box>
                </Grid>
                <Grid item xs={6} className={classes.border}>
                    <SummonerList
                        ref={this.summonerListElement}
                        setSummoner={(summoner) => this.setSummoner(summoner)}
                        askname={false}
                        name={this.state.username}
                        loading={this.state.loading_summoner}
                    />
                    {(this.state.errors && this.state.errors.account) &&
                    <Alert variant={"danger"}>{this.state.errors.account}</Alert>
                    }
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Signup)

