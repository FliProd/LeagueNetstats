import React, {Component, Fragment} from "react"
import {axiosInstance} from "../../axiosApi"
import {Alert, Image} from "react-bootstrap"
import {StatusCodes} from 'http-status-codes'
import TextField from "@material-ui/core/TextField"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import Typography from "@material-ui/core/Typography"
import {withTranslation} from "react-i18next";
import {useTranslation} from "react-i18next";


function Summoner(props) {
    const {t} = useTranslation()
    const icon_url = '/static/img/profileicon/' + props.icon_id + '.png'

    return (
        <Fragment>
            <ListItemAvatar>
                <Box pr={1}>
                    <Image width={"60px"} src={icon_url} roundedCircle/>
                </Box>
            </ListItemAvatar>
            <ListItemText primary={props.name + '  -  ' + t('level') + ' ' + props.level} secondary={t(props.region)}/>
            <Divider/>
        </Fragment>
    )
}

class SummonerList extends Component {
    constructor(props) {
        super(props)
        const { t } = props
        this.state = {
            possible_accounts: [{
                'name': t('summonername'),
                'puuid': '',
                'icon_id': 29,
                'level': '',
                'region': t('region')
            }],
            account: -1,
            loading: props.loading,
            name: !props.askname && props.name,
            typing_timeout: "",
            askName: props.askname,
        }

        this.handleChange = this.handleChange.bind(this)
        this.getSummonerInfo = this.getSummonerInfo.bind(this)
        this.handleChooseSummoner = this.handleChooseSummoner.bind(this)
        this.handleNoReply = this.handleNoReply.bind(this)
        this.renderSummoner = this.renderSummoner.bind(this)

    }

    handleChange(event) {
        if (this.state.typing_timeout) {
            clearTimeout(this.state.typing_timeout)
        }
        this.setState({
            name: event.target.value,
            typing_timeout: setTimeout(() => this.getSummonerInfo(this.state.name), 1000),
        })
    }

    async getSummonerInfo(name) {
        const timeout = setTimeout(this.handleNoReply, 30000)
        this.setState({loading: true})
        try {
            const response = await axiosInstance.get('/riotapi/summoner/'.concat(name))
            clearTimeout(timeout)

            this.setState({
                possible_accounts: response.data.possible_accounts,
                loading: false,
            })
        } catch (error) {
            if (response.status == StatusCodes.NOT_FOUND) {
                this.setState({
                    loading: false,
                    errors: {account: "summoner.no_summoner_found"},
                })
            }
            clearTimeout(timeout)
        }
    }

    handleNoReply() {
        this.setState({
            loading: false,
            errors: {account: "summoner.api_problem"},
        })
    }

    handleChooseSummoner(index) {
        if (this.state.account == index) {
            this.setState({account: -1})
        } else {
            this.setState({account: index})
            this.props.setSummoner(this.state.possible_accounts[index])
        }
    }

    renderSummoner(summoner, index, marked) {
        let style
        if (marked) {
            style = {'backgroundColor': "#919191"}
        }
        return (
            <ListItem style={style} key={summoner.region} button onClick={() => this.handleChooseSummoner(index)}>
                <Summoner
                    name={summoner.name}
                    level={summoner.level}
                    region={summoner.region}
                    icon_id={summoner.icon_id}
                />
            </ListItem>
        )
    }

    render() {
        const {t} = this.props

        let list = this.state.possible_accounts.map((summoner, index) => {
            return this.renderSummoner(summoner, index, (index == this.state.account))
        })

        if (this.state.loading) {
            list = (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <CircularProgress style={{"color": "white"}}/>
                </Box>
            )
        }

        let userinterface
        //load textfield for typing name
        if (this.state.askName) {
            userinterface = (
                <Fragment>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography pb={1}>{t('summoner.find_and_mark')}</Typography>
                    </Box>
                    <TextField size={"small"} label={t("summonername")} variant="outlined"
                               fullWidth name={"name"} autoComplete={'off'}
                               onChange={this.handleChange}
                    />
                </Fragment>
            )
        } else {
            userinterface = (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Typography pb={1}>{t('summoner.mark')}</Typography>
                </Box>)
        }
        return (
            <Fragment>
                <Box>
                    {userinterface}
                </Box>
                <List style={this.style}>
                    {list}
                </List>
                {this.state.errors && this.state.errors.account &&
                <Alert variant={"danger"}>{t(this.state.errors.account)}</Alert>}
            </Fragment>
        )
    }
}
export default withTranslation('translation',{withRef: true})(SummonerList)

