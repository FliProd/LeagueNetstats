import React, {Component, Fragment, isValidElement} from "react"
import Box from "@material-ui/core/Box"
import ApexCharts from 'apexcharts'


class Exampleplot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            chart_series: {},
            kills: [],
            deaths: [],
            options: Exampleplot.setOptions(),
        }
        //TODO go over this references
        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }
    }

    static setOptions() {
        return {
            series: [
                {
                    name: "CHAMPION_KILLS", data: [
                        [
                            5370,
                            6160
                        ],
                        [
                            3575,
                            3884
                        ],
                        [
                            3900,
                            4383
                        ],
                        [
                            2563,
                            1786
                        ],
                        [
                            10642,
                            10574
                        ],
                        [
                            9714,
                            10030
                        ]
                    ]
                },
                {
                    name: "CHAMPION_DEATHS", data: [
                        [
                            7816,
                            8285
                        ],
                        [
                            6556,
                            7205
                        ],
                        [
                            6257,
                            6736
                        ],
                        [
                            9382,
                            8794
                        ],
                        [
                            5741,
                            5146
                        ],
                        [
                            4432,
                            4999
                        ],
                        [
                            6887,
                            6113
                        ],
                        [
                            2789,
                            2722
                        ]
                    ]
                },
                {
                    name: "BUILDING_KILL", data: [
                        [
                            3809,
                            3829
                        ],
                        [
                            2051,
                            2560
                        ]
                    ]
                },
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
                background: 'url(/static/img/map_400x400.png)'
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

    componentDidMount() {
        const element = React.createRef() ? this.chartRef.current : this.chartRef
        if (this.chart != null) {
            this.chart.updateOptions(this.state.options)
        } else {
            this.chart = new ApexCharts(element, this.state.options)
            this.chart.render()
        }
    }


    render() {

        return React.createElement('div', {
            ref: React.createRef
                ? this.chartRef
                : this.setRef,
        })
    }
}

export default Exampleplot