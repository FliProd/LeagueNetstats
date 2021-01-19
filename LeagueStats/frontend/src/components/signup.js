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
            summoner_name:"",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/user/create/', {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
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
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Summoner Name</Form.Label>
                                <Form.Control name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors != undefined) && <Alert className={"margin-t"} variant={"danger"}>{this.state.error.username}</Alert> }
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="text" value={this.state.email} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors != undefined) && <Alert className={"margin-t"} variant={"danger"}>{this.state.error.email}</Alert> }
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                            </Form.Group>
                            { (this.state.errors != undefined) && <Alert className={"margin-t"} variant={"danger"}>{this.state.error.password}</Alert> }
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