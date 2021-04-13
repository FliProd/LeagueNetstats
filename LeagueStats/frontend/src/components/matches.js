import React, {Component} from "react"
import {axiosInstance} from "../axiosApi"
import {Image} from "react-bootstrap"
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import {withStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import {withTranslation} from "react-i18next";
import {JungleLane, TopLane, BottomLane, MidLane, Damage, Gold, Timer} from "./svg-icons";


const styles = theme => ({
    full_width: {
        width: '100%',
    },
    full_height: {
        height: '100%',
    },
    champion_icon: {
        width: 80,
    },
    participant_icon: {
        width: 20,
        marginRight: 5,
    },
    participant_text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 90,
        minWidth: 1,
    },
    match: {
        width: '100%',
        padding: 5,
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderRadius: 5,
        borderStyle: 'solid',
    },
    match_item: {
        height: '100%',
    },
    won: {
        background: 'linear-gradient(90deg, rgba(151,48,247,1) 0%, rgba(64,129,138,1) 0%, rgba(41,102,101,1) 12%, rgba(20,37,61,1) 36%)'
    },
    lost: {
        background: 'linear-gradient(90deg, rgba(151,48,247,1) 0%, rgba(82,58,120,1) 0%, rgba(41,45,102,1) 11%, rgba(20,37,61,1) 34%)'
    },
    match_container: {
        width: '100%',
        padding: 5,
    },
    starttime: {
        height: '66.66%',
    },
    time: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    grow: {
        transition:' all .2s ease-in-out' ,
        '&:hover': {
            transform: 'scale(1.001)'
        }
    }
})


class Matches extends Component {
    constructor(props) {
        super(props)
        this.state = {
            matches: [],
            start: 0,
            search_text: '',
            champion_stats: {},
            loaded_all: false,
        }
        this.loadMatches = this.loadMatches.bind(this)
        this.showMatchInDashboard = this.showMatchInDashboard.bind(this)

    }

    componentDidMount() {
        this.loadMatches()
        axiosInstance.get('/static/data/champion_id.json')
            .then(response => {
                this.setState({
                    champion_stats: response.data
                })
            }).catch(error => console.log(error))
    }

    loadMatches() {
        axiosInstance.get('/riotapi/matchlist/get/' + this.state.start)
            .then(response => {
                if (response.data.matches.length == 0) {
                    this.setState({
                        error: 'You havent uploaded any matches yet.'
                    })
                    return
                } else {
                    const processed_matches = response.data.matches.map(match => {
                        const teams = JSON.parse(match.teams)
                        delete match.teams
                        return {
                            match: match,
                            teams: teams,
                        }
                    })
                    this.setState(prevstate => {
                        prevstate.matches = prevstate.matches.concat(processed_matches)
                        prevstate.start = prevstate.start + 10
                        prevstate.loaded_all = processed_matches.length < 10 || prevstate.loaded_all
                    })
                    this.forceUpdate()
                }
            }).catch(error =>  console.log(error))
    }


    handleChange(event) {
        this.setState(prevstate => {
            return prevstate.user[event.target.name] = event.target.value
        })
    }

    playerIsWinner(teams) {
        const summoner_name = this.props.profile.user && this.props.profile.user.username
        let winner = false
        teams['winner'].forEach(participant => {
            if (participant.name == summoner_name) {
                winner = true
            }
        })
        return winner
    }

    renderParticipant(participant) {
        const classes = this.props.classes
        const url = '/static/img/profileicon/' + participant.profile_icon_id + '.png'

        return (
            <Grid item container direction={'row'} key={participant.name} className={classes.full_width} wrap={'nowrap'}>
                <Grid item>
                    <Image className={classes.participant_icon} src={url} rounded/>
                </Grid>
                <Grid item>
                    <Typography variant={"body2"} className={classes.participant_text}>{participant.name}</Typography>
                </Grid>
            </Grid>
        )

    }

