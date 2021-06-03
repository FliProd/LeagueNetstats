import React from "react";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
import {useTranslation} from 'react-i18next'
import Typography from "@material-ui/core/Typography";
import LanguageChooser from "./language_chooser";

const useStyles = makeStyles({
    custom_link: {
        fontSize: 18,
        fontWeight: 400,
       '&:hover': {
            color: '#B6893A',
            textDecoration: 'none'
        }
    },
    footer: {
      paddingLeft: 20,
      paddingRight: 20
    },
    footer_text: {
        fontSize: 14,
        fontWeight: 200,
    },
    copyright: {
        width: '100%',
        textAlign: 'right'
    }
})

export default function Footer(props) {
    const classes = useStyles()
    const {t} = useTranslation()

    return (
        <Grid container direction={'column'} spacing={1} className={classes.footer}>
            <Grid item container justify={'space-between'} spacing={1} alignItems={'center'}>
                <Grid xs={6} md={7} lg={9} item container justify={"flex-start"} spacing={1} alignItems={'center'}>
                    <Grid item>
                        <Link className={classes.custom_link} href={'/home'}>{t('platform.name')}</Link>
                    </Grid>
                    <Grid item>
                        <Link className={classes.custom_link} href={'/login'}>{t('login')}</Link>
                    </Grid>
                    <Grid item>
                        <Link className={classes.custom_link} href={'/'}>{t('signup')}</Link>
                    </Grid>
                    <Grid item>
                        <Link className={classes.custom_link} href={'/feedback'}>{t('feedback.title')}</Link>
                    </Grid>
                    <Grid item>
                        <Link className={classes.custom_link} href={'/terms'}>{t('terms.title')}</Link>
                    </Grid>
                </Grid>
                <Grid xs={6} md={5} lg={3} item container justify={"flex-end"}>
                    <LanguageChooser />
                </Grid>
            </Grid>
            <Grid item>
                <Typography className={classes.footer_text} justify={'center'}>©Noah Hampp. {t('home.footer')}</Typography>
            </Grid>
        </Grid>
    )
}

