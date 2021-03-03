import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {CheckBox} from "@material-ui/icons";
import {Box, Checkbox, Grid, Typography} from "@material-ui/core";

class CheckboxList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: {
                'MATCH_GRAPHS': [],
                'NETWORK_GRAPHS': [],
                'MATCH_EVENTS': []
            }
        }
        this.getGroup = this.getGroup.bind(this)

        Object.keys(this.props.checked).map((name, index) => {
            this.state.groups[this.getGroup(name)].push({name: name, index: index})
        })
    }


    getGroup(name) {
        const groups = {
            'MATCH_GRAPHS': ['EXP', 'GOLD', 'CREEP', 'NEUTRAL', 'LEVEL'],
            'NETWORK_GRAPHS': ['IN_BANDWIDTH', 'OUT_BANDWIDTH', 'PING', 'JITTER', 'LOSS'],
            'MATCH_EVENTS': ['CHAMPION_KILL', 'CHAMPION_DEATH', 'WARD_PLACED', 'WARD_KILLED', 'BUILDING_KILL', 'ELITE_MONSTER_KILL', 'ITEM_PURCHASED', 'ITEM_SOLD', 'ITEM_DESTROYED', 'ITEM_UNDO', 'SKILL_LEVEL_UP', 'CAPTURE_POINT', 'PORO_KING_SUMMON', 'ASCENDED_EVENT']
        }

        for (let group_name in groups) {
            if (groups[group_name].includes(name)) {
                return group_name
            }
        }
        return false
    }

    render() {
        const checkbox_groups = []
        for (const [group_name, group] of Object.entries(this.state.groups)) {
            checkbox_groups.push(
                <Box border={1}>
                    <Box display={"flex"} justifyContent={"center"} pt={1}>
                        <Typography>{group_name}</Typography>
                    </Box>
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        {group.map(checkbox => {
                            const checked = this.props.checked[checkbox.name];
                            const background_color = checked ? "#000000" : "#FFFFFF"
                            const textcolor = checked ? "#FFFFFF" : "#000000"
                            return (
                                <Grid item>

                                    <Box style={{"cursor": "pointer", color: textcolor, backgroundColor: background_color}} checked={checked}
                                         py={0.5} px={1}
                                         name={checkbox.name} key={checkbox.index}
                                         onClick={(event) => {
                                             this.props.setVisibility(checkbox.name)
                                         }}>
                                        {checkbox.name}
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            )
        }
        return (
            <Box>
                {checkbox_groups}
            </Box>
        )
    }

}


export default CheckboxList;

