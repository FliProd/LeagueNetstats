import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {Alert, Image} from "react-bootstrap";
import {StatusCodes} from 'http-status-codes';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Box,
    Button,
    CircularProgress,
    Typography,
    LinearProgress, TextField,
} from "@material-ui/core";


function Summoner(props) {
    const icon_url = 'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + props.icon_id + '.png';
    return (
        <Fragment>
            <ListItemAvatar>
                <Box pr={1}>
                    <Image width={"60px"} src={icon_url} roundedCircle/>
                </Box>
            </ListItemAvatar>
            <ListItemText primary={props.name + '  -  Level ' + props.level} secondary={props.region}/>
            <Divider/>
        </Fragment>

    );
}

class SummonerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            possible_accounts: [{
                'name': 'Summonername',
                'puuid': '',
                'icon_id': 29,
                'level': '',
                'region': 'Region'
            }],
            account: -1,
            loading: props.loading,
            name: !props.askname && props.name,
            typing_timeout: "",
            askName: props.askname,
        };

        this.handleChange = this.handleChange.bind(this);
        this.getSummonerInfo = this.getSummonerInfo.bind(this);
        this.handleChooseSummoner = this.handleChooseSummoner.bind(this);
        this.handleNoReply = this.handleNoReply.bind(this);
        this.renderSummoner = this.renderSummoner.bind(this);

    }

    handleChange(event) {
        if (this.state.typing_timeout) {
            clearTimeout(this.state.typing_timeout);
        }
        this.setState({
            name: event.target.value,
            typing_timeout: setTimeout(() => this.getSummonerInfo(this.state.name), 1000),
        });
    }

    async getSummonerInfo(name) {
        const timeout = setTimeout(this.handleNoReply, 20000);
        this.setState({loading: true});
        try {
            const response = await axiosInstance.get('/riotapi/summoner/'.concat(name))
            clearTimeout(timeout);
            console.log(response.status)
            console.log('1')
            console.log(response)

            this.setState({
                possible_accounts: response.data.possible_accounts,
                loading: false,
            });
        } catch (error) {
            if (response.status == StatusCodes.NOT_FOUND) {
                this.setState({
                    loading: false,
                    errors: {account: "There exists no Summoner with this Summonername."},
                });
            }
            clearTimeout(timeout);
        }
    }

    handleNoReply() {
        this.setState({
            loading: false,
            errors: {account: "There has been a Problem reaching the League of Legends API."},
        });
    }

    handleChooseSummoner(index) {
        if (this.state.account == index) {
            this.setState({account: -1});
        } else {
            this.setState({account: index});
            this.props.setSummoner(this.state.possible_accounts[index]);
        }
    }

    renderSummoner(summoner, index, marked) {
        let style;
        if (marked) {
            style = {'backgroundColor': "#919191"};
        }
        return (
            <ListItem style={style} key={summoner.region} button onClick={() => this.handleChooseSummoner(index)}>
                <Summoner
                    name={summoner.name}
                    level={summoner.level}
                    region={summoner.region}
                    icon_id={summoner.icon_id}
                />
            </ListItem>
        )
    }

    render() {
        let list = this.state.possible_accounts.map((summoner, index) => {
            return this.renderSummoner(summoner, index, (index == this.state.account));
        });

        if (this.state.loading) {
            list = (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <CircularProgress style={{"color": "black"}}/>
                </Box>
            )
        }

        let userinterface;
        //load textfield for typing name
        if (this.state.askName) {
            userinterface = (
                <Fragment>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}><Typography pb={1}>Find & Mark
                        your Profile</Typography></Box>
                    <TextField size={"small"} label={"Summonername"} variant="outlined"
                               fullWidth name={"name"}
                               onChange={this.handleChange}
                    />
                </Fragment>
            )
        } else {
            userinterface = (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}><Typography pb={1}>Mark your
                    Profile</Typography></Box>)
        }
        return (
            <Fragment>
                <Box>
                    {userinterface}
                </Box>
                <List style={this.style}>
                    {list}
                </List>
                {this.state.errors && this.state.errors.account &&
                <Alert variant={"danger"}>{this.state.errors.account}</Alert>}
            </Fragment>
        );
    }
}

export default SummonerList;

