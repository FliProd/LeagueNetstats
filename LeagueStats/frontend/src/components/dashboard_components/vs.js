import React, {Component, Fragment} from "react";
import { Grid, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import {withStyles} from "@material-ui/core/styles";
import {Image} from "react-bootstrap";
import clsx from "clsx";


const styles = theme => ({
    full_width: {
        width: '100%',
    },
    full_height: {
        height: 70
    },
    container: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
    }
})

class VS extends Component {
    constructor(props) {
        super(props);
        this.renderParticipant = this.renderParticipant.bind(this)
    }

    static renderProfileIcon(icon_id) {
        const url = 'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + icon_id + '.png'
        return <Image width={"40px"} src={url}/>
    }

    renderParticipant(participant) {
        return (
            <Grid item lg={1} key={participant.name}>
                <Box flexDirection={"column"} display={"flex"} justify="center" alignItems="center" pt={1}>
                    {VS.renderProfileIcon(participant.profile_icon_id)}
                    <Typography variant="body2">{participant.name}</Typography>
                </Box>
            </Grid>
        )
    }


    render() {
        const classes = this.props.classes

        const winner = this.props.teams.winner.map(participant => this.renderParticipant(participant))
        const loser = this.props.teams.loser.map(participant => this.renderParticipant(participant))

        const date = new Date(this.props.time * 1000)
        const datestring = date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getUTCMinutes()


        return (
            <Grid container className={classes.full_height}>
                {winner}
                <Grid item lg={2} key={'vs'} >
                    <Box display={"flex"} flexDirection={'column'} justifyContent={"center"} alignItems={"center"}
                         className={classes.full_height}>
                        <Typography variant="h5">{datestring}</Typography>
                        <Typography variant="h6">VS</Typography>
                    </Box>
                </Grid>
                {loser}
            </Grid>
        )
    }
}

export default withStyles(styles)(VS)

