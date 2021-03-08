import React, {Component, Fragment} from "react";
import {axiosInstance} from "../axiosApi";
import {CheckBox} from "@material-ui/icons";
import {Box, Checkbox, Grid, Typography} from "@material-ui/core";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    unchecked: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
    },
    checked: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
    },
    checkbox: {
        width: 'min-content',
        height: 'min-content',
        flexGrow: 1
    },
    containerBox: {
        width: '100%',
        flexWrap: 'wrap'
    }
})

class CheckboxList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: this.props.groups
        }
    }

    render() {
        const classes = this.props.classes
        let checkbox_groups = []
        for (const [group_name, group] of Object.entries(this.props.groups)) {
            checkbox_groups.push(
                <Box display={'flex'} flexDirection={this.props.direction} justifyContent={"center"} alignItems={"center"} className={classes.containerBox}>
                    {group.map(checkbox => {
                        const checked = this.props.checked[checkbox];
                        return (

                            <Box display={"flex"} className={clsx(classes.checkbox, {
                                [classes.checked]: checked,
                                [classes.unchecked]: !checked
                            })}
                                 checked={checked}
                                 py={0.5} px={1}
                                 name={checkbox} key={checkbox}
                                 onClick={(event) => {
                                     this.props.setVisibility(checkbox)
                                 }}>
                                <Typography variant={'body2'}>{checkbox}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            )
        }
        return checkbox_groups
    }

}


export default withStyles(styles)(CheckboxList);

