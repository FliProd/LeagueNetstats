import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {Alert, Button, Form} from "react-bootstrap";
import {Grid, Paper, Box} from '@material-ui/core';
import {StatusCodes} from 'http-status-codes';
import SummonerList from "./summoner";


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: "",
                password: "",
                email: "",
            },
            possible_accounts: [{
                'name': 'Summonername',
                'puuid': '',
                'icon_id': 29,
                'level': '1',
                'region': 'Region'
            }],
            account: -1,
            location: {
                city: "",
                state: "",
                country: "",
                zipcode: "",
            },

            location_msg: "",
            typing_timeout: 0,
            loading: false,
        };

        this.translateLocation = this.translateLocation.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSummonerInfo = this.getSummonerInfo.bind(this);
        this.handleChooseSummoner = this.handleChooseSummoner.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    handleChange(event) {
        this.setState(prevstate => {
            return prevstate.user[event.target.name] = event.target.value;
        });

        if (event.target.name == 'username') {
            if (this.state.typing_timeout) {
                clearTimeout(this.state.typing_timeout);
            }
            this.setState(prevstate => {
                prevstate.user[event.target.name] = event.target.value;
                prevstate.typing_timeout = setTimeout(this.getSummonerInfo, 2000);
                return prevstate;
            });
        }

    }

    async getSummonerInfo() {
        try {
            this.setState({loading: true});
            const response = await axiosInstance.get('/riotapi/summoner/'.concat(this.state.user.username))
            this.setState({
                possible_accounts: response.data.possible_accounts,
                loading: false,
            });
        } catch (error) {
            this.setState({
                errors: error.response.data,
            });
        }
    }

    handleChooseSummoner(index) {
        if(this.state.account == index) {
            this.setState({account: -1});
        } else {
            this.setState({account: index});
        }
    }

    async translateLocation(latitude, longitude) {
        try {
            const response = await axiosInstance.post('/geo/discreteLocation/', {
                location: {
                    latitude: latitude,
                    longitude: longitude,
                }
            });
            this.setState({
                location: {
                    city: response.data.city,
                    country: response.data.country,
                    state: response.data.state,
                    zipcode: response.data.zipcode,
                }
            })
        } catch (error) {
            this.setState({
                errors: error.response.data,
            });
        }
    }

    handleLocation(event) {
        if (event.target.checked) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.translateLocation(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        this.setState({
                            location_msg: error.message
                        });
                    }
                );
            } else {
                this.setState({
                    location_msg: "We cant access your location. Try giving the right permission to your Browser",
                });
            }
        } else {
            this.setState({
                location: {
                    city: "",
                    state: "",
                    country: "",
                    zipcode: "",
                }
            });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        try {

            if(this.state.account == -1 || this.state.possible_accounts[0].name == "Summonername") {
                throw TypeError;
            }
            const account = this.state.possible_accounts[this.state.account];

            const response = await axiosInstance.post('/api/profile/create/', {
                user: {
                    username: this.state.user.username,
                    email: this.state.user.email,
                    password: this.state.user.password,
                },
                puuid: account.puuid,
                game_region: account.region,
                level: account.level,
                icon_id: account.icon_id,
                city: this.state.location.city,
                state: this.state.location.state,
                country: this.state.location.country,
                zipcode: this.state.location.zipcode,
            });

            if (response.status != StatusCodes.BAD_REQUEST) {
                const response = await axiosInstance.post('/api/token/obtain/', {
                    username: this.state.user.username,
                    password: this.state.user.password
                });
                axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                window.location.href = '/';
            } else {
                return response;
            }
        } catch (error) {
            if (error == TypeError) {
                if (this.state.possible_accounts.length > 1 || this.state.possible_accounts[0].name != "Summonername") {
                    this.setState({
                        errors: {account: "Choose your Summoner from the List."},
                    });
                } else {
                    this.setState({
                        errors: {account: "Enter a valid Summoner name."},
                    });
                }
            } else {
                this.setState({
                    errors: error.response.data,
                });
            }
        }
    }

    renderForm() {
        return (
            <Fragment>
                <h2>SignUp</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Summoner Name</Form.Label>
                        <Form.Control name="username" type="text" value={this.state.user.username}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.username) &&
                        <Alert variant={"danger"}>{this.state.errors.user.username}</Alert>
                    }
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="text" value={this.state.user.email}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.email) &&
                        <Alert variant={"danger"}>{this.state.errors.user.email}</Alert>
                    }
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" value={this.state.user.password}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.user && this.state.errors.user.password) &&
                        <Alert variant={"danger"}>{this.state.errors.user.password}</Alert>
                    }
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check className={"padding"} type="checkbox" label="Allow my location to be saved."
                                    onChange={this.handleLocation}/>
                    </Form.Group>
                    {(this.state.errors && this.state.errors.location) &&
                        <Alert variant={"danger"}>{this.state.location_msg}</Alert>
                    }
                    <Button variant={'dark'} type={'Submit'}>
                        Submit
                    </Button>
                </Form>
            </Fragment>
        );
    }

    render() {
        const Form = this.renderForm();
        return (
            <Grid className={"signup-grid"} container spacing={5} direction="row" alignItems="center" justify="center">
                <Grid item md={6}>
                    <Paper variant="outlined">
                        <Box p={2}>
                            {Form}
                        </Box>

                    </Paper>
                </Grid>
                <Grid item md={6}>
                    <Paper variant="outlined">
                        <SummonerList
                            possible_accounts={this.state.possible_accounts}
                            onChooseSummoner={(i) => this.handleChooseSummoner(i)}
                            loading={this.state.loading}
                            marked={this.state.account}
                        />
                        {(this.state.errors && this.state.errors.account) &&
                            <Alert variant={"danger"}>{this.state.errors.account}</Alert>
                        }
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default Signup;

