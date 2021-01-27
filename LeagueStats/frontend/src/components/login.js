import React, { Component, Fragment } from "react";
import {axiosInstance} from "../axiosApi";
import { Button, Form, Alert } from "react-bootstrap";
import { Grid, Paper, Box} from "@material-ui/core";
import SummonerList from "./summoner";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error_description: "",
            error_occurred: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/api/token/obtain/', {
                username: this.state.username,
                password: this.state.password
            });
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = '/';
            return response.data;
        } catch (error) {
            console.log(error.response);
            this.setState({error_occurred: true});
            this.setState({error_description: error.response.data['detail']});
        }
    }

    renderForm() {
        return (
            <Fragment>
                <h2>Login</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" value={this.state.username}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" value={this.state.password}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    {this.state.error_occurred &&
                    <Alert className={"margin-t"} variant={"danger"}>{this.state.error_description}</Alert>}
                    <Button className={"margin-t"} variant={'dark'} type={'Submit'}>
                        Submit
                    </Button>
                </Form>
            </Fragment>
        )
    }

    render() {
        const Form = this.renderForm();
        return (
            <Grid className={"signup-grid"} container direction="row" alignItems="center" justify="center">
                <Grid item md={6}>
                    <Paper variant="outlined">
                        <Box p={2}>
                            {Form}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
export default Login;