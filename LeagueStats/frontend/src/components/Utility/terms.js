import React, {Component} from "react"
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Examplechart from "../dashboard_components/chart/examplechart";
import Exampleplot from "../dashboard_components/exampleplot";
import Ranking from "../dashboard_components/ranking";
import clsx from "clsx";
import Signup from "../user/signup";
import { withTranslation } from 'react-i18next'
import Link from '@material-ui/core/Link'
import Header from "./header";
import Footer from "./footer";

const styles = theme => ({
    root: {
        backgroundColor: '#14253D',
    },
    title: {
        padding: 10,
        marginRight: 20,
        marginLeft: 30,
        marginBottom: 20,
    },
    subtitle: {
        marginTop: 10,
    },
    navigation: {
        marginLeft: 30,
    },
    custom_link: {
       '&:hover': {
            color: '#B6893A',
            textDecoration: 'none'
        }
    },
    disclaimer: {
        paddingLeft: '10%',
        paddingRight: '10%',
        marginBottom: 40,
    }
})

class Terms extends Component {
    constructor(props) {
        super(props)
        this.state = {}

    }


    render() {
        const {classes, t} = this.props

        return (
            <Grid container direction={'column'} alignItems={'stretch'} justify={'center'} className={classes.root}>
                <Grid item key={'title'}>
                    <Header subtitle={'terms.title'}/>
                </Grid>
                <Grid item container direction={'column'} justify={'flex-start'} alignItems={'flex-start'} key={'disclaimer'} className={classes.disclaimer}>
                   <Grid item xs={10} key={'study'}>
                       <Typography mt={5} variant={'h5'} className={classes.subtitle}>{t('terms.study.title')}</Typography>
                       <Typography>{t('terms.study')}</Typography>
                   </Grid>
                    <Grid item xs={10} key={'privacy'}>
                        <Typography mt={5} variant={'h5'} className={classes.subtitle}>{t('terms.privacy.title')}</Typography>
                       <Typography>{t('terms.privacy')}</Typography>
                   </Grid>
                    <Grid item xs={10} key={'participant'}>
                        <Typography mt={5} variant={'h5'}>{t('terms.participant.title')}</Typography>
                       <Typography>{t('terms.participant')}</Typography>
                   </Grid>
                    <Grid item xs={10} key={'terms'}>
                        <Typography mt={5} variant={'h5'} className={classes.subtitle}>{t('terms.terms.title')}</Typography>
                       <Typography>{t('terms.terms')}</Typography>
                   </Grid>
                    <Grid item xs={10} key={'questions'}>
                        <Typography mt={5} variant={'h5'} className={classes.subtitle}>{t('terms.questions.title')}</Typography>
                       <Typography>{t('terms.questions')}</Typography>
                   </Grid>
                    <Grid item xs={10} key={'service'}>
                        <Typography mt={5} variant={'h5'} className={classes.subtitle}>{t('terms.service.title')}</Typography>
                       <Typography>{t('terms.service')}</Typography>
                   </Grid>
                </Grid>
                <Grid item key={'footer'}>
                    <Footer />
                </Grid>
            </Grid>

        )
    }
}


export default withStyles(styles)(withTranslation()(Terms))