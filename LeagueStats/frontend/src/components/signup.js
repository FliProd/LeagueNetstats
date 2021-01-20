import React, { Component } from "react";
import { axiosInstance } from "../axiosApi";
import {Alert, Button, Form, Row} from "react-bootstrap";
import {Card, Grid} from "tabler-react";

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            email:"",
            location: {
                latitude:"",
                longitude:"",
            },
            location_msg: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleLocation(event) {
        if(event.target.checked) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.setState({
                            location: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            },
                        });
                    },
                    (error) => {
                        this.setState({
                            location_msg: error.message
                        });
                    }
                );
            } else {
                this.setState({
                    location_msg: "We cant access your location. Try giving the right permission to your Browser",
                });
            }
        } else {
            this.setState({
                location: {
                    longitude: "",
                    latitude: "",
                }
            });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/profile/create/', {
                user: {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password,
                },
                puuid: '1234',
                game_region: 'EUW',
                location: 'adsf',
            });
            return response;
        } catch (error) {
            console.log(error.stack);
            this.setState({
                errors:error.response.data
            });
        }
    }

    render() {
        return (
            <Grid>
                <Row className={"full-height"}>
                    <Card className={"align-self-center padding"}>
                        <h2>SignUp</h2>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Summoner Name</Form.Label>
                                <Form.Control name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors && this.state.errors.username) && <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.username}</Alert> }
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="text" value={this.state.email} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors && this.state.errors.email) && <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.email}</Alert> }
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors && this.state.errors.password) && <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.password}</Alert> }
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check className={"padding"} type="checkbox" label="Allow my location to be saved." onChange={this.handleLocation}/>
                            </Form.Group>
                            { (this.state.errors && this.state.errors.location) && <Alert className={"margin-t"} variant={"danger"}>{this.state.location_msg}</Alert> }
                            <Button className={"margin-t"} variant={'dark'} type={'Submit'}>
                                Submit
                            </Button>
                        </Form>
                    </Card>
                </Row>
            </Grid>
        )
    }
}
export default Signup;