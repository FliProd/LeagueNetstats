import React, { Component } from "react";
import {Link} from "react-router-dom";
import {Nav, Navbar, Button} from "react-bootstrap";
import {axiosInstance} from "../axiosApi";

class Header extends Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post('/api/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <Navbar variant={"dark"} expand="lg" className={"text-right"}>
                <Navbar.Brand href="/">LeagueStats</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Link className={"nav-link"} to={"/"}>Home</Link>
                        <Link className={"nav-link"} to={"/login/"}>Login</Link>
                        <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                        <Button className="stick-right" variant="light" onClick={this.handleLogout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;