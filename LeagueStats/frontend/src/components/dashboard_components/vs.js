import React, {Component, Fragment} from "react";
import {Grid, Typography} from "@material-ui/core";
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
    },
    [theme.breakpoints.up('lg')]: {
        participant: {},
        text_short: {
            display: 'none'
        },
        text_long: {
            display: 'block'
        },
        participant_icon: {
            width: '60px'
        }
    },
    [theme.breakpoints.up('md')]: {
        participant: {},
        text_short: {
            display: 'block'
        },
        text_long: {
            display: 'none'
        },
        participant_icon: {
            width: '60px'
        }
    },
    [theme.breakpoints.down('sm')]: {
        participant: {},
        text_short: {
            display: 'block'
        },
        text_long: {
            display: 'none'
        },
        participant_icon: {
            width: '50px'
        }
    },
    [theme.breakpoints.down('xs')]: {
        participant: {},
        participant_icon: {
            width: '40px'
        },
    },
})

class VS extends Component {
    constructor(props) {
        super(props);
        this.renderParticipant = this.renderParticipant.bind(this)
    }


    renderParticipant(participant) {
        const classes = this.props.classes
        const url = 'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + participant.profile_icon_id + '.png'
        return (
            <Grid item container xs={1} key={participant.name} display={'flex'} alignItems={"center"}
                  justify={"center"} className={classes.participant}>
                <Grid item>
                    <Image className={classes.participant_icon} src={url} roundedCircle/>
                </Grid>
            </Grid>
        )
    }


    render() {
        const classes = this.props.classes

        const winner = this.props.teams.winner.map(participant => this.renderParticipant(participant))
        const loser = this.props.teams.loser.map(participant => this.renderParticipant(participant))

        const date = new Date(this.props.time * 1000)
        const datestring = date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear()

        return (
            <Grid container className={classes.full_height}>
                {winner}
                <Grid item xs={2} key={'vs'}>
                    <Box display={"flex"} flexDirection={'column'} justifyContent={"center"} alignItems={"center"}
                         className={classes.full_height}>
                        <Typography variant="h5" >{datestring}</Typography>
                        <Typography variant="h6">VS</Typography>
                    </Box>
                </Grid>
                {loser}
            </Grid>
        )
    }
}

export default withStyles(styles)(VS)

