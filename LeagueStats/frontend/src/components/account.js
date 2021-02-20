import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {Alert, Image} from "react-bootstrap";
import {
    Paper,
    Box,
    Grid,
    Typography,
    TextField,
    IconButton,
    Button,
    Popover,
    CircularProgress
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles} from '@material-ui/core/styles';
import SummonerList from "./summoner";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                email: '',
            },
            game_info: {
                puuid: '',
                game_region: '',
                icon_id: '29',
                level: '',
            },
            location: {
                country: '',
                state: '',
                city: '',
                zipcode: '',
            },
            edited: {},
            loading: false,
            anchorEl: null
        };

        this.summonerListElement = React.createRef();

        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.setAncholEl = this.setAncholEl.bind(this);

    }

    getUserId() {
        const refreshToken = localStorage.getItem('refresh_token');
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        return tokenParts.user_id;
    }


    setSummoner(summoner) {
        this.setState(prevstate => {
            prevstate.game_info.level = summoner.level;
            prevstate.game_info.game_region = summoner.region;
            prevstate.game_info.icon_id = summoner.icon_id;
            prevstate.game_info.puuid = summoner.puuid;
            prevstate.game_info.account_id = summoner.account_id;
            prevstate.user.username = summoner.name;
            return prevstate;
        });
        console.log(this.state);
    }

    async componentDidMount() {
        const response = await axiosInstance.get('/api/profile/get/' + this.getUserId());
        this.setState({
            user: response.data.user,
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
        })
    }

    async handleLocation(latitude, longitude) {
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
                location_msg: "Something went wrong while handling your Location.",
            });
        }
    }

    getLocation(event) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.handleLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    this.setState({
                        location_msg: error.message
                    });
                }
            );
        } else {
            this.setState({
                location_msg: "We cant access your location. Try giving the right permission to your Browser.",
            });
        }

    }

    handleEdit(name) {
        this.setState(prevstate => {
            prevstate.edited[name] = true;
            return prevstate;
        });
    }

    renderButton(name, onClickFunction) {
        const isDisabled = this.state.edited[name] ? true : false;

        return (
            <IconButton name={name} disabled={isDisabled} onClick={onClickFunction}>
                <EditIcon/>
            </IconButton>
        )
    }

    handleChange(event) {
        this.setState(prevstate => {
            return prevstate.user[event.target.name] = event.target.value;
        });
    }


    async handleSubmit(key) {
        const user = this.state.user;
        const game_info = this.state.game_info;
        const location = this.state.location;

        try {
            console.log(game_info)
            const response = await axiosInstance.put('/api/profile/get/' + this.getUserId(), {
                user: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                },
                puuid: game_info.puuid,
                account_id: game_info.account_id,
                game_region: game_info.game_region,
                level: game_info.level,
                icon_id: game_info.icon_id,
                city: location.city,
                state: location.state,
                country: location.country,
                zipcode: location.zipcode,
            });
        } catch (error) {
            this.setState({
                errors: error.response.data,
            });
        }
    }

    renderSummoner() {
        return (
            <Fragment>
                <Grid container spacing={2} direction={"row"} display={"flex"} justify={"center"}
                      alignItems={"center"}>
                    <Grid item md={2}>
                        <Image style={{"width": "130px"}}
                               src={'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + this.state.game_info.icon_id + '.png'}
                               roundedCircle/>
                    </Grid>
                    <Grid item md={9}>
                        <Typography
                            variant={"h3"}>{this.state.user.username + ' - ' + this.state.game_info.level}</Typography>
                        <Typography variant={"h5"}>{this.state.game_info.game_region}</Typography>
                    </Grid>
                    <Grid item md={1}>
                        <IconButton onClick={(event) => this.setState({anchorEl: event.currentTarget,})}>
                            <EditIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }

    setAncholEl(value) {
        this.setState({
            anchorEl: value,
        })
    }

    renderBackdrop() {
        const handleClose = () => {
            this.setState({anchorEl: null});
        };
        const anchorEl = this.state.anchorEl;
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'choose-summoner' : undefined;
        return (
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box p={2}>
                    <SummonerList
                        ref={this.summonerListElement}
                        setSummoner={(summoner) => this.setSummoner(summoner)}
                        askname={true}
                        loading={false}
                    />
                </Box>
            </Popover>
        );
    }

    renderUser() {
        return (
            <Fragment>
                <Grid container direction={"row"}>
                    <Grid item md={2}>
                        <Typography variant={"h5"}>User</Typography>
                    </Grid>
                    <Grid item md={10}>
                        <Grid container direction={"row"}>
                            <Grid item md={11}>
                                {this.state.edited["email"] && (
                                     <TextField size={"small"} label={"Email"} name={"email"}
                                           variant="outlined" value={this.state.user.email}
                                           fullWidth onChange={this.handleChange}
                                           disabled={!this.state.edited["email"]}/>
                                )}
                                {!this.state.edited["email"] && (
                                    <Typography>{this.state.user.email}</Typography>
                                )}
                                {(this.state.errors && this.state.errors.user && this.state.errors.user.email) &&
                                <Alert variant={"danger"}>{this.state.errors.user.email}</Alert>
                                }
                            </Grid>
                            <Grid item md={1}>
                                {this.renderButton("email", () => this.handleEdit("email"))}

                            </Grid>
                        </Grid>
                        <Grid container direction={"row"}>
                            <Grid item md={11}>
                                {this.state.edited["password"] && (
                                     <TextField size={"small"} type={"password"}
                                           name={"password"}
                                           label={"Password"} variant="outlined"
                                           value={this.state.user.username}
                                           fullWidth
                                           onChange={this.handleChange}
                                           disabled={!this.state.edited["password"]}/>
                                )}
                                {!this.state.edited["password"] && (
                                    <Typography>*********</Typography>
                                )}
                                {(this.state.errors && this.state.errors.user && this.state.errors.user.password) &&
                                <Alert variant={"danger"}>{this.state.errors.user.password}</Alert>
                                }
                            </Grid>
                            <Grid item md={1}>
                                {this.renderButton("password", () => this.handleEdit("password"))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }

    renderLocation() {
        return (
            <Fragment>
                <Grid container direction={"row"}>
                    <Grid item md={2}>
                        <Typography variant={"h5"}>Location</Typography>
                    </Grid>
                    <Grid item md={5}>
                        <Typography>{this.state.location.country}</Typography>
                        <Typography>{this.state.location.state}</Typography>
                        <Typography>{this.state.location.city}</Typography>
                        <Typography>{this.state.location.zipcode}</Typography>
                    </Grid>
                    <Button onClick={this.getLocation} variant={"contained"}> Reload Location </Button>
                    {(this.state.errors && this.state.errors.location) &&
                    <Alert variant={"danger"}>{this.state.location_msg}</Alert>}
                </Grid>
            </Fragment>
        )
    }


    render() {
        return (
            <Fragment>
                <Box style={{"height": "100%"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Paper style={{"width": "80%"}} variant="outlined">
                        <Box display={"flex"} p={3}>
                            <Grid container spacing={4} alignItems="center" justify="center">
                                <Grid item my={3} md={12}>
                                    {this.renderSummoner()}
                                </Grid>
                                <Grid item my={3} md={12}>
                                    {this.renderUser()}
                                </Grid>
                                <Grid item my={3} md={12}>
                                    {this.renderLocation()}
                                </Grid>
                                <Grid item my={3}>
                                    <Button variant={"contained"} type={"Submit"} onClick={this.handleSubmit}>
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
                {this.renderBackdrop()}
            </Fragment>
        )
    }
}

export default Account;


