import React, {Component, Fragment} from "react";
import Upload from "./upload";

class Home extends Component {
    constructor(props) {
        super(props);

    }


    render() {

        return (
            <Fragment>
                <Upload />
            </Fragment>
        );
    }
}


export default Home;