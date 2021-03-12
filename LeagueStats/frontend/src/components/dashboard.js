import React, {Component, Fragment} from 'react'
import clsx from 'clsx'
import {withStyles} from "@material-ui/core/styles";
import {Typography, Box, PropTypes, Container} from "@material-ui/core";
import {Grid} from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from "../axiosApi";
import VS from './dashboard_components/vs'
import ApexChart from "./dashboard_components/chart/apexchart";
import MapPlot from "./dashboard_components/mapplot";
import Upload from "./upload";
import Ranking from "./dashboard_components/ranking"


const styles = theme => ({
    root: {
        display: 'flex',
    },
    full_width: {
        width: '100%',
    },
    full_height: {
        height: '100%'
    },
    padded: {
        padding: 4,
    },
    games_row: {
        width: '100%',
    },
    graph_row: {
        width: '100%',
        minHeight: 750,
        height: window.innerHeight - 577
    },
    map_row: {
        width: '100%',
    },
    teams: {
        flexGrow: 20
    },
    arrows: {
        flexGrow: 1
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match_ids: [],
            match_cache: {},
            match: {},
            match_loaded: false,
            index: 0,
            change_match: false,
        }
    }

    async componentDidMount() {
        try {
            const match_ids_response = await axiosInstance.get('/riotapi/matches/get/')

            if (match_ids_response.data.match_ids.length == 0) {
                this.setState({
                    errors: 'You havent uploaded any matches jet.'
                })
                return
            } else {
                this.setState({
                    match_ids: match_ids_response.data.match_ids,
                })
                this.loadMatch(this.state.index)
            }

        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.change_match == true) {
            this.setState({change_match: false})
        }
    }

    async loadMatch(index) {
        const match_id = this.state.match_ids[index]
        const cached_match = this.state.match_cache[match_id]

        if (cached_match != undefined) {
            this.setState({
                match: cached_match,
                match_loaded: true,
            })
        } else {
            try {
                const match_response = await axiosInstance.get('/riotapi/match/get/' + match_id)

                const teams = JSON.parse(match_response.data.match.teams)
                delete match_response.data.match.participants
                const match = {
                    networklogs: JSON.parse(match_response.data.networklogs),
                    frames: JSON.parse(match_response.data.frames),
                    events: JSON.parse(match_response.data.events),
                    game_info: match_response.data.match,
                    teams: teams,
                }
                this.setState(prevstate => {
                    prevstate.match = match
                    prevstate.match_cache[match_id] = match
                    prevstate.match_loaded = true
                    return prevstate
                })

            } catch (error) {
                console.log(error)
            }
        }
    }

    changeMatch(direction) {
        let index = this.state.index
        let start_index = index

        index = direction == 'next' ? index + 1 : index - 1
        if (index < 0) {
            index = 0
        } else if (index >= this.state.match_ids.length) {
            index = this.state.match_ids.length - 1
        }
        if (start_index != index) {
            this.loadMatch(index)
            this.setState({
                change_match: true,
                index: index
            })
        }
    }


    renderGamesRow() {
        const classes = this.props.classes

        return (
            <Grid container className={clsx(classes.container, classes.full_width)}>
                <Grid item className={clsx(classes.padded, classes.arrows)}>
                    <StyledItemBox>
                        <FontAwesomeIcon icon={faChevronLeft} size={'4x'} onClick={() => this.changeMatch('next')}/>
                    </StyledItemBox>
                </Grid>
                <Grid item className={clsx(classes.padded, classes.teams)}>
                    <StyledItemBox>
                        {this.state.match.teams &&
                        <VS teams={this.state.match.teams} time={this.state.match.game_info.game_start}/>
                        }
                    </StyledItemBox>
                </Grid>
                <Grid item className={clsx(classes.padded, classes.arrows)}>
                    <StyledItemBox>
                        <FontAwesomeIcon icon={faChevronRight} size={'4x'}
                                         onClick={() => this.changeMatch('previous')}/>
                    </StyledItemBox>
                </Grid>
            </Grid>

        )
    }

    renderGraphRow() {
        const classes = this.props.classes

        return (
            <Grid item xs={'auto'} className={clsx(classes.graph_row, classes.padded)}>
                <StyledItemBox>
                    <ApexChart data={this.state.match} new_data={this.state.change_match}/>
                </StyledItemBox>
            </Grid>
        )
    }

    renderAvgRow() {
        const classes = this.props.classes
        if (this.state.match.networklogs != undefined) {
            let {
                avg_ping,
                min_ping,
                max_ping,
                avg_jitter,
                avg_loss,
                avg_up,
                avg_down
            } = Dashboard.calcNetstats(this.state.match.networklogs)

            return (
                <Grid container>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={{name: 'avg_ping', value: avg_ping, unit: 'ms'}}/>
                        </StyledItemBox>
                    </Grid>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={{name: 'avg_up', value: avg_up, unit: 'kB/s'}}/>
                        </StyledItemBox>
                    </Grid>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={{name: 'avg_down', value: avg_down, unit: 'kB/s'}}/>
                        </StyledItemBox>
                    </Grid>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={{name: 'avg_jitter', value: avg_jitter, unit: 'ms'}}/>
                        </StyledItemBox>
                    </Grid>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={{name: 'avg_loss', value: avg_loss, unit: 'packages'}}/>
                        </StyledItemBox>
                    </Grid>
                    <Grid item xs={2} className={clsx(classes.padded, classes.averages)}>
                        <StyledItemBox>
                            <StyledInfoBox data={[{name: 'min_ping', value: min_ping, unit: 'ms'}, {
                                name: 'max_ping',
                                value: max_ping,
                                unit: 'ms'
                            }]}/>
                        </StyledItemBox>
                    </Grid>
                </Grid>
            )
        }


    }

    renderMapRow() {
        const classes = this.props.classes

        return (
            <Grid container className={clsx(classes.container, classes.map_row)}>
                <Grid item sm={12} md className={clsx(classes.padded)}>
                    <StyledItemBox>
                        <Ranking match={this.state.match.game_info} teams={this.state.match.teams}/>
                    </StyledItemBox>
                </Grid>
                <Grid item className={clsx(classes.padded)}>
                    <StyledItemBox>
                        <MapPlot events={this.state.match.events} new_data={this.state.change_match}/>
                    </StyledItemBox>
                </Grid>

            </Grid>
        )
    }

    render() {
        const classes = this.props.classes

        return (
            <Fragment>
                {this.renderGamesRow()}
                {this.renderGraphRow()}
                {this.renderAvgRow()}
                {this.renderMapRow()}
            </Fragment>
        )
    }

    static calcNetstats(networklogs) {
        let stats = {
            avg_ping: 0,
            min_ping: 0,
            max_ping: 0,
            avg_jitter: 0,
            avg_loss: 0,
            avg_up: 0,
            avg_down: 0,
        }
        networklogs.forEach(log => {
            stats.avg_ping += log.ping
            stats.min_ping = log.ping < stats.min_ping ? log.ping : stats.min_ping
            stats.max_ping = log.ping > stats.max_ping ? log.ping : stats.max_ping
            stats.avg_jitter += log.jitter
            stats.avg_loss += log.loss
            stats.avg_up += log.out_bandwidth
            stats.avg_down += log.in_bandwidth
        })
        const length = networklogs.length
        stats.avg_ping /= length
        stats.avg_jitter /= length
        stats.avg_loss /= length
        stats.avg_up /= length
        stats.avg_down /= length

        return stats
    }
}

