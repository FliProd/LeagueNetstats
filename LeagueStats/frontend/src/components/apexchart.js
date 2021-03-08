import React, {Component, Fragment, isValidElement} from "react"
import Box from "@material-ui/core/Box"
import Chart from "react-apexcharts"
import ApexCharts from 'apexcharts'
import CheckboxList from "./checkbox"
import {Grid, Paper, Typography} from "@material-ui/core"
import {Image} from "react-bootstrap";
import Event from "./event";
import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";


const styles = theme => ({
    full_width: {
        width: '100%',
    },
    full_height: {
        height: '100%'
    },
    verticalCheckboxes: {
        maxWidth: 210
    }
})


class ApexChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded_data: false,
            added_data: false,
            loaded_event: undefined,
            chart_data: {},
            all_events: {
                'CHAMPION_KILL': [],
                'CHAMPION_DEATH': [],
                'WARD_PLACED': [],
                'WARD_KILLED': [],
                'BUILDING_KILL': [],
                'ELITE_MONSTER_KILL': [],
                'ITEM_PURCHASED': [],
                'ITEM_SOLD': [],
                'ITEM_DESTROYED': [],
                'ITEM_UNDO': [],
                'SKILL_LEVEL_UP': [],
                'CAPTURE_POINT': [],
                'PORO_KING_SUMMON': [],
                'ASCENDED_EVENT': [],
            },
            all_annotations: {
                'CHAMPION_KILL': [],
                'CHAMPION_DEATH': [],
                'WARD_PLACED': [],
                'WARD_KILLED': [],
                'BUILDING_KILL': [],
                'ELITE_MONSTER_KILL': [],
                'ITEM_PURCHASED': [],
                'ITEM_SOLD': [],
                'ITEM_DESTROYED': [],
                'ITEM_UNDO': [],
                'SKILL_LEVEL_UP': [],
                'CAPTURE_POINT': [],
                'PORO_KING_SUMMON': [],
                'ASCENDED_EVENT': [],
            },
            all_series: {
                'EXP': {type: 'line', name: 'EXP', data: []},
                'GOLD': {type: 'line', name: 'GOLD', data: []},
                'CREEP': {type: 'line', name: 'CREEP', data: []},
                'NEUTRAL': {type: 'line', name: 'NEUTRAL', data: []},
                'LEVEL': {type: 'line', name: 'LEVEL', data: []},
                'PING': {type: 'line', name: 'PING', data: []},
                'JITTER': {type: 'line', name: 'JITTER', data: []},
                'IN_BANDWIDTH': {type: 'line', name: 'IN_BANDWIDTH', data: []},
                'OUT_BANDWIDTH': {type: 'line', name: 'OUT_BANDWIDTH', data: []},
                'LOSS': {type: 'line', name: 'LOSS', data: []},
            },
            data_shown: {
                'EXP': false,
                'GOLD': false,
                'CREEP': false,
                'NEUTRAL': false,
                'LEVEL': false,
                'PING': true,
                'JITTER': true,
                'IN_BANDWIDTH': false,
                'OUT_BANDWIDTH': false,
                'LOSS': false,
                'CHAMPION_KILL': false,
                'CHAMPION_DEATH': false,
                'WARD_PLACED': false,
                'WARD_KILLED': false,
                'BUILDING_KILL': false,
                'ELITE_MONSTER_KILL': false,
                'ITEM_PURCHASED': false,
                'ITEM_SOLD': false,
                'ITEM_DESTROYED': false,
                'ITEM_UNDO': false,
                'SKILL_LEVEL_UP': false,
                'CAPTURE_POINT': false,
                'PORO_KING_SUMMON': false,
                'ASCENDED_EVENT': false,
            },
            options: ApexChart.setOptions()
        }


        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }
        this.chart = null


        this.handleClick = this.handleClick.bind(this)
        this.prepareChart = this.prepareChart.bind(this)
        this.updateChart = this.updateChart.bind(this)
        this.handleYAxis = this.handleYAxis.bind(this)
        this.setEvent = this.setEvent.bind(this)


    }

    static setOptions() {
        return {
            annotations: {
                xaxis: []
            },
            legend: {
                show: false
            },
            series: [],
            chart: {
                width: '100%',
                height: '100%',
                foreColor: '#EBE0CB',
                background: '#14253D',
                events: {
                    click: (event, chartContext, config) => this.handleClick(event, chartContext, config, this.setEvent)
                },
                toolbar: {
                    show: true,
                    offsetX: -25,
                    offsetY: 0,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: true,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: true | '<img src="/static/icons/reset.png" width="20">',
                        customIcons: []
                    },
                },
                type: 'line',
            },
            markers: {
                size: 0
            },
            tooltip: {
                shared: true,
                x: {
                    show: false,
                },
                y: {
                    formatter: ApexChart.formatTooltip
                }
            },
            xaxis: {
                labels: {
                    formatter: function (value) {
                        return parseInt(value) + ':' + Math.round(((value - parseInt(value)) * 60));
                    },
                    show: true,
                    style: {
                        colors: '#EBE0CB',
                    },
                },
                axisBorder: {
                    show: true,
                    color: '#EBE0CB',
                },
                axisTicks: {
                    show: false,
                },
                tickAmount: 10,
            },
            type: 'numeric',
            yaxis: [],
            grid: {
                show: false,
            },
            animations: {
                enabled: false,
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.loaded_data || props.new_data) {
            console.log('getDerivedStateFromProps')
            let networklogs
            let frames
            let events
            let errors = false
            if (props.data.networklogs != undefined && props.data.frames != undefined && props.data.events != undefined) {
                networklogs = props.data.networklogs
                frames = props.data.frames
                events = props.data.events

                //clear all data for a new match
                for (const [key, value] of Object.entries(state.all_events)) {
                    state.all_events[key] = []
                }
                for (const [key, value] of Object.entries(state.all_annotations)) {
                    state.all_annotations[key] = []
                }
                state.all_series = {
                    'EXP': {type: 'line', name: 'EXP', data: []},
                    'GOLD': {type: 'line', name: 'GOLD', data: []},
                    'CREEP': {type: 'line', name: 'CREEP', data: []},
                    'NEUTRAL': {type: 'line', name: 'NEUTRAL', data: []},
                    'LEVEL': {type: 'line', name: 'LEVEL', data: []},
                    'PING': {type: 'line', name: 'PING', data: []},
                    'JITTER': {type: 'line', name: 'JITTER', data: []},
                    'IN_BANDWIDTH': {type: 'line', name: 'IN_BANDWIDTH', data: []},
                    'OUT_BANDWIDTH': {type: 'line', name: 'OUT_BANDWIDTH', data: []},
                    'LOSS': {type: 'line', name: 'LOSS', data: []}
                }
                state.chart_data = {}

                state.options = ApexChart.setOptions()
                console.log('cleared annotations')
            } else {
                errors = true
            }


            if (networklogs != undefined) {
                networklogs.map(log => {
                    state.all_series['PING'].data.push({'x': ApexChart.translateTime(log.time), 'y': log.ping})
                    state.all_series['JITTER'].data.push({'x': ApexChart.translateTime(log.time), 'y': log.jitter})
                    state.all_series['IN_BANDWIDTH'].data.push({
                        'x': ApexChart.translateTime(log.time),
                        'y': log.in_bandwidth
                    })
                    state.all_series['OUT_BANDWIDTH'].data.push({
                        'x': ApexChart.translateTime(log.time),
                        'y': log.out_bandwidth
                    })
                    state.all_series['LOSS'].data.push({'x': ApexChart.translateTime(log.time), 'y': log.loss})
                })
            } else {
                errors = true
            }

            if (frames != undefined) {
                frames.map(frame => {
                    state.all_series['GOLD'].data.push({
                        'x': ApexChart.translateTime(frame.timestamp),
                        'y': frame.gold
                    })
                    state.all_series['CREEP'].data.push({
                        'x': ApexChart.translateTime(frame.timestamp),
                        'y': frame.creep_score
                    })
                    state.all_series['NEUTRAL'].data.push({
                        'x': ApexChart.translateTime(frame.timestamp),
                        'y': frame.neutral_score
                    })
                    state.all_series['LEVEL'].data.push({
                        'x': ApexChart.translateTime(frame.timestamp),
                        'y': frame.level
                    })
                    state.all_series['EXP'].data.push({
                        'x': ApexChart.translateTime(frame.timestamp),
                        'y': frame.exp
                    })

                })
            } else {
                errors = true
            }

            if (events != undefined) {
                events.map(event => {
                    //uncomment this to load events as series
                    /*state.all_series[event.type].data.push({
                        'x': ApexChart.translateTime(event.timestamp),
                        'y': ApexChart.calculateY(event.type, event.timestamp)
                    })*/
                    state.all_events[event.type].push(event)
                    state.all_annotations[event.type].push(ApexChart.createAnnotation(event))
                })
            } else {
                errors = true
                console.log('errors')
            }

            if (!errors) {
                state.loaded_data = true
            }

            const sort = (arr) => arr.sort((a, b) => parseFloat(a.x) - parseFloat(b.x))
            for (const [key, value] of Object.entries(state.all_series)) {
                sort(value.data)
            }

            return state
        } else {
            console.log('getDerivedStateFromProps state not loaded')
            return null
        }
    }

    /* Activity
    1. loads series according to datashown into chart options
    2. creates chart from options
    3. adds annotations according to datashown
    */
    prepareChart() {
        console.log('prepare chart')
        for (const [type, series] of Object.entries(this.state.all_series)) {
            if (this.state.data_shown[type] && series.data.length > 0 && this.state.chart_data[type] == undefined) {
                this.state.chart_data[type] = true
                this.state.options.series.push(series)
                this.handleYAxis(series, true)
            }
        }

        for (const [type, annotations] of Object.entries(this.state.all_annotations)) {
            if (this.state.data_shown[type] && annotations.length > 0 && this.state.chart_data[type] == undefined) {
                this.state.chart_data[type] = true
                this.state.options.annotations.xaxis = this.state.options.annotations.xaxis.concat(annotations)
            }
        }

        const element = React.createRef ? this.chartRef.current : this.chartRef
        if (this.chart != null) {
            this.chart.updateOptions(this.state.options)
        } else {
            this.chart = new ApexCharts(element, this.state.options)
            this.chart.render()
        }
    }

    //hide and showseries is not working correctly
    /* Activity
    adds/removes an annotation to/from the chart
    or
    adds/removes a series from options (and its axis) and updates the chart
    */
    updateChart(name, add) {
        console.log('update chart')
        if (ApexChart.isAnnotation(name)) {
            if (add) {
                this.state.options.annotations.xaxis = this.state.options.annotations.xaxis.concat(this.state.all_annotations[name])
            } else {
                this.state.options.annotations.xaxis = this.state.options.annotations.xaxis.filter(annotation => annotation.type != name)
            }
        } else {
            if (add) {
                const series = this.state.all_series[name]
                this.state.options.series.push(series)
                this.handleYAxis(series, true)

            } else {
                let seriesToRemove
                this.state.options.series = this.state.options.series.filter(series => {
                    if (series.name == name) {
                        seriesToRemove = series
                        return false
                    }
                    return true
                })
                this.handleYAxis(seriesToRemove, false)

            }
        }
        this.chart.updateOptions(this.state.options)
    }


    //checks if a event annotaion got clicked
    handleClick(event, chartContext, config, setEvent) {
        const type = event.target.innerHTML

        if (ApexChart.isAnnotation(type)) {
            const annotation_id = event.target.classList[event.target.classList.length - 1]
            setEvent(annotation_id, type)
        }
    }

    //call after series gets added/removed with add=true if added
    handleYAxis(series, add) {
        const numSeries = this.state.options.series.length
        if (add) {
            if (numSeries == 1) {
                this.state.options.yaxis = [{seriesName: series.name, opposite: false}]
            } else if (numSeries == 2) {
                this.state.options.yaxis.push({
                    seriesName: series.name,
                    opposite: !this.state.options.yaxis[0].opposite
                })
            } else if (numSeries == 3) {
                this.state.options.yaxis = [{show: true}]
            }
        } else {
            if (numSeries == 0 || numSeries > 2) {
                this.state.options.yaxis = [{show: true}]
            } else if (numSeries == 1) {
                this.state.options.yaxis = this.state.options.yaxis.filter(axis => {
                    return axis.seriesName != series.name
                })
            } else if (numSeries == 2) {
                const series_0 = this.state.options.series[0]
                const series_1 = this.state.options.series[1]
                this.state.options.yaxis = [{seriesName: series_0.name}, {
                    seriesName: series_1.name,
                    opposite: true
                }]
            }
        }
        this.state.options.yaxis = this.state.options.yaxis.map(axis => this.configureAxis(axis))
    }

    configureAxis(axis) {
        axis.title = {
            text: axis.seriesName,
            style: {
                color: '#EBE0CB',
            }
        }
        axis.decimalsInFloat = 0
        axis.axisBorder = {
            show: true,
            color: '#EBE0CB',
        }
        axis.axisTicks = {
            show: true,
            colors: '#EBE0CB',
        }
        axis.labels = {
            show: true,
            color: '#EBE0CB'
        }
        return axis
    }

    static createAnnotation(event) {
        const color = ApexChart.getColor(event.type)
        return {
            id: event.type + event.timestamp,
            type: event.type,
            x: ApexChart.translateTime(event.timestamp),
            strokeDashArray: 0,
            borderColor: color,
            fillColor: color,
            label: {
                borderColor: color,
                orientation: 'vertical',
                text: event.type,
                style: {
                    cssClass: 'annotation',
                    background: color
                },
            }
        }
    }

    setVisibility(name) {
        this.setState(prevstate => prevstate.data_shown[name] = !prevstate.data_shown[name])
        this.updateChart(name, !this.state.data_shown[name])
    }

    setEvent(annotation_id, type) {
        console.log('setevent')
        for (const event_index in this.state.all_events[type]) {
            const event = this.state.all_events[type][event_index]
            if (event.type + event.timestamp == annotation_id) {

                const participants = this.props.data.teams.winner.concat(this.props.data.teams.loser)

                let loaded_event = {
                    time: event.timestamp,
                    x: event.x,
                    y: event.y,
                    type: event.type,
                    assisting_participants: []
                }
                for (const participant_index in participants) {
                    const current_participant = participants[participant_index]
                    if (current_participant.id == parseInt(event.active_participant)) {
                        loaded_event.active_participant = current_participant
                    } else if (current_participant.id == parseInt(event.passive_participant)) {
                        loaded_event.passive_participant = current_participant
                    } else if (event.assisting_participants.includes(current_participant.id)) {
                        loaded_event.assisting_participants.push(current_participant)
                    }
                }
                if (loaded_event.passive_participant == undefined) {
                    loaded_event.passive_participant = event.passive_participant
                }
                this.setState({loaded_event: loaded_event})
            }
        }
    }

    render() {
        const classes = this.props.classes

        console.log('render')
        if (this.state.loaded_data && !this.state.added_data || this.props.new_data) {
            this.prepareChart()
            this.state.added_data = true
        }

        return (
            <Box display={'flex'} flexDirection={'column'}
                 className={clsx(classes.full_height, classes.full_width)}>
                <Box>
                    <Event event={this.state.loaded_event}/>
                </Box>
                <Box display={'flex'} flexGrow={5} className={clsx(classes.full_height, classes.full_width)}>
                    <Box display={'flex'} flexDirection={'column'} flexGrow={5} className={clsx(classes.chartBox)}>
                        {React.createElement('div', {
                            ref: React.createRef
                                ? this.chartRef
                                : this.setRef,
                        })}
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} flexGrow={1} justifyContent={'center'}
                         alignItems={'flex-start'}
                         className={clsx(classes.verticalCheckboxes)}>
                        <Typography variant={'h5'} align={'center'}
                                    className={classes.full_width}>Events</Typography>
                        <CheckboxList
                            checked={this.state.data_shown}
                            setVisibility={(name) => this.setVisibility(name)}
                            groups={{
                                'Events': Object.keys(this.state.all_events)
                            }}
                            direction={'column'}
                        />
                        <Typography variant={'h5'} align={'center'}
                                    className={classes.full_width}>Graphs</Typography>
                        <CheckboxList
                            checked={this.state.data_shown}
                            setVisibility={(name) => this.setVisibility(name)}
                            groups={{
                                'Series': Object.keys(this.state.all_series)
                            }}
                            direction={'column'}
                        />
                    </Box>
                </Box>
            </Box>
        )
    }

    //translate to minutes
    static translateTime(time) {
        return time / 1000 / 60
    }

    static scaleName(name) {
        const scales = {
            EXP: ['EXP', 'GOLD'],
            CREEP: ['CREEP', 'NEUTRAL', 'IN_BANDWIDTH', 'OUT_BANDWIDTH'],
            LEVEL: ['LEVEL', 'PING', 'JITTER'],
            LOSS: ['LOSS']
        }
        for (let scale_name in scales) {
            if (scales[scale_name].includes(name)) {
                return scale_name
            }
        }
        return false
    }

    static isAnnotation(name) {
        const annotations = ['CHAMPION_KILL', 'CHAMPION_DEATH', 'WARD_PLACED', 'WARD_KILLED', 'BUILDING_KILL', 'ELITE_MONSTER_KILL', 'ITEM_PURCHASED', 'ITEM_SOLD', 'ITEM_DESTROYED', 'ITEM_UNDO', 'SKILL_LEVEL_UP', 'CAPTURE_POINT', 'PORO_KING_SUMMON', 'ASCENDED_EVENT',]
        return annotations.includes(name)
    }

    static getColor(type) {
        switch (type) {
            case 'CHAMPION_KILL':
            case 'CHAMPION_DEATH':
                return '#d63d54'
            case 'WARD_PLACED':
            case 'WARD_KILLED':
            case 'BUILDING_KILL':
            case 'ELITE_MONSTER_KILL':
                return '#12bf80'
            case 'ITEM_PURCHASED':
            case 'ITEM_SOLD':
            case 'ITEM_DESTROYED':
            case 'ITEM_UNDO':
                return '#6c5263'
            case 'SKILL_LEVEL_UP':
            case 'CAPTURE_POINT':
            case 'PORO_KING_SUMMON':
            case 'ASCENDED_EVENT':
                return '#f2ab39'
        }
        return '#f2ab39'
    }


    static(value, {series, seriesIndex, dataPointIndex, w}) {
        const seriesName = w.globals.seriesNames[seriesIndex]
        const units = {
            'EXP': 'XP',
            'GOLD': '',
            'CREEP': '',
            'NEUTRAL': '',
            'LEVEL': '',
            'PING': 'ms',
            'JITTER': 'ms',
            'IN_BANDWIDTH': 'kB/s',
            'OUT_BANDWIDTH': 'kB/s',
            'LOSS': '%',
        }
        if (seriesName != 'LOSS') {
            value = Math.round(value)
        }

        return value + ' ' + units[seriesName]
    }

}

export default withStyles(styles)

(
    ApexChart
)