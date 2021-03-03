import React, {Component, Fragment, isValidElement} from "react"
import Box from "@material-ui/core/Box"
import Chart from "react-apexcharts"
import ApexCharts from 'apexcharts'
import CheckboxList from "./checkbox"
import {Grid, Paper, Typography} from "@material-ui/core"
import {Image} from "react-bootstrap";
import Event from "./event";

class ApexChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            loaded_event: undefined,
            chart_rendered: false,
            chart_added_data: false,
            chart_series: {},
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
                'CHAMPION_KILL': true,
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
            options: {
                annotations: {
                    xaxis: []
                },
                legend: {
                    show: false
                },
                series: [],
                chart: {
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
                        formatter: this.formatTooltip
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


//TODO go over this references
        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }

        this.handleClick = this.handleClick.bind(this)
        this.prepareChart = this.prepareChart.bind(this)
        this.updateChart = this.updateChart.bind(this)
        this.handleYAxis = this.handleYAxis.bind(this)
        this.formatTooltip = this.formatTooltip.bind(this)
        this.setEvent = this.setEvent.bind(this)

    }

    prepareChart() {
        console.log('prepare chart')


        for (const [key, value] of Object.entries(this.state.all_series)) {
            if (this.state.data_shown[key] && value.data.length > 0 && this.state.chart_series[key] == undefined) {
                this.state.chart_series[key] = true
                this.state.options.series.push(value)
                this.handleYAxis(value, true)
            }
        }

        const element = React.createRef() ? this.chartRef.current : this.chartRef
        this.chart = new ApexCharts(element, this.state.options)
        this.chart.render()

        for (const [type, annotation_arr] of Object.entries(this.state.all_annotations)) {
            if (this.state.data_shown[type]) {
                annotation_arr.map(annotation => this.chart.addXaxisAnnotation(annotation, true))
            }
        }

    }

//hide and showseries is not working correctly
    updateChart(name, add) {
        console.log('update chart')
        if (ApexChart.isAnnotation(name)) {
            if (add) {
                this.state.all_annotations[name].map(annotation => this.chart.addXaxisAnnotation(annotation, true))
            } else {
                this.state.all_annotations[name].map(annotation => this.chart.removeAnnotation(annotation.id))
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
            this.chart.updateOptions(this.state.options)
        }
    }

    static isAnnotation(name) {
        const annotations = ['CHAMPION_KILL', 'CHAMPION_DEATH', 'WARD_PLACED', 'WARD_KILLED', 'BUILDING_KILL', 'ELITE_MONSTER_KILL', 'ITEM_PURCHASED', 'ITEM_SOLD', 'ITEM_DESTROYED', 'ITEM_UNDO', 'SKILL_LEVEL_UP', 'CAPTURE_POINT', 'PORO_KING_SUMMON', 'ASCENDED_EVENT',]
        return annotations.includes(name)
    }

    static getColor(type) {
        return '#775DD0'
    }

//checks if a event annotaion got clicked
    handleClick(event, chartContext, config, setEvent) {
        const type = event.target.innerHTML

        if (ApexChart.isAnnotation(type)) {
            const annotation_id = event.target.classList[event.target.classList.length - 1]
            setEvent(annotation_id, type)
        }
    }

    setEvent(annotation_id, type) {
        console.log('setevent')
        for (const event_index in this.state.all_events[type]) {
            const event = this.state.all_events[type][event_index]
            if (event.type + event.timestamp == annotation_id) {
                const participants = JSON.parse('[' + this.props.data.match.participants.join(',') + ']')

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

    static getDerivedStateFromProps(props, state) {
        if (!state.loaded) {
            console.log('getDerivedStateFromProps')
            let networklogs
            let frames
            let events
            if (props.data.networklogs != undefined) {
                networklogs = JSON.parse(props.data.networklogs)
                frames = JSON.parse(props.data.frames)
                events = JSON.parse(props.data.events)
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
                    state.all_series['EXP'].data.push({'x': ApexChart.translateTime(frame.timestamp), 'y': frame.exp})

                })
            }
            if (events != undefined) {
                events.map(event => {
                    //uncomment this to load events as series
                    /*state.all_series[event.type].data.push({
                        'x': ApexChart.translateTime(event.timestamp),
                        'y': ApexChart.calculateY(event.type, event.timestamp)
                    })*/
                    state.all_events[event.type].push(event)
                    state.all_annotations[event.type].push({
                        id: event.type + event.timestamp,
                        x: ApexChart.translateTime(event.timestamp),
                        borderColor: ApexChart.getColor(event.type),
                        label: {
                            borderColor: ApexChart.getColor(event.type),
                            orientation: 'vertical',
                            text: event.type,
                            style: {
                                cssClass: 'annotation'
                            }
                        }
                    })
                })
                state.loaded = true
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

//translate to minutes
    static translateTime(time) {
        return time / 1000 / 60
    }

    static calculateY(type, timestamp) {
        switch (type) {
            case 'CHAMPION_KILL':
                return 10
            case 'CHAMPION_DEATH':
                return 20
            case 'WARD_PLACED':
                return 30
            case 'WARD_KILLED':
                return 40
            case 'BUILDING_KILL':
                return 50
            case 'ELITE_MONSTER_KILL':
                return 60
            case 'ITEM_PURCHASED':
                return 70
            case 'ITEM_SOLD':
                return 80
            case 'ITEM_DESTROYED':
                return 90
            case 'ITEM_UNDO':
                return 100
            case 'SKILL_LEVEL_UP':
                return 110
            case 'CAPTURE_POINT':
                return 120
            case 'PORO_KING_SUMMON':
                return 130
            case 'ASCENDED_EVENT':
                return 140
        }
        //TODO: plot events on graph
    }

    formatTooltip(value, {series, seriesIndex, dataPointIndex, w}) {
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

    setVisibility(name) {
        this.setState(prevstate => prevstate.data_shown[name] = !prevstate.data_shown[name])
        this.updateChart(name, !this.state.data_shown[name])
    }


    render() {
        console.log('render')
        if (!this.state.chart_added_data && this.state.loaded) {
            this.prepareChart()
            this.state.chart_added_data = true
        }

        return (
            <Paper variant={"outlined"}>
                <Grid container>
                    <Grid item md={10}>
                        <Grid container direction={"column"}>
                            <Grid item>
                                <Event event={this.state.loaded_event}/>
                            </Grid>
                            <Grid item>
                                {React.createElement('div', {
                                    ref: React.createRef
                                        ? this.chartRef
                                        : this.setRef,
                                })}
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item md={2}>
                        <CheckboxList
                            checked={this.state.data_shown}
                            setVisibility={(name) => this.setVisibility(name)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default ApexChart