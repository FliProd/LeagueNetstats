import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Box from "@material-ui/core/Box";
import {Grid, Typography} from "@material-ui/core";
import ApexChart from "./chart";

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderers: {
                'CHAMPION_KILL': this.renderChampionKill,
                'CHAMPION_DEATH': this.renderChampionKill,
                'WARD_PLACED': this.renderObjectInteraction,
                'WARD_KILLED': this.renderObjectInteraction,
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
    }

    static renderProfileIcon(icon_id) {
        const url = 'https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/' + icon_id + '.png'
        return <Image width={"40px"} src={url}/>
    }

    static renderItemIcon(item_id) {
        const url = 'http://ddragon.leagueoflegends.com/cdn/11.4.1/img/item/' + item_id + '.png'
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
                <Image width={"60px"} src={url}/>
            </Box>
        )
    }

    static renderParticipant(participant) {
        return (
            <Grid container direction={"column"} justify="center" alignItems="center">
                <Grid item md={8} >
                    <Box pt={1}>
                        {Event.renderProfileIcon(participant.profile_icon_id)}
                    </Box>
                </Grid>
                <Grid container item md={4} alignItems={"center"} justify={"center"}>
                    <Typography>{participant.name}</Typography>
                </Grid>
            </Grid>
        )
    }


    //champion_kill, champion_death
    renderChampionKill(event) {
        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.passive_participant = Event.renderParticipant(event.passive_participant)
        event_parts.relation = (<Typography> killed </Typography>)
        event_parts.additional_info = (
            <Grid container direction={"row"} justify={"center"} alignItems={"center"} height={"100%"}>
                {event.assisting_participants.map(assist => (
                    <Grid item md={12 / event.assisting_participants.length}>
                        {Event.renderParticipant(assist)}
                    </Grid>))
                }
            </Grid>
        )

        event_parts.len_act_part = 3
        event_parts.len_relation = 1
        event_parts.len_pass_part = 3
        event_parts.len_add_info = 5

        return event_parts
    }

    //ward_killed, building_kill, elite_monster_kill, ward_placed
    renderObjectInteraction(event) {
        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        switch (event.type) {
            case 'WARD_KILLED':
                event_parts.relation = (<Typography> killed </Typography>)
                event_parts.passive_participant = (<Typography>a Ward </Typography>)
                break
            case 'WARD_PLACED':
                event_parts.relation = (<Typography> placed </Typography>)
                event_parts.passive_participant = (<Typography>a Ward </Typography>)
                break
            case 'ELITE_MONSTER_KILL':
                event_parts.relation = (<Typography> killed </Typography>)
                event_parts.passive_participant = (<Typography> {event.passive_participant} </Typography>)
                break
            case 'BUILDING_KILL':
                event_parts.relation = (<Typography> destroyed </Typography>)
                event_parts.passive_participant = (<Typography> {event.passive_participant} </Typography>)
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

    renderSkill(event) {
        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.relation = (<Typography> Leveled Up </Typography>)
        event_parts.passive_participant = null
        event_parts.additional_info = null

        event_parts.len_act_part = 6
        event_parts.len_relation = 6
        event_parts.len_pass_part = 0
        event_parts.len_add_info = 0

        return event_parts

    }

    //item_purchased, item_sold, item_destroyed, item_undo,
    renderItem(event) {
        let event_parts = {}
        event_parts.active_participant = Event.renderParticipant(event.active_participant)
        event_parts.passive_participant = Event.renderItemIcon(event.passive_participant)
        console.log(event.type)
        switch (event.type) {
            case 'ITEM_PURCHASED':
                event_parts.relation = event_parts.relation = (<Typography> purchased </Typography>)
                break
            case 'ITEM_SOLD':
                event_parts.relation = event_parts.relation = (<Typography> sold </Typography>)
                break
            case 'ITEM_UNDO':
                event_parts.relation = event_parts.relation = (<Typography> undid </Typography>)
                break
            case 'ITEM_DESTROYED':
                event_parts.relation = event_parts.relation = (<Typography> destroyed </Typography>)
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
        const time = parseInt(time_dec) + ':' + Math.round(((time_dec - parseInt(time_dec)) * 60))
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                 height={"100%"}>
                <Typography>{time}</Typography>
            </Box>
        )
    }

    render() {
        if (this.props.event != undefined) {
            const rendered_event = this.state.renderers[this.props.event.type](this.props.event)
            const time = this.renderTime(ApexChart.translateTime(this.props.event.time))
            return (
                <Box border={1}>
                    <Grid container>
                        <Grid item md={1}>
                            {time}
                        </Grid>
                        <Grid container direction={"row"} item md={10}>
                            <Grid item md={rendered_event.len_act_part}>
                                {rendered_event.active_participant}
                            </Grid>
                            <Grid item md={rendered_event.len_relation}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"}
                                     height={"100%"}>
                                    {rendered_event.relation}
                                </Box>
                            </Grid>
                            {rendered_event.passive_participant &&
                            <Grid item md={rendered_event.len_pass_part}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>

                                {rendered_event.passive_participant}
                            </Box>

                            </Grid>}
                            {rendered_event.additional_info &&
                            <Grid item md={rendered_event.len_add_info}>
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
}

export default Event