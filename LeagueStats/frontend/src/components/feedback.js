import React, {Component} from "react"
import axiosInstance from "../axiosApi"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Alert, Form} from "react-bootstrap"
import {withStyles} from "@material-ui/core/styles";
import {withTranslation} from "react-i18next";
import clsx from "clsx";

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
})

class Feedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feedback: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({feedback: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault()

        try {
            const response = await axiosInstance.post('/feedback/create/', {
                feedback: this.state.feedback
            })

            if (response.status == 201) {
                this.setState({
                    success: 'feedback.success',
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
        return (
            <Box display={"flex"} flexDirection={'column'} justifyContent={"center"} alignItems={"center"}
                 className={classes.container}>
                <Form onSubmit={this.handleSubmit} className={clsx(classes.form, classes.border)}>
                    <Typography variant={'h3'}>{t('feedback.title')}</Typography>
                    <Typography variant={"body1"}>{t('feedback.info')}</Typography>
                    <Form.Control name="feedback" as="textarea" rows={8} value={this.state.feedback}
                                  onChange={this.handleChange} autoComplete={'off'}/>
                    <Button variant={'contained'} type={'Submit'} className={classes.button}>
                        <Typography>{t('feedback.submit')}</Typography>
                    </Button>
                    {this.state.errors &&
                    <Alert variant={"danger"}>{this.state.errors.detail}{this.state.errors.feedback}</Alert>
                    }
                    {this.state.success &&
                    <Alert variant={"success"}>{this.state.success}</Alert>
                    }

                </Form>
            </Box>
        )
    }
}


export default withStyles(styles)(withTranslation()(Feedback))