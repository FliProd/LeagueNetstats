import React, {Component, Fragment} from "react"
import {Grid, Typography} from "@material-ui/core"
import Box from '@material-ui/core/Box'
import {withStyles} from "@material-ui/core/styles"
import {Image} from "react-bootstrap"
import clsx from "clsx"

const styles = theme => ({
    full_width: {
        width: '100%',
    },
    full_height: {
        height: '100%',
    },
    row: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    team: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    icon: {
        paddingLeft: 10,
    },
    fieldbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    titlebox: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    }
})

class Ranking extends Component {
    constructor(props) {
        super(props)

    }

    renderParticipant(particpant, unitrow) {
        const classes = this.props.classes
        const icon_url = particpant.profile_icon_id != '' ? 'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + particpant.profile_icon_id + '.png' : ''

        return (
            <Grid container className={clsx(classes.full_width, classes.padded)} key={particpant.name}>
                <Grid container item xs={4}>
                    <Grid item xs={3} key={'icon'} className={classes.icon}>
                        {!unitrow &&
                        <Image width={"30px"} src={icon_url} rounded/>
                        }
                    </Grid>
                    <Grid item xs={9} key={'name'} className={classes.field}>
                        <Box className={classes.titlebox}>
                            <Typography variant={'body2'}>{particpant.name}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={8}>
                    <Grid item xs={3} key={'gold_earned'} className={classes.field}>
                        <Box className={classes.fieldbox}>
                            <Typography variant={'body2'}>{particpant.gold_earned}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} key={'total_dmg'} className={classes.field}>
                        <Box className={classes.fieldbox}>
                            <Typography variant={'body2'} align={'center'}>{particpant.total_dmg}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} key={'total_damage_taken'} className={classes.field}>
                        <Box className={classes.fieldbox}>
                            <Typography variant={'body2'} align={'center'}>{particpant.total_damage_taken}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1} key={'assists'} className={classes.field}>
                        <Box className={classes.fieldbox}>
                            <Typography variant={'body2'} align={'center'}>{particpant.assists}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1} key={'kills'} className={classes.field}>
                        <Box className={classes.fieldbox}>
                            <Typography variant={'body2'} align={'center'}>{particpant.kills}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1} key={'deaths'} className={classes.field}>
                        <Box className={classes.fieldbox}>

                            <Typography variant={'body2'} align={'center'}>{particpant.deaths}</Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Grid>
        )
    }


    render() {
        const classes = this.props.classes
        const units = [this.renderParticipant({
            name: 'NAME',
            role: 'ROLE',
            gold_earned: 'GOLD',
            assists: 'A',
            kills: 'K',
            total_dmg: 'DMG',
            deaths: 'D',
            total_damage_taken: 'DMG TAKEN',
        }, true)]

        let winner = units
        let loser = units
        if (this.props.teams != undefined) {
            winner = winner.concat(this.props.teams.winner.map(participant => this.renderParticipant(participant, false)))
            loser = loser.concat(this.props.teams.loser.map(participant => this.renderParticipant(participant, false)))
        }


        return (

            <Box display={'flex'} flexDirection={'column'} className={classes.full_width} pb={1}>
                <Box flexGrow={6} className={classes.full_width} key={'winner'}>
                    <Typography variant={'h5'} align={'center'}>Winner</Typography>
                    {winner}
                </Box>
                <Box flexGrow={6} className={classes.full_width} key={'loser'}>
                    <Typography variant={'h5'} align={'center'}>Loser</Typography>
                    {loser}
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(Ranking)