export default withStyles(styles)(Dashboard)


const ItemBoxStyles = (theme) => ({
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
        borderRadius: '5px',
        height: '100%'
    },
    centerContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

function ItemBox(props) {
    const {classes} = props;

    return (
        <Box className={clsx(classes.border, classes.centerContent)}>
            {props.children && props.children}
        </Box>)
}

const StyledItemBox = withStyles(ItemBoxStyles)(ItemBox)


const InfoBoxStyles = (theme) => ({
    full_width: {
        width: '100%',
    },
    padded: {
        paddingLeft: 8
    }
})

function Infobox(props) {
    const {classes} = props

    if (props.data.length) {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}
                 className={classes.full_width}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-around'}
                     className={classes.full_width}>
                    <Typography variant={'h6'}>{props.data[0].name}</Typography>
                    <Typography>{Math.round(props.data[0].value * 100) / 100} {props.data[0].unit}</Typography>
                </Box>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-around'}
                     className={classes.full_width}>
                    <Typography align={"left"} variant={'h6'}>{props.data[1].name}</Typography>
                    <Typography>{Math.round(props.data[1].value * 100) / 100} {props.data[1].unit}</Typography>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}
                 className={clsx(classes.full_width, classes.padded)}>
                <Typography className={classes.full_width} variant={'h5'}>{props.data.name}</Typography>
                <Typography>{Math.round(props.data.value * 100) / 100} {props.data.unit}</Typography>
            </Box>
        )
    }
}

const StyledInfoBox = withStyles(InfoBoxStyles)(Infobox)
