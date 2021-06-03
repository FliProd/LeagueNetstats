import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
import {useTranslation} from 'react-i18next'
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
    custom_link: {
        '&:hover': {
            color: '#B6893A',
            textDecoration: 'none'
        },
    },
    title: {
        padding: 10,
        marginRight: 20,
        marginLeft: 30,
        marginBottom: 20,
    },
})

export default function Header(props) {
    const classes = useStyles()
    const {t} = useTranslation()

    return (
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} className={classes.title}>
            <Box justifyContent={'right'}>
                <Link variant={'h2'} href={'/'} className={classes.custom_link}>{t('platform.name')}</Link>
            </Box>
            <Box display={'flex'} justifyContent={'left'} alignItems={'center'}>
                <Typography variant={'h4'}>{t(props.subtitle)}</Typography>
            </Box>
        </Box>
    )
}

