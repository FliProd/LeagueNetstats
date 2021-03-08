import React, {Component, Fragment, isValidElement} from "react"
import Box from "@material-ui/core/Box"
import ApexCharts from 'apexcharts'


class MapPlot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            chart_series: {},
            kills: [],
            deaths: [],
            options: {
                series: [
                    {name: "CHAMPION_KILLS", data: []},
                    {name: "CHAMPION_DEATHS", data: []},
                    {name: "BUILDING_KILL", data: []},
                ],
                chart: {
                    toolbar: {
                        show: false,
                    },
                    height: 300,
                    width: 300,
                    type: 'scatter',
                    zoom: {
                        enabled: false,
                    },
                    background: 'url(/static/img/map_300x300.png)'
                },
                xaxis: {
                    labels: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    tooltip: {
                        enabled: false
                    },
                    min: 0,
                    max: 15000,
                },
                yaxis: {
                    tooltip: {
                        enabled: false
                    },
                    show: false,
                    min: 0,
                    max: 15000,
                },
                legend: {
                    show: false
                },
                grid: {
                    show: false,
                },
                tooltip: {
                    enabled: true,
                }
            },
        }
        //TODO go over this references
        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (!state.loaded) {
            //console.log('getDerivedStateFromProps')
            let events
            if (props.events != undefined) {
                events = props.events
            }

            let kills = []
            let deaths = []
            let buildings = []
            if (events != undefined) {
                events.map(event => {
                    if (event.type == 'CHAMPION_KILL') {
                        kills.push([event.x, event.y])
                    } else if (event.type == 'CHAMPION_DEATH') {
                        deaths.push([event.x, event.y])
                    } else if (event.type == 'BUILDING_KILL') {
                        buildings.push([event.x, event.y])
                    }
                })
                state.options.series[0].data = kills
                state.options.series[1].data = deaths
                state.options.series[2].data = buildings
                state.loaded = true
            }

            return state
        } else {
            //console.log('getDerivedStateFromProps state not loaded')
            return null
        }
    }


    render() {
        //console.log('render')
        if (this.state.loaded) {
            const element = React.createRef() ? this.chartRef.current : this.chartRef
            this.chart = new ApexCharts(element, this.state.options)
            this.chart.render()
        }


        return (
            <Box border={1}>
                {React.createElement('div', {
                    ref: React.createRef
                        ? this.chartRef
                        : this.setRef,
                })}

            </Box>
        )
    }
}

export default MapPlot