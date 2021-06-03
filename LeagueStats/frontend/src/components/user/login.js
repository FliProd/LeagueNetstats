import React, {Component, Fragment} from "react";
import {axiosInstance} from "../../axiosApi";
import {Form, Alert} from "react-bootstrap";
import {Grid, Paper, Box, Button} from "@material-ui/core";
import {withTranslation} from 'react-i18next'
import {withStyles} from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
import Header from "../Utility/header";
import Footer from "../Utility/footer";

const styles = theme => ({
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
        borderRadius: '5px',
    },
    custom_link: {
        '&:hover': {
            color: '#B6893A',
            textDecoration: 'none'
        }
    }
})


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
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
        axiosInstance.post('/api/token/obtain/', {
            email: this.state.email,
            password: this.state.password
        }).then(response => {
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = '/'
            return response.data;
        }).catch(error => {
            this.setState({errors: error.response.data});
        })

    }

    renderForm() {
        const {t} = this.props

        return (
            <Fragment>
                <h2>{t('login')}</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control name="email" type="text" value={this.state.email}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {this.state.errors && this.state.errors.email &&
                    <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.email}</Alert>}
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control name="password" type="password" value={this.state.password}
                                      onChange={this.handleChange} autoComplete={'off'}/>
                    </Form.Group>
                    {this.state.errors && this.state.errors.password &&
                    <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.password}</Alert>}
                    {this.state.errors && this.state.errors.detail &&
                    <Alert className={"margin-t"} variant={"danger"}>{this.state.errors.detail}</Alert>}
                    <Button className={"margin-t"} variant={'contained'} type={'Submit'}>
                        {t('login.submit')}
                    </Button>
                </Form>
            </Fragment>
        )
    }

    render() {
        const {classes, t} = this.props
        const Form = this.renderForm();
        return (
            <Fragment>
                <Header subtitle={'login'}/>
                <Grid className={"signup-grid"} container direction="row" alignItems="center" justify="center">
                    <Grid item xs={6} className={classes.border}>
                        <Box p={2}>
                            {Form}
                            <Link className={classes.custom_link} href={"/api/reset_password/"}>
                                {t('reset_password.link')}
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
                <Footer/>
            </Fragment>
        );
    }
}

export default withStyles(styles)(withTranslation()(Login))