import React, {Component, Fragment} from "react"
import Upload from "./upload"
import axiosInstance from "../axiosApi"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Chart from "./chart"
import ApexChart from "./chart"
import MapPlot from "./mapplot"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match: {}
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount() {
        let match_id = 940412459
        try {
            const response = await axiosInstance.get('/riotapi/match/get/'.concat(match_id))
            this.setState({match: response.data})
            console.log('loaded data')
        } catch (error) {
            console.log(error)
        }
    }


    render() {
        return (
            <Fragment>
                <ApexChart data={this.state.match}/>
                <MapPlot events={this.state.match.events} />
            </Fragment>
        )
    }
}


export default Home