import React, {Component} from "react";
import {Box, ButtonBase, Grid} from "@material-ui/core";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
import {useTranslation, withTranslation} from 'react-i18next'
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import i18n from "i18next";

const styles = theme => ({
    white_border: {
        borderWidth: theme.border.width,
        borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: 5,
        '&:hover': {
            color: '#B6893A',
            borderColor: '#B6893A',
            textDecoration: 'none'
        }
    },
})

class LanguageChooser extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {classes, t} = this.props
        const handleLanguage = (new_language) => {
            i18n.changeLanguage(new_language)
        }
        return (
            <Grid item container xs={8}>
                <Grid item xs={4} onClick={() => handleLanguage('en')}>
                    <ButtonBase>
                        <Box className={classes.white_border}>
                            <Typography>English</Typography>
                        </Box>
                    </ButtonBase>
                </Grid>
                <Grid item xs={4} onClick={() => handleLanguage('de')}>
                    <ButtonBase>
                        <Box className={classes.white_border}>
                            <Typography>Deutsch</Typography>
                        </Box>
                    </ButtonBase>
                </Grid>
                <Grid item xs={4} onClick={() => handleLanguage('es')}>
                    <ButtonBase>
                        <Box className={classes.white_border}>
                            <Typography>Español</Typography>
                        </Box>
                    </ButtonBase>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withTranslation()(LanguageChooser))