    renderTeams(teams) {
        const classes = this.props.classes
        let winners = teams['winner'].map(participant => this.renderParticipant(participant))
        let losers = teams['loser'].map(participant => this.renderParticipant(participant))

        const player_is_winner = this.playerIsWinner(teams)

        let rendered_teams
        if (player_is_winner) {
            rendered_teams = [winners, losers]
        } else {
            rendered_teams = [losers, winners]
        }

        return {
            won: player_is_winner, teams: (
                <Grid container key={'teams'} direction={'row'} alignItems={"center"} justify={"center"} spacing={5}>
                    <Grid xs={6} item key={'winner'}>
                        <Grid container direction={'column'} alignItems={"center"} justify={"center"}
                              className={clsx(classes.full_width)}>
                            {rendered_teams[0]}
                        </Grid>
                    </Grid>
                    <Grid xs={6} item key={'loser'}>
                        <Grid container direction={'column'} alignItems={"center"} justify={"center"}
                              className={clsx(classes.full_width)}>
                            {rendered_teams[1]}
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
    }

    showMatchInDashboard(match_id) {
        window.location.href = '/dashboard/?match_id=' + match_id
    }

    //champion, k/d/a, gold, damg
    renderPlayer(teams) {
        const {t, classes} = this.props

        const summoner_name = this.props.profile.user && this.props.profile.user.username
        let totalkills = 0
        let player_info
        teams['winner'].forEach(participant => {
            if (summoner_name == participant.name) {
                player_info = participant
            }
            totalkills += participant.kills
        })
        teams['loser'].forEach(participant => {
            if (summoner_name == participant.name) {
                player_info = participant
            }
            totalkills += participant.kills
        })

        const champion_url = player_info && '/static/img/champion/' + player_info.champion + '.png'
        const champion_stats = player_info && this.state.champion_stats[player_info.champion]

        const lane_icon = player_info ? Matches.lane_icon(player_info['lane']) : false

        return (
            <Grid container key={'player'} direction={"row"} alignItems={"center"} justify={"center"}>
                <Grid xs={4} item container justify={"flex-start"} alignItems={'center'} spacing={1} wrap={"nowrap"}>
                    <Grid item>
                        {player_info &&
                        <Image className={classes.champion_icon} src={champion_url} rounded/>
                        }
                    </Grid>
                    <Grid xs item container direction={'column'} justify={"flex-start"} alignItems={'center'}>
                        <Grid item className={classes.full_width}>
                            <Typography variant={'body1'} align={"left"}>{champion_stats && champion_stats['name']}</Typography>
                        </Grid>
                        <Grid item className={classes.full_width}>
                            {lane_icon}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={4} item direction={'column'} container justify={"center"} alignItems={'center'}>
                    <Grid xs item>
                        {player_info &&
                        <Typography variant={'h5'}>{player_info.kills}/{player_info.deaths}/{player_info.assists}</Typography>
                        }
                    </Grid>
                    <Grid xs item>
                        {player_info &&
                        <Typography
                            variant={'body1'}>KP {Math.round(((player_info.kills + player_info.assists) / totalkills) * 100)}%</Typography>
                        }
                    </Grid>
                </Grid>
                <Grid xs={4} item container direction={'column'}>
                    <Grid item container direction={'row'} key={'gold'}>
                        <Grid xs={3} item container justify={'flex-end'}>
                            <Gold size={"md"}/>
                        </Grid>
                        <Grid xs={3} item>
                        <Typography variant={'body1'}>{player_info && player_info.gold_earned}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container direction={'row'} key={'dmg'}>
                        <Grid xs={3} item container justify={'flex-end'}>
                            <Damage size={"md"}/>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography variant={'body1'}>{player_info && player_info.total_dmg}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    renderMatch(match) {
        const classes = this.props.classes

        const {teams, won} = match['teams'] && this.renderTeams(match['teams'])
        const playerstats = this.renderPlayer(match['teams'])
        match = match['match']


        const date = new Date(match.game_start * 1000)
        const datestring = Matches.formatTime(date, 'date')

        const duration = new Date(match.game_duration * 1000)
        const duration_string = Matches.formatTime(duration, 'duration')


        return (
            <Grid className={clsx(classes.match_container, classes.grow)} item key={match.match_id}>
                <Grid container direction={'row'} justify={"center"} alignItems={'center'}
                      className={clsx(classes.match, {[classes.won]: won}, {[classes.lost]: !won})}
                      onClick={() => this.showMatchInDashboard(match.match_id)}>
                     <Grid xs={7} item>
                        {playerstats}
                    </Grid>
                    <Grid xs={3} item key={'participants'}>
                        {teams}
                    </Grid>
                    <Grid xs={2} item key={'datetime'} className={clsx(classes.match_item, classes.time)}>
                        <Grid container direction={"column"} justify={'center'}>
                            <Grid item container direction={'row'} key={'duration'}>
                                <Grid xs={5} item container display={'flex'} key={'logo'} justify={'flex-end'} alignItems={'center'}>
                                    <Timer size={'md'}/>
                                </Grid>
                                <Grid xs={7} item container display={'flex'} key={'duration_typo'} justify={'flex-start'}>
                                    <Typography variant={'h5'} align={'center'}>{duration_string}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item key={'date'}>
                                <Typography variant={'body1'} align={'center'}>{datestring}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }


    render() {
        const {classes, t} = this.props

        const matches = this.state.matches.map(match => this.renderMatch(match))

        return (
            <Grid container direction={'column'} justify={"center"} alignItems={'center'}
                  className={classes.full_width}>
                {matches}
                {!this.state.loaded_all &&
                    <Grid item key={'load_more'}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Button onClick={this.loadMatches} variant={"contained"}>
                                {t('matches.load_more')}
                            </Button>
                        </Box>
                    </Grid>
                }
            </Grid>
        )
    }

    static lane_icon(lane) {
        switch (lane) {
            case 'MID_LANE':
            case 'MIDDLE':
                return <MidLane size={'xs'} />
            case 'TOP_LANE':
            case 'TOP':
                return <TopLane  size={'xs'} />
            case 'JUNGLE':
            case 'JUNGLE_LANE':
                return <JungleLane size={'xs'} />
            case 'BOT':
            case 'BOTTOM':
            case 'BOTTOM_LANE':
                return <BottomLane size={'xs'} />
            default:
                return false
        }
    }


    static formatTime(date, type) {
        if (type == 'duration') {
            let minutes = date.getMinutes()
            let seconds = date.getSeconds()
            minutes = minutes >= 10 ? minutes : '0' + minutes
            seconds = seconds >= 10 ? seconds : '0' + seconds
            return minutes + ':' + seconds
        } else if (type == 'date') {
            return date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear()
        } else if (type == 'time') {
            return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        }
    }
}

export default withStyles(styles)(withTranslation()(Matches))

