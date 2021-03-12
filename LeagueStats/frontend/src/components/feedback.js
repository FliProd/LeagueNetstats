import React, {Component, Fragment} from "react"
import axiosInstance from "../axiosApi"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import {Typography} from "@material-ui/core"
import {Alert, Form} from "react-bootstrap"
import {withStyles} from "@material-ui/core/styles";

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
        console.log(event)
        this.setState({feedback: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault()
        console.log(event)

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
        const classes = this.props.classes
        return (
            <Box display={"flex"} flexDirection={'column'} justifyContent={"center"} alignItems={"center"}
                 className={classes.container}>
                <Form onSubmit={this.handleSubmit} className={classes.form}>
                    <Typography variant={'h3'}>feedback.title</Typography>
                    <Typography variant={"body1"}>feedback.info</Typography>
                    <Form.Control name="feedback" as="textarea" rows={8} value={this.state.feedback}
                                  onChange={this.handleChange}/>
                    <Button variant={'contained'} type={'Submit'} className={classes.button}>
                        <Typography>submit</Typography>
                    </Button>
                    {this.state.errors &&
                    <Alert variant={"danger"}>{this.state.errors.feedback}</Alert>
                    }
                    {this.state.success &&
                    <Alert variant={"success"}>{this.state.success}</Alert>
                    }

                </Form>
            </Box>
        )
    }
}


export default withStyles(styles)(Feedback)