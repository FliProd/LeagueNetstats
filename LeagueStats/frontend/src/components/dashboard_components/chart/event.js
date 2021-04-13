import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Box from "@material-ui/core/Box";
import {Grid, Typography} from "@material-ui/core";
import { withTranslation } from 'react-i18next'

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderers: {
                'CHAMPION_KILL': this.renderChampionKill,
                'CHAMPION_DEATH': this.renderChampionKill,
                'WARD_PLACED': this.renderObjectInteraction,
                'WARD_KILL': this.renderObjectInteraction,
                'BUILDING_KILL': this.renderObjectInteraction,
                'ELITE_MONSTER_KILL': this.renderObjectInteraction,
                'ITEM_PURCHASED': this.renderItem,
                'ITEM_SOLD': this.renderItem,
                'ITEM_DESTROYED': this.renderItem,
                'ITEM_UNDO': this.renderItem,
                'SKILL_LEVEL_UP': this.renderSkill,
                'CAPTURE_POINT': this.renderCapturePoint,
                'PORO_KING_SUMMON': this.renderPoroKing,
                'ASCENDED_EVENT': this.renderAscendedEvent,
            }
        }
        this.renderChampionKill = this.renderChampionKill.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.renderSkill = this.renderSkill.bind(this)
        this.renderObjectInteraction = this.renderObjectInteraction.bind(this)
    }

    static renderProfileIcon(icon_id) {
        const url = '/static/img/profileicon/' + icon_id + '.png'
        return <Image width={"40px"} src={url}/>
    }

    static renderItemIcon(item_id) {
        const url = '/static/img/item/' + item_id + '.png'
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
                <Image width={"60px"} src={url} rounded/>
            </Box>
        )
    }

    static renderParticipant(participant) {
        return (
            <Grid container direction={"column"} justify="center" alignItems="center">
                <Grid item xs={8}>
                    <Box pt={1}>
                        {Event.renderProfileIcon(participant.profile_icon_id)}
                    </Box>
                </Grid>
                <Grid container item alignItems={"center"} justify={"center"}>
                    <Typography noWrap={true} style={{overflow: 'hidden'}}>{participant.name}</Typography>
                </Grid>
            </Grid>
        )
    }


    //champion_kill, champion_death
    renderChampionKill(event, translator) {
        const t = translator

        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.passive_participant = Event.renderParticipant(event.passive_participant)
        event_parts.relation = (<Typography> {t('event.killed')} </Typography>)
        event_parts.additional_info = event.assisting_participants.length > 0 ? (
            <Grid container direction={'row'}>
                <Grid item xs={4}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                         height={"100%"}>
                        <Typography>{t('event.assisted_by')}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"} height={"100%"}>
                        {event.assisting_participants.map(assist => (
                            <Grid item xs={12 / event.assisting_participants.length} key={assist.name}>
                                {Event.renderParticipant(assist)}
                            </Grid>))
                        }
                    </Grid>
                </Grid>
            </Grid>
        ) : false

        event_parts.len_act_part = 2
        event_parts.len_relation = 2
        event_parts.len_pass_part = 2
        event_parts.len_add_info = event.assisting_participants.length > 0 ? 6 : 0

        return event_parts
    }

    //ward_kill, building_kill, elite_monster_kill, ward_placed
    renderObjectInteraction(event, translator) {
        const t = translator

        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        switch (event.type) {
            case 'WARD_KILL':
                event_parts.relation = (<Typography> {t('event.killed')} </Typography>)
                event_parts.passive_participant = (<Typography> {t('event.a_ward')} </Typography>)
                break
            case 'WARD_PLACED':
                event_parts.relation = (<Typography> {t('event.placed')} </Typography>)
                event_parts.passive_participant = (<Typography> {t('event.a_ward')} </Typography>)
                break
            case 'ELITE_MONSTER_KILL':
                event_parts.relation = (<Typography> {t('event.killed')} </Typography>)
                event_parts.passive_participant = (<Typography> {event.passive_participant} </Typography>)
                break
            case 'BUILDING_KILL':
                event_parts.relation = (<Typography> {t('event.destroyed')} </Typography>)
                event_parts.passive_participant = (<Typography> {t(event.passive_participant)} </Typography>)
                break
            default:
                event_parts.relation = 'no matching type'
        }
        event_parts.additional_info = null

        event_parts.len_act_part = 5
        event_parts.len_relation = 2
        event_parts.len_pass_part = 5
        event_parts.len_add_info = 0

        return event_parts
    }

    renderSkill(event, translator) {
        const t = translator

        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.relation = (<Typography> {t('event.leveled_up')} </Typography>)
        event_parts.passive_participant = null
        event_parts.additional_info = null

        event_parts.len_act_part = 6
        event_parts.len_relation = 6
        event_parts.len_pass_part = 0
        event_parts.len_add_info = 0

        return event_parts

    }

    //item_purchased, item_sold, item_destroyed, item_undo,
    renderItem(event, translator) {
        const t = translator

        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.passive_participant = Event.renderItemIcon(event.passive_participant)
        switch (event.type) {
            case 'ITEM_PURCHASED':
                event_parts.relation = event_parts.relation = (<Typography> {t('event.purchased')} </Typography>)
                break
            case 'ITEM_SOLD':
                event_parts.relation = event_parts.relation = (<Typography> {t('event.sold')} </Typography>)
                break
            case 'ITEM_UNDO':
                event_parts.relation = event_parts.relation = (<Typography> {t('event.undid')} </Typography>)
                break
            case 'ITEM_DESTROYED':
                event_parts.relation = event_parts.relation = (<Typography> {t('event.destroyed')} </Typography>)
                break
            default:
                event_parts.relation = 'no matching type'
        }
        event_parts.additional_info = null

        event_parts.len_act_part = 5
        event_parts.len_relation = 2
        event_parts.len_pass_part = 5
        event_parts.len_add_info = 0

        return event_parts
    }

    //TODO rare events
    renderCapturePoint() {

    }

    renderPoroKing() {

    }

    renderAscendedEvent() {

    }

    renderTime(time_dec) {
        let minutes = parseInt(time_dec)
        let seconds = Math.round(((time_dec - parseInt(time_dec)) * 60))
        minutes = minutes >= 10 ? minutes : '0' + minutes
        seconds = seconds >= 10 ? seconds : '0' + seconds
        const time = minutes + ':' + seconds
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                 height={"100%"}>
                <Typography variant={'h5'}>{time}</Typography>
            </Box>
        )
    }

    render() {
        if (this.props.event != undefined) {
            const { t } = this.props

            const rendered_event = this.state.renderers[this.props.event.type](this.props.event, t)
            const time = this.renderTime(Event.translateTime(this.props.event.time))
            return (
                <Box>
                    <Grid container>
                        <Grid item xs={1}>
                            {time}
                        </Grid>
                        <Grid container direction={"row"} item xs={11}>
                            <Grid item xs={rendered_event.len_act_part} key={'active_participant'}>
                                {rendered_event.active_participant}
                            </Grid>
                            <Grid item xs={rendered_event.len_relation} key={'relation'}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                                     height={"100%"}>
                                    {rendered_event.relation}
                                </Box>
                            </Grid>
                            {rendered_event.passive_participant &&
                            <Grid item xs={rendered_event.len_pass_part} key={'passive_participant'}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                                     height={"100%"}>
                                    {rendered_event.passive_participant}
                                </Box>

                            </Grid>}
                            {rendered_event.additional_info &&
                            <Grid item xs={rendered_event.len_add_info} key={'additional_info'}>
                                {rendered_event.additional_info}
                            </Grid>}
                        </Grid>
                    </Grid>
                </Box>
            )
        } else {
            return null
        }
    }

    static translateTime(time) {
        return time / 1000 / 60
    }
}

export default withTranslation()(Event)