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
    apexchartsTooltip: {
        backgroundColor: '#14253D',
        color: '#EBE0CB',
    }
})


class Examplechart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: {},
            data_loaded: false
        }

        if (React.createRef) {
            this.chartRef = React.createRef()
        } else {
            this.setRef = el => this.chartRef = el
        }
        this.chart = null

    }


    setOptions() {
        return {
            annotations: {
                xaxis: [
                    {
                        "id": "CHAMPION_DEATH72515",
                        "type": "CHAMPION_DEATH",
                        "x": 1.2085833333333333,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH125806",
                        "type": "CHAMPION_DEATH",
                        "x": 2.0967666666666664,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH222547",
                        "type": "CHAMPION_DEATH",
                        "x": 3.7091166666666666,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH350232",
                        "type": "CHAMPION_DEATH",
                        "x": 5.8372,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH397142",
                        "type": "CHAMPION_DEATH",
                        "x": 6.619033333333333,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH507915",
                        "type": "CHAMPION_DEATH",
                        "x": 8.465250000000001,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH572508",
                        "type": "CHAMPION_DEATH",
                        "x": 9.5418,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH615319",
                        "type": "CHAMPION_DEATH",
                        "x": 10.255316666666666,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    },
                    {
                        "id": "CHAMPION_DEATH705384",
                        "type": "CHAMPION_DEATH",
                        "x": 11.756400000000001,
                        "strokeDashArray": 0,
                        "borderColor": "#d63d54",
                        "fillColor": "#d63d54",
                        "label": {
                            "borderColor": "#d63d54",
                            "orientation": "vertical",
                            "text": "CHAMPION_DEATH",
                            "style": {
                                "cssClass": "annotation",
                                "background": "#d63d54"
                            }
                        }
                    }
                ]
            },
            legend: {
                show: false
            },
            series: [{
                "type": "line",
                "name": "PING",
                "data": [
                    {
                        "x": 0.18246666666666667,
                        "y": 13
                    },
                    {
                        "x": 0.3492,
                        "y": 21
                    },
                    {
                        "x": 0.5159166666666667,
                        "y": 19
                    },
                    {
                        "x": 0.6826333333333333,
                        "y": 19
                    },
                    {
                        "x": 0.8493666666666667,
                        "y": 19
                    },
                    {
                        "x": 1.0160833333333334,
                        "y": 19
                    },
                    {
                        "x": 1.1828166666666666,
                        "y": 19
                    },
                    {
                        "x": 1.3495333333333333,
                        "y": 20
                    },
                    {
                        "x": 1.5162833333333334,
                        "y": 19
                    },
                    {
                        "x": 1.6829833333333333,
                        "y": 20
                    },
                    {
                        "x": 1.8497333333333332,
                        "y": 19
                    },
                    {
                        "x": 2.01645,
                        "y": 19
                    },
                    {
                        "x": 2.1831166666666664,
                        "y": 20
                    },
                    {
                        "x": 2.3498,
                        "y": 20
                    },
                    {
                        "x": 2.5165333333333333,
                        "y": 20
                    },
                    {
                        "x": 2.6832,
                        "y": 18
                    },
                    {
                        "x": 2.8499,
                        "y": 20
                    },
                    {
                        "x": 3.01665,
                        "y": 19
                    },
                    {
                        "x": 3.183383333333333,
                        "y": 20
                    },
                    {
                        "x": 3.3501,
                        "y": 19
                    },
                    {
                        "x": 3.5167833333333336,
                        "y": 20
                    },
                    {
                        "x": 3.6835166666666668,
                        "y": 19
                    },
                    {
                        "x": 3.85025,
                        "y": 19
                    },
                    {
                        "x": 4.017,
                        "y": 19
                    },
                    {
                        "x": 4.1837,
                        "y": 19
                    },
                    {
                        "x": 4.3504,
                        "y": 19
                    },
                    {
                        "x": 4.517133333333334,
                        "y": 19
                    },
                    {
                        "x": 4.683833333333333,
                        "y": 18
                    },
                    {
                        "x": 4.850533333333333,
                        "y": 19
                    },
                    {
                        "x": 5.017233333333333,
                        "y": 19
                    },
                    {
                        "x": 5.1840166666666665,
                        "y": 19
                    },
                    {
                        "x": 5.3506833333333335,
                        "y": 20
                    },
                    {
                        "x": 5.517416666666667,
                        "y": 19
                    },
                    {
                        "x": 5.684166666666667,
                        "y": 19
                    },
                    {
                        "x": 5.8509166666666665,
                        "y": 18
                    },
                    {
                        "x": 6.0176,
                        "y": 19
                    },
                    {
                        "x": 6.184333333333333,
                        "y": 19
                    },
                    {
                        "x": 6.35105,
                        "y": 19
                    },
                    {
                        "x": 6.51785,
                        "y": 20
                    },
                    {
                        "x": 6.684533333333333,
                        "y": 18
                    },
                    {
                        "x": 6.851216666666667,
                        "y": 20
                    },
                    {
                        "x": 7.017916666666666,
                        "y": 19
                    },
                    {
                        "x": 7.184666666666667,
                        "y": 19
                    },
                    {
                        "x": 7.351416666666666,
                        "y": 19
                    },
                    {
                        "x": 7.518166666666667,
                        "y": 19
                    },
                    {
                        "x": 7.6848833333333335,
                        "y": 18
                    },
                    {
                        "x": 7.851616666666667,
                        "y": 20
                    },
                    {
                        "x": 8.018316666666667,
                        "y": 19
                    },
                    {
                        "x": 8.185066666666666,
                        "y": 19
                    },
                    {
                        "x": 8.351783333333334,
                        "y": 19
                    },
                    {
                        "x": 8.518483333333332,
                        "y": 19
                    },
                    {
                        "x": 8.685216666666667,
                        "y": 19
                    },
                    {
                        "x": 8.851966666666668,
                        "y": 19
                    },
                    {
                        "x": 9.018716666666668,
                        "y": 19
                    },
                    {
                        "x": 9.185416666666667,
                        "y": 18
                    },
                    {
                        "x": 9.3521,
                        "y": 19
                    },
                    {
                        "x": 9.518816666666668,
                        "y": 19
                    },
                    {
                        "x": 9.685516666666667,
                        "y": 18
                    },
                    {
                        "x": 9.852216666666667,
                        "y": 19
                    },
                    {
                        "x": 10.0189,
                        "y": 20
                    },
                    {
                        "x": 10.185599999999999,
                        "y": 19
                    },
                    {
                        "x": 10.352283333333332,
                        "y": 19
                    },
                    {
                        "x": 10.518966666666667,
                        "y": 20
                    },
                    {
                        "x": 10.685716666666668,
                        "y": 19
                    },
                    {
                        "x": 10.852450000000001,
                        "y": 19
                    },
                    {
                        "x": 11.019200000000001,
                        "y": 18
                    },
                    {
                        "x": 11.185883333333333,
                        "y": 19
                    },
                    {
                        "x": 11.352616666666668,
                        "y": 18
                    },
                    {
                        "x": 11.519333333333332,
                        "y": 19
                    },
                    {
                        "x": 11.686033333333334,
                        "y": 20
                    },
                    {
                        "x": 11.852733333333333,
                        "y": 19
                    },
                    {
                        "x": 12.019499999999999,
                        "y": 18
                    },
                    {
                        "x": 12.186183333333334,
                        "y": 19
                    },
                    {
                        "x": 12.35295,
                        "y": 19
                    },
                    {
                        "x": 12.519666666666666,
                        "y": 19
                    },
                    {
                        "x": 12.686383333333334,
                        "y": 19
                    },
                    {
                        "x": 12.853066666666667,
                        "y": 19
                    },
                    {
                        "x": 13.00785,
                        "y": 20
                    }
                ]
            }, {
                "type": "line",
                "name": "OUT_BANDWIDTH",
                "data": [
                    {
                        "x": 0.18246666666666667,
                        "y": 0.5337961271465108
                    },
                    {
                        "x": 0.3492,
                        "y": 1.1228508596561375
                    },
                    {
                        "x": 0.5159166666666667,
                        "y": 0.6458062581225632
                    },
                    {
                        "x": 0.6826333333333333,
                        "y": 0.683295011496551
                    },
                    {
                        "x": 0.8493666666666667,
                        "y": 1.536985205917633
                    },
                    {
                        "x": 1.0160833333333334,
                        "y": 2.2061381585524344
                    },
                    {
                        "x": 1.1828166666666666,
                        "y": 2.0830667732906836
                    },
                    {
                        "x": 1.3495333333333333,
                        "y": 1.7504748575427371
                    },
                    {
                        "x": 1.5162833333333334,
                        "y": 2.0435782108945526
                    },
                    {
                        "x": 1.6829833333333333,
                        "y": 2.013997200559888
                    },
                    {
                        "x": 1.8497333333333332,
                        "y": 1.968015992003998
                    },
                    {
                        "x": 2.01645,
                        "y": 1.9743077076876936
                    },
                    {
                        "x": 2.1831166666666664,
                        "y": 1.8482
                    },
                    {
                        "x": 2.3498,
                        "y": 2.11988801119888
                    },
                    {
                        "x": 2.5165333333333333,
                        "y": 1.9540183926429429
                    },
                    {
                        "x": 2.6832,
                        "y": 2.0322
                    },
                    {
                        "x": 2.8499,
                        "y": 2.484603079384123
                    },
                    {
                        "x": 3.01665,
                        "y": 1.9041479260369816
                    },
                    {
                        "x": 3.183383333333333,
                        "y": 2.005497800879648
                    },
                    {
                        "x": 3.3501,
                        "y": 2.2523243027091873
                    },
                    {
                        "x": 3.5167833333333336,
                        "y": 2.2185781421857813
                    },
                    {
                        "x": 3.6835166666666668,
                        "y": 2.04328268692523
                    },
                    {
                        "x": 3.85025,
                        "y": 2.091863254698121
                    },
                    {
                        "x": 4.017,
                        "y": 1.990504747626187
                    },
                    {
                        "x": 4.1837,
                        "y": 1.9768046390721856
                    },
                    {
                        "x": 4.3504,
                        "y": 1.9710057988402319
                    },
                    {
                        "x": 4.517133333333334,
                        "y": 2.096861255497801
                    },
                    {
                        "x": 4.683833333333333,
                        "y": 1.841731653669266
                    },
                    {
                        "x": 4.850533333333333,
                        "y": 2.115376924615077
                    },
                    {
                        "x": 5.017233333333333,
                        "y": 2.230753849230154
                    },
                    {
                        "x": 5.1840166666666665,
                        "y": 1.9542320375736983
                    },
                    {
                        "x": 5.3506833333333335,
                        "y": 1.9538
                    },
                    {
                        "x": 5.517416666666667,
                        "y": 2.071471411435426
                    },
                    {
                        "x": 5.684166666666667,
                        "y": 2.189005497251374
                    },
                    {
                        "x": 5.8509166666666665,
                        "y": 2.0288855572213893
                    },
                    {
                        "x": 6.0176,
                        "y": 2.0886911308869114
                    },
                    {
                        "x": 6.184333333333333,
                        "y": 2.0484806077568973
                    },
                    {
                        "x": 6.35105,
                        "y": 4.454763570928721
                    },
                    {
                        "x": 6.51785,
                        "y": 2.349220623501199
                    },
                    {
                        "x": 6.684533333333333,
                        "y": 2.086991300869913
                    },
                    {
                        "x": 6.851216666666667,
                        "y": 1.8749125087491252
                    },
                    {
                        "x": 7.017916666666666,
                        "y": 1.9073185362927414
                    },
                    {
                        "x": 7.184666666666667,
                        "y": 2.104447776111944
                    },
                    {
                        "x": 7.351416666666666,
                        "y": 2.197801099450275
                    },
                    {
                        "x": 7.518166666666667,
                        "y": 1.8281859070464768
                    },
                    {
                        "x": 7.6848833333333335,
                        "y": 1.9015295411376587
                    },
                    {
                        "x": 7.851616666666667,
                        "y": 2.334766093562575
                    },
                    {
                        "x": 8.018316666666667,
                        "y": 2.1096780643871225
                    },
                    {
                        "x": 8.185066666666666,
                        "y": 2.329935032483758
                    },
                    {
                        "x": 8.351783333333334,
                        "y": 2.1194641607517744
                    },
                    {
                        "x": 8.518483333333332,
                        "y": 2.0521895620875825
                    },
                    {
                        "x": 8.685216666666667,
                        "y": 1.8573570571771292
                    },
                    {
                        "x": 8.851966666666668,
                        "y": 2.0555722138930537
                    },
                    {
                        "x": 9.018716666666668,
                        "y": 2.0297851074462767
                    },
                    {
                        "x": 9.185416666666667,
                        "y": 2.2390521895620874
                    },
                    {
                        "x": 9.3521,
                        "y": 2.1232876712328768
                    },
                    {
                        "x": 9.518816666666668,
                        "y": 1.8230530840747776
                    },
                    {
                        "x": 9.685516666666667,
                        "y": 2.0920815836832634
                    },
                    {
                        "x": 9.852216666666667,
                        "y": 2.0961807638472307
                    },
                    {
                        "x": 10.0189,
                        "y": 2.1616838316168385
                    },
                    {
                        "x": 10.185599999999999,
                        "y": 2.103979204159168
                    },
                    {
                        "x": 10.352283333333332,
                        "y": 2.343265673432657
                    },
                    {
                        "x": 10.518966666666667,
                        "y": 1.7335266473352664
                    },
                    {
                        "x": 10.685716666666668,
                        "y": 1.9255372313843078
                    },
                    {
                        "x": 10.852450000000001,
                        "y": 2.3326669332267094
                    },
                    {
                        "x": 11.019200000000001,
                        "y": 2.1964017991004496
                    },
                    {
                        "x": 11.185883333333333,
                        "y": 1.8505149485051495
                    },
                    {
                        "x": 11.352616666666668,
                        "y": 1.9804078368652538
                    },
                    {
                        "x": 11.519333333333332,
                        "y": 2.182545236429071
                    },
                    {
                        "x": 11.686033333333334,
                        "y": 2.0282943411317738
                    },
                    {
                        "x": 11.852733333333333,
                        "y": 2.1755648870225954
                    },
                    {
                        "x": 12.019499999999999,
                        "y": 2.331601039376374
                    },
                    {
                        "x": 12.186183333333334,
                        "y": 2.103789621037896
                    },
                    {
                        "x": 12.35295,
                        "y": 1.9921047371577054
                    },
                    {
                        "x": 12.519666666666666,
                        "y": 1.8737378786364092
                    },
                    {
                        "x": 12.686383333333334,
                        "y": 1.7270818754373687
                    },
                    {
                        "x": 12.853066666666667,
                        "y": 2.0223977602239778
                    },
                    {
                        "x": 13.00785,
                        "y": 1.6662000646064392
                    }
                ]
            }],
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
                        reset: true,
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
                    formatter: Examplechart.formatTooltip
                },
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
            yaxis: [
                {
                    seriesName: 'PING',
                    title: {
                        text: 'PING',
                        style: {
                            color: '#EBE0CB',
                        }
                    },
                    decimalsInFloat: 0,
                    axisBorder: {
                        show: true,
                        color: '#EBE0CB',
                    },
                    axisTicks: {
                        show: true,
                        colors: '#EBE0CB',
                    },
                    labels: {
                        show: true,
                        color: '#EBE0CB'
                    },
                },
                {
                    seriesName: 'IN_BANDWIDTH',
                    opposite: true,
                    title: {
                        text: 'IN_BANDWIDTH',
                        style: {
                            color: '#EBE0CB',
                        }
                    },
                    decimalsInFloat: 0,
                    axisBorder: {
                        show: true,
                        color: '#EBE0CB',
                    },
                    axisTicks: {
                        show: true,
                        colors: '#EBE0CB',
                    },
                    labels: {
                        show: true,
                        color: '#EBE0CB'
                    },
                }
            ],
            grid: {
                show: false,
            },
            animations: {
                enabled: false,
            }
        }
    }


    componentDidMount() {
        if (!this.state.data_loaded) {
            this.state.options = this.setOptions()
            this.state.data_loaded = true
        }

        const element = React.createRef ? this.chartRef.current : this.chartRef
        this.chart = new ApexCharts(element, this.state.options)
        this.chart.render()

    }


    render() {
        const classes = this.props.classes


        return React.createElement('div', {
            ref: React.createRef
                ? this.chartRef
                : this.setRef,
        })

    }


    static formatTooltip(value, {series, seriesIndex, dataPointIndex, w}) {
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

export default withStyles(styles)(Examplechart)
