import React, { Component} from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import Header from "./header";


class App extends Component {



    render() {
        return (
            <div className={"site"}>
                <Header></Header>
                <main>
                    <Container>
                        <Switch>
                            <Route exact path={"/login/"} component={Login}/>
                            <Route exact path={"/signup/"} component={Signup}/>
                            <Route path={"/"} component={Home}/>
                        </Switch>
                    </Container>
                </main>
            </div>);
    }
}

export default App;