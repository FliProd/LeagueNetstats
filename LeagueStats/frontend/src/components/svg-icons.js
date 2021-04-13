import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import {withStyles} from "@material-ui/core/styles"
import clsx from "clsx"

const styles = theme => ({
    xs: {
        width: 18,
        height: 18,
    },
    md: {
        width: 25,
        height: 25,
    },
    lg: {
        width: 50,
        height: 50,
    }
})


let CreeperScore = (props) => {
    return (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <g>
            <path d="M 12.06 1.5737 C 11.96 1.4565 11.8358 1.3625 11.696 1.298 C 11.5562 1.2335 11.404 1.2001 11.25 1.2001 C 11.096 1.2001 10.9438 1.2335 10.804 1.298 C 10.6642 1.3625 10.54 1.4565 10.44 1.5737 C 8.25 4.1992 3.75 11.4006 3.75 12.6309 C 3.75 13.8611 8.61 19.3972 10.635 21.1075 C 10.8034 21.2604 11.0226 21.345 11.25 21.345 C 11.4774 21.345 11.6966 21.2604 11.865 21.1075 C 13.89 19.3972 18.75 13.8911 18.75 12.6309 C 18.75 11.3706 14.25 4.1992 12.06 1.5737 Z M 10.98 18.272 L 6.87 12.7959 C 6.8369 12.7417 6.8193 12.6794 6.8193 12.6159 C 6.8193 12.5523 6.8369 12.49 6.87 12.4358 L 8.07 10.0353 C 8.1023 9.9947 8.1434 9.9619 8.1901 9.9394 C 8.2369 9.9168 8.2881 9.9051 8.34 9.9051 C 8.3919 9.9051 8.4431 9.9168 8.4899 9.9394 C 8.5366 9.9619 8.5777 9.9947 8.61 10.0353 L 11.01 12.3908 C 11.0409 12.4235 11.078 12.4495 11.1193 12.4674 C 11.1606 12.4851 11.2051 12.4943 11.25 12.4943 C 11.2949 12.4943 11.3394 12.4851 11.3807 12.4674 C 11.422 12.4495 11.4591 12.4235 11.49 12.3908 L 13.92 9.9603 C 13.9523 9.9197 13.9934 9.8869 14.0401 9.8643 C 14.0869 9.8418 14.1381 9.8301 14.19 9.8301 C 14.2419 9.8301 14.2931 9.8418 14.3399 9.8643 C 14.3866 9.8869 14.4277 9.9197 14.46 9.9603 L 15.66 12.3608 C 15.6931 12.415 15.7107 12.4773 15.7107 12.5408 C 15.7107 12.6044 15.6931 12.6667 15.66 12.7209 L 11.52 18.272 C 11.4895 18.3153 11.4491 18.3507 11.4021 18.3751 C 11.3551 18.3994 11.303 18.4122 11.25 18.4122 C 11.197 18.4122 11.1449 18.3994 11.0979 18.3751 C 11.0509 18.3507 11.0105 18.3153 10.98 18.272 Z"/>
        </g>
    </SvgIcon>
)}
CreeperScore.displayName = 'CreeperScore'
CreeperScore.muiName = 'SvgIcon'
CreeperScore = withStyles(styles)(CreeperScore)
export {CreeperScore}


let Gold = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 21 8.4499 C 21 5.3559 17.5736 2.8498 13.3393 2.8498 C 9.105 2.8498 5.6786 5.3559 5.6786 8.4499 C 5.6647 8.6503 5.6647 8.8514 5.6786 9.0519 C 3.1854 9.9759 1.5 11.8519 1.5 14.0499 C 1.5 17.1438 4.9264 19.6499 9.1607 19.6499 C 13.395 19.6499 16.8214 17.1438 16.8214 14.0499 C 16.8352 13.8494 16.8352 13.6483 16.8214 13.4479 C 19.2729 12.5239 21 10.6339 21 8.4499 Z M 9.1607 16.9758 C 6.4725 16.9758 4.2857 15.4498 4.2857 13.4199 C 4.3618 12.8282 4.5945 12.268 4.9596 11.7976 C 5.3247 11.3272 5.8087 10.964 6.3611 10.7459 C 7.1631 11.8321 8.2199 12.7023 9.4374 13.2787 C 10.6549 13.8552 11.9953 14.1201 13.3393 14.0499 H 13.9521 C 13.5482 15.7019 11.5704 16.9758 9.1607 16.9758 Z"/>
    </SvgIcon>
)
Gold.displayName = 'Gold'
Gold.muiName = 'SvgIcon'
Gold = withStyles(styles)(Gold)
export {Gold}


let Damage = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path
            d="M 19.6071 2.8929 V 1.5 H 18.2143 V 2.8929 L 16.8214 4.2857 H 14.0357 V 2.8929 H 12.6429 V 4.2857 H 9.8571 V 2.8929 H 8.4643 V 4.2857 H 5.6786 L 4.2857 2.8929 V 1.5 H 2.8929 V 2.8929 H 1.5 V 4.2857 H 2.8929 L 4.2857 5.6786 V 8.4643 H 2.8929 V 9.8571 H 4.2857 V 11.25 H 5.6786 V 9.8571 H 8.4643 L 9.8571 8.4643 V 5.6786 H 12.6429 V 8.4643 L 1.5 16.8214 V 21 H 5.6786 L 14.0357 9.8571 H 16.8214 V 11.25 H 18.2143 V 9.8571 H 19.6071 V 8.4643 H 18.2143 V 5.6786 L 19.6071 4.2857 H 21 V 2.8929 H 19.6071 Z"/>
    </SvgIcon>
)
Damage.displayName = 'Damage'
Damage.muiName = 'SvgIcon'
Damage = withStyles(styles)(Damage)
export {Damage}


