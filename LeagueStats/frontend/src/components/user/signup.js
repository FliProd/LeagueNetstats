import React, {Component, Fragment} from "react"
import {axiosInstance} from "../../axiosApi"
import {Alert, Form} from "react-bootstrap"
import {Grid, Paper, Box, Button} from '@material-ui/core'
import {StatusCodes} from 'http-status-codes'
import SummonerList from "./summoner"
import {withStyles} from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress";
import {withTranslation} from "react-i18next";

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
                city: 'none',
                state: 'none',
                country: 'none',
                zipcode: 0,
            },
            gdpr_consent: false,
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
        const {t} = this.props
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
                errors: {location: t('signup.location_problem')},
            })
        }
    }

    getLocation(event) {
        const {t} = this.props
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
                    errors: {location: t('signup.location_no_access')},
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
        const {t} = this.props

        /*if (this.state.location.country == "") {
            this.setState({
                errors: {location: 'Your Location cant be loaded. Make sure your Browser and Operating System have allowed Location access for this site.'},
            })
            return
        }*/

        if(this.state.gdpr_consent == false) {
            this.setState({
                errors: {gdpr: t("signup.cookies_problem")},
            })
            return
        }

        if (this.state.account.puuid == undefined) {
            this.setState({
                errors: {account: t("signup.no_summoner_chosen")},
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
        const {t} = this.props
        return (
            <Fragment>
                <h2>SignUp</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>{t('signup.summoner_name')}</Form.Label>
                        <Form.Control name="username" type="text" value={this.state.user.username}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.username) &&
                    <Alert variant={"danger"}>{this.state.errors.user.username}</Alert>
                    }
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control name="email" type="text" value={this.state.user.email}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.email) &&
                    <Alert variant={"danger"}>{this.state.errors.user.email}</Alert>
                    }
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
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
                                  <Form.Check className={"padding"} type="checkbox" label={t("signup.allow_location")}
                                        onChange={(event) => {
                                            this.setState(event)}} />
                            </Grid>
                        </Grid>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.location) &&
                    <Alert variant={"danger"}>{this.state.errors.location}</Alert>
                    }
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check className={"padding"} type="checkbox" label={t("signup.allow_cookies")}
                                        onChange={(event) => {
                                            this.setState({gdpr_consent: event.target.value})}} />
                    </Form.Group>
                    {(this.state.errors && this.state.errors.gdpr) &&
                    <Alert variant={"danger"}>{this.state.errors.gdpr}</Alert>
                    }
                    <Button variant={'contained'} type={'Submit'}>
                        {t('signup.submit')}
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

export default withTranslation()(withStyles(styles)(Signup))
