import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {Image} from "react-bootstrap";
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
    LinearProgress,
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


    renderSummoner(summoner, index, marked) {
        let style;
        if (marked) {
            style = {'backgroundColor': "#919191"};
        }
        return (
            <ListItem style={style} key={summoner.region} button onClick={() => this.props.onChooseSummoner(index)}>
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

        let list = this.props.possible_accounts.map((summoner, index) => {
            return this.renderSummoner(summoner, index, (index == this.props.marked));
        });

        if (this.props.loading) {
            list = (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <CircularProgress style={{"color": "black"}}/>
                </Box>
            )
        }

        return (
            <Fragment>
                <Box textAlign={"center"}>
                    <Typography>Mark your Profile</Typography>
                </Box>
                <List style={this.style}>
                    {list}
                </List>
            </Fragment>
        );
    }
}

export default SummonerList;

