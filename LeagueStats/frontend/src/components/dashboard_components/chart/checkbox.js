import React, {Component} from "react"
import {Box, Typography} from "@material-ui/core"
import clsx from "clsx"
import {withStyles} from "@material-ui/core/styles"
import { withTranslation } from 'react-i18next'
import {CreeperScore, Gold, Exp} from "../../svg-icons";


const styles = theme => ({
    unchecked: {
        borderRadius: 5,
        borderWidth: theme.border.width,
        borderStyle: 'solid',
        borderColor: theme.palette.background.default,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
    },
    checked: {
        borderRadius: 5,
        borderWidth: theme.border.width,
        borderStyle: 'solid',
        borderColor: theme.palette.background.default,
    },
    checkbox: {
        width: 'fit-content',
        height: 28,
        cursor: 'pointer'
    },
    eventBox: {
        width: '65%',
        flexWrap: 'wrap'
    },
    graphBox: {
        width: '35%',
        flexWrap: 'wrap'
    },
    full_width: {
        width: '100%',
    },
})

class CheckboxList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: this.props.groups
        }
    }

    render() {
        const {classes, t} = this.props

        let checkbox_groups = []
        for (const [group_name, group] of Object.entries(this.props.groups)) {
            checkbox_groups.push(
                <Box display={'flex'} flexDirection={'row'} justifyContent={"stretch"}
                     alignItems={"center"} className={clsx({
                                [classes.graphBox]: this.props.title == 'dashboard.chart.graphs',
                                [classes.eventBox]: this.props.title == 'dashboard.chart.events'
                            })} key={group_name}>
                    <Typography variant={'h5'} align={'center'} className={classes.full_width}>
                        {t(this.props.title)}
                    </Typography>
                    {group.map(checkbox => {
                        const checked = this.props.checked[checkbox]
                        const icon = CheckboxList.getIcon(checkbox)

                        return (

                            <Box display={"flex"} flexDirection={'row'} className={clsx(classes.checkbox, {
                                [classes.checked]: checked,
                                [classes.unchecked]: !checked
                            })}
                                 style={checked ? {'backgroundColor': CheckboxList.getColor(checkbox)} : {}}
                                 checked={checked}
                                 py={0.5} px={1}
                                 name={checkbox} key={checkbox}
                                 onClick={(event) => {
                                     this.props.setVisibility(checkbox)
                                 }}>
                                {icon}
                                <Typography variant={'body2'}>{t(checkbox)}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            )
        }
        return checkbox_groups
    }

    static getIcon(type) {
        switch (type) {
            case 'CREEP':
                return <CreeperScore size={"xs"}/>
            case 'GOLD':
                return <Gold size={'xs'} />
            case 'EXP':
                return <Exp  size={'xs'} />
            case 'LEVEL':
            case 'NEUTRAL':
            default:
                return false
        }
    }

    static getColor(type) {
        switch (type) {
            case 'CHAMPION_KILL':
            case 'CHAMPION_DEATH':
                return '#d63d54'
            case 'WARD_PLACED':
            case 'WARD_KILL':
            case 'BUILDING_KILL':
            case 'ELITE_MONSTER_KILL':
                return '#12bf80'
            case 'ITEM_PURCHASED':
            case 'ITEM_SOLD':
            case 'ITEM_DESTROYED':
            case 'ITEM_UNDO':
                return '#6c5263'
            case 'SKILL_LEVEL_UP':
            case 'CAPTURE_POINT':
            case 'PORO_KING_SUMMON':
            case 'ASCENDED_EVENT':
                return '#f2ab39'
        }
        return '#f2ab39'
    }

}


export default withStyles(styles)(withTranslation()(CheckboxList))