let Timer = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 0.728 0 H 10.92 C 11.648 0 11.648 0.8 11.648 0.8 c 0 3.2 -2.912 6.4 -4.368 8 c -0.728 1.6 -0.728 1.6 0 3.2 C 8.736 13.6 11.648 16.8 11.648 20 C 11.648 20 11.648 20.8 10.92 20.8 H 0.728 C 0 20.8 0 20 0 20 C 0 16.8 2.912 13.6 4.368 12 C 5.096 10.4 5.096 10.4 4.368 8.8 C 2.912 7.2 0 4 0 0.8 C 0 0.8 0 0 0.728 0 M 0.728 1.6 C 0.728 3.2 2.184 5.6 2.912 6.4 C 5.096 7.2 5.824 7.2 8.736 6.4 C 9.464 5.6 10.92 3.2 10.92 1.6 C 10.92 1.6 10.92 0.8 10.192 0.8 H 1.456 C 0.728 0.8 0.728 1.6 0.728 1.6 M 5.8917 10.8216 C 5.824 14.4 5.824 16 6.552 17.6 C 8.008 18.4 8.008 18.4 10.92 18.4 C 10.192 16 7.767 13.5936 6.8796 12.1096 C 6.5673 11.5768 6.4159 10.8216 5.8961 10.82 Z M 4.8718 12.108 C 3.9516 13.5224 1.456 16 0.728 18.4 C 3.64 18.4 3.64 18.4 5.096 17.6 C 5.824 16 5.824 14.4 5.7345 10.8152 C 5.2096 10.8088 5.0873 11.6216 4.8776 12.108"/>
    </SvgIcon>
)
Timer.displayName = 'Timer'
Timer.muiName = 'SvgIcon'
Timer = withStyles(styles)(Timer)
export {Timer}


let Exp = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 0 12.2 L 7.92 5 L 15.84 12.2 L 15.395 14.5688 L 7.92 9.8 L 0.4169 14.5166 Z M 0.5573 15.1418 L 7.92 10.7078 L 15.2964 15.1232 L 14.9843 16.709 L 7.92 13.4 L 0.8327 16.709 Z"/>
    </SvgIcon>
)
Exp.displayName = 'Exp'
Exp.muiName = 'SvgIcon'
Exp = withStyles(styles)(Exp)
export {Exp}


let TopLane = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 0 0 L 20.4 0 L 15.6 4.8 L 4.8 4.8 L 4.8 15.6 L 0 20.4 Z M 8.4 8.4 L 13.2 8.4 L 13.2 13.2 L 8.4 13.2 Z"/>
    </SvgIcon>
)
TopLane.displayName = 'TopLane'
TopLane.muiName = 'SvgIcon'
TopLane = withStyles(styles)(TopLane)
export {TopLane}


let BottomLane = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 21.6 21.6 L 1.2 21.6 L 6 16.8 L 16.8 16.8 L 16.8 6 L 21.6 1.2 Z M 13.2 13.2 L 8.4 13.2 L 8.4 8.4 L 13.2 8.4 Z"/>
    </SvgIcon>
)
BottomLane.displayName = 'BottomLane'
BottomLane.muiName = 'SvgIcon'
BottomLane = withStyles(styles)(BottomLane)
export {BottomLane}


let MidLane = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 0 0 L 15 0 L 12.6 2.4 L 2.4 2.4 L 2.4 12.6 L 0 15 Z M 19.2 9 L 21.6 6.6 L 21.6 21.6 L 6.6 21.6 L 9 19.2 L 19.2 19.2 Z M 0 21.6 L 0 18 L 18 0 L 21.6 0 L 21.6 3.6 L 3.6 21.6 L 0 21.6"/>
    </SvgIcon>
)
MidLane.displayName = 'MidLane'
MidLane.muiName = 'SvgIcon'
MidLane = withStyles(styles)(MidLane)
export {MidLane}


let JungleLane = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d="M 0 8.4 C 3.6 11.4 3.6 15.6 4.2 19.8 C 6.6 21 9 22.2 10.8 24 C 12 15 8.4 7.8 2.4 0 C 4.8 5.4 7.2 10.2 7.2 16.2 C 6 13.2 3.6 9 0 8.4 M 12.6 22.8 C 13.8 21 15 19.8 16.2 18.6 C 16.2 15 15.6 14.4 19.2 8.4 C 14.4 10.8 13.2 17.4 12.6 22.8 M 12 15.6 C 11.4 13.2 11.2 12.8 10.8 11.4 C 10.8 7.2 12 4.2 13.8 0.6 C 12.6 4.8 12 10.2 12.6 13.2 Z"/>
    </SvgIcon>
)
JungleLane.displayName = 'JungleLane'
JungleLane.muiName = 'SvgIcon'
JungleLane = withStyles(styles)(JungleLane)
export {JungleLane}


let def = (props) => (
    <SvgIcon className={clsx({[props.classes.xs]: props.size == 'xs'},
        {[props.classes.md]: props.size == 'md'},
        {[props.classes.lg]: props.size == 'lg'})}>
        <path d=""/>
    </SvgIcon>
)
def.displayName = 'def'
def.muiName = 'SvgIcon'
def = withStyles(styles)(def)
export {def}

