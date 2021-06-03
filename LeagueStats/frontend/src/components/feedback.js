import React, {Component} from "react"
import axiosInstance from "../axiosApi"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Alert, Form} from "react-bootstrap"
import {withStyles} from "@material-ui/core/styles";
import {withTranslation} from "react-i18next";
import clsx from "clsx";
import {loggedIn} from "./Utility/ut_functions";
import {Fragment} from "react";
import Footer from "./Utility/footer";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Header from "./Utility/header"


const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
    },
    form: {
        width: '60%'
    },
    button: {
        marginTop: 4,
        marginBottom: 4
    },
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: 5,
    },
     title: {
        padding: 10,
        marginRight: 20,
        marginLeft: 30,
        marginBottom: 20,
    },
     custom_link: {
       '&:hover': {
            color: '#B6893A',
            textDecoration: 'none'
        }
    },
})


class Feedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feedback: '',
            email: '',
            authenticated: loggedIn()
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState(prevstate => prevstate[event.target.name] = event.target.value)
    }

    async handleSubmit(event) {
        event.preventDefault()

        try {
            const response = await axiosInstance.post('/feedback/create/', {
                feedback: this.state.feedback,
                email: this.state.email
            })

            if (response.status == 201) {
                this.setState({
                    success: true,
                })
            }
            return response
        } catch (error) {
            this.setState({
                errors: error.response.data,
            })
        }
    }


    render() {
        const {classes, t} = this.props
        const authenticated = this.state.authenticated
        return (
            <Fragment>
                {!authenticated &&
                <Header subtitle={'feedback.title'}/>
                }
                <Box display={"flex"} flexDirection={'column'} justifyContent={"center"} alignItems={"center"}
                     className={classes.container}>
                    <Form onSubmit={this.handleSubmit} className={clsx(classes.form, classes.border)}>
                        <Typography variant={'h3'}>{t('feedback.title')}</Typography>
                        {authenticated &&
                        <Typography variant={"body1"}>{t('feedback.info')}</Typography>
                        }
                        {!authenticated &&
                        <Form.Group>
                            {!authenticated &&
                            <Form.Label>{t('email')}</Form.Label>
                            }
                            <Form.Control name="email" type="text" value={this.state.email}
                                          onChange={this.handleChange} autoComplete={'off'}/>
                            {this.state.errors && this.state.errors.email &&
                            <Alert variant={"danger"}>{this.state.errors.email}</Alert>
                            }
                        </Form.Group>
                        }
                        <Form.Group>
                            {!authenticated &&
                            <Form.Label>{t('feedback.title')}</Form.Label>
                            }
                            <Form.Control name="feedback" as="textarea" rows={8} value={this.state.feedback}
                                          onChange={this.handleChange} autoComplete={'off'}/>
                        </Form.Group>

                        <Button variant={'contained'} type={'Submit'} className={classes.button}>
                            <Typography>{t('feedback.submit')}</Typography>
                        </Button>
                        {this.state.errors && this.state.errors.feedback &&
                        <Alert variant={"danger"}>{this.state.errors.feedback}</Alert>
                        }
                        {this.state.success &&
                        <Alert variant={"success"}>{t('feedback.success')}</Alert>
                        }

                    </Form>
                </Box>
                {!authenticated &&
                <Footer/>
                }
            </Fragment>
        )
    }
}


export default withStyles(styles)(withTranslation()(Feedback))