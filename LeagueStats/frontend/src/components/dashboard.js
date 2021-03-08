import React, {Component, Fragment} from 'react'
import clsx from 'clsx'
import {withStyles} from "@material-ui/core/styles";
import {Typography, Box, PropTypes, Container} from "@material-ui/core";
import {Grid} from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from "../axiosApi";
import VS from './dashboard_components/vs'
import ApexChart from "./apexchart";
import MapPlot from "./mapplot";
import Upload from "./upload";


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
    container: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    padded: {
        padding: 4,
    },
    games_row: {
        width: '100%',
    },
    graph_row: {
        width: '100%',
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
    graph: {
        flexGrow: 10,
    },
    averages: {
        flexGrow: 3,
    }
})

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match_ids: [],
            match: {},
            match_loaded: false,
            index: 0,
            change_match: false,
        }
    }

    async componentDidMount() {
        try {
            const match_ids_response = await axiosInstance.get('riotapi/matches/get/')

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
        console.log('dashboard updated')
        if(prevState.change_match == true) {
            this.setState({change_match: false})
        }
    }

    async loadMatch(index) {
        try {
            const match_response = await axiosInstance.get('riotapi/match/get/' + this.state.match_ids[index])

            const teams = JSON.parse(match_response.data.match.teams)
            delete match_response.data.match.participants
            this.setState({
                match: {
                    networklogs: JSON.parse(match_response.data.networklogs),
                    frames: JSON.parse(match_response.data.frames),
                    events: JSON.parse(match_response.data.events),
                    game_info: match_response.data.match,
                    teams: teams,
                },
                match_loaded: true,
            })
        } catch (error) {
            console.log(error)
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
                        <FontAwesomeIcon icon={faChevronLeft} size="5x" onClick={() => this.changeMatch('next')}/>
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
                        <FontAwesomeIcon icon={faChevronRight} size="5x" onClick={() => this.changeMatch('previous')}/>
                    </StyledItemBox>
                </Grid>
            </Grid>

        )
    }

    renderGraphRow() {
        const classes = this.props.classes

        return (
            <Grid container className={clsx(classes.container, classes.graph_row)}>
                <Grid item md={10} className={clsx(classes.padded, classes.graph)}>
                    <StyledItemBox>
                        <ApexChart data={this.state.match} new_data={this.state.change_match}/>
                    </StyledItemBox>
                </Grid>
                <Grid item md={2} className={clsx(classes.padded, classes.averages)}>
                    <StyledItemBox>
                        <Typography> hi</Typography>
                    </StyledItemBox>
                </Grid>
            </Grid>
        )
    }

    renderMapRow() {
        const classes = this.props.classes

        return (
            <Grid container className={clsx(classes.container, classes.map_row)}>
                <Grid item md={4} className={clsx(classes.padded)}>
                    <StyledItemBox>
                        <MapPlot events={this.state.match.events}/>
                    </StyledItemBox>
                </Grid>
                <Grid item md={8} className={clsx(classes.padded)}>
                    <StyledItemBox>
                        <Upload />
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
                {this.renderMapRow()}
            </Fragment>
        )
    }
}

export default withStyles(styles)(Dashboard)


const ItemBoxStyles = (theme) => ({
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
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