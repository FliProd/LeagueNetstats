import React, {Component} from "react"
import ApexCharts from 'apexcharts'
import {withTranslation} from "react-i18next";


class MapPlot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            chart_series: {},
            kills: [],
            deaths: [],
            options: MapPlot.setOptions(props.t),
        }
        //TODO go over this references
        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }
    }

    static setOptions(t) {
        return {
            series: [
                {name: t("annotation.CHAMPION_KILL"), data: []},
                {name: t("annotation.CHAMPION_DEATH"), data: []},
                {name: t("annotation.BUILDING_KILL"), data: []},
                {name: t("annotation.BUILDING_KILL"), data: []},
            ],
            chart: {
                parentHeightOffset: 0,
                toolbar: {
                    show: false,
                },
                height: 400,
                width: 400,
                type: 'scatter',
                zoom: {
                    enabled: false,
                },
                background: 'url(/static/img/map/map_400x400.png)'
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
                x: {
                    show: false,
                },
                y: {
                    formatter: () => '',
                    title: {
                        formatter: (seriesName) => seriesName,
                    },
                },
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.loaded || props.new_data) {
            let events
            if (props.events != undefined) {
                events = props.events
                state.options = MapPlot.setOptions(props.t)
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
            return null
        }
    }


    render() {
        if (this.state.loaded || this.props.new_data) {
            const element = React.createRef() ? this.chartRef.current : this.chartRef
            if (this.chart != null) {
                this.chart.updateOptions(this.state.options)
            } else {
                this.chart = new ApexCharts(element, this.state.options)
                this.chart.render()
            }
        }


        return React.createElement('div', {
            ref: React.createRef
                ? this.chartRef
                : this.setRef,
        })
    }
}

export default withTranslation()(MapPlot)