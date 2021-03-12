import {axiosInstance} from "../../axiosApi";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box"
import React, {Component, Fragment} from 'react'

class Logout extends Component {
    constructor(props) {
        super(props);
        this.handleLogout()
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post('/api/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            //window.location.href = '/login/'
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} style={{'width': '100%', 'height': '100%'}}>
                <Typography>Goodbye</Typography>
            </Box>
        )
    }
}

export default Logout
