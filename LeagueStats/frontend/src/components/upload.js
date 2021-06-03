import React, {Component, Fragment} from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import {Alert} from "react-bootstrap"
import {axiosInstance} from "../axiosApi"
import {withStyles} from "@material-ui/core/styles"
import LinearProgress from '@material-ui/core/LinearProgress';
import {withTranslation} from 'react-i18next'
import List from "@material-ui/core/List";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
    border: {
        borderWidth: theme.border.width,
        borderColor: theme.border.color,
        borderStyle: 'solid',
        borderRadius: '5px',
        height: '100%'
    },
    control: {
        marginLeft: 15,
        marginRight: 15
    },
    progressbar: {
        width: 200,
    },
    instructions: {
        paddingTop: 15,
        paddingLeft: '10%',
        paddingRight: '10%',
    },
    steps: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    accordion: {
        boxShadow: 0,
        width: '80%',
    },
    full_height: {
        height: '100%',
    }
})

class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            matches: [],
            date_match_map: {},
            found: false,
            searched: false,
            cancelled: false,
            progress: 0,
            successes: 0,
            failures: 0,
            uploading: false,
            uploaded: false,
            file_errors: []
        }

        this.onDrop = this.onDrop.bind(this)
        this.onDragEnter = this.onDragEnter.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.findFileRecursive = this.findFileRecursive.bind(this)
        this.onWebkit = this.onWebkit.bind(this)
        this.parseDate = this.parseDate.bind(this)
        this.setGameId = this.setGameId.bind(this)
        this.directoryCallback = this.directoryCallback.bind(this)
        this.fileCallback = this.fileCallback.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderInstructions = this.renderInstructions.bind(this)
    }

    //---------------------------- File System Access API (DirectoryPicker) ----------------------------
    //better use the other api as drag and drop works bette rand we also have a directorypciker

   /* async listAllFilesAndDirs(dirHandle) {
        const files = [];
        for await (let [name, handle] of dirHandle) {
            const {kind} = handle;
            if (handle.kind === 'directory') {
                await this.listAllFilesAndDirs(handle)
            } else if (file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_netlog.txt/)) {
                this.setState(prevstate => {
                    let newfiles = [...prevstate.files, file]
                    let newmatches = [...prevstate.matches, this.parseDate(file.name)]
                    return {
                        files: newfiles,
                        matches: newmatches,
                        found: true,
                        searched: true,
                        cancelled: false,
                    }
                })
            } else if (file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_r3dlog.txt/)) {
                this.setGameId(file)
            }
        }
        return files;
    }

    async onClickHandler(e) {
        try {
            const directoryHandle = await window.showDirectoryPicker()
            const files = await this.listAllFilesAndDirs(directoryHandle);
            console.log('files', files);
        } catch (e) {
            console.log(e);
        }
    }
*/


    //---------------------------- File and Directory Entries API (Drag&Drop) ----------------------------

    fileCallback(file) {
        if (file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_netlog.txt/)) {
            this.setState(prevstate => {
                let newfiles = [...prevstate.files, file]
                let newmatches = [...prevstate.matches, this.parseDate(file.name)]
                return {
                    files: newfiles,
                    matches: newmatches,
                    found: true,
                    searched: true,
                    cancelled: false,
                }
            })
        } else if (file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_r3dlog.txt/)) {
            this.setGameId(file)
        }
    }

    directoryCallback(entries) {
        for (let i = 0; i < entries.length; i++) {
            this.findFileRecursive(entries[i])
        }
    }

    findFileRecursive(item) {
        if (item.isFile) {
            item.file(this.fileCallback)
        } else if (item.isDirectory) {
            let dirReader = item.createReader()
            let length = dirReader.readEntries(this.directoryCallback)
            while(length > 0) {
                length = dirReader.readEntries(this.directoryCallback)
            }
        }
    }

    onDrop(event) {
        event.stopPropagation()
        event.preventDefault()
        this.setState({searching: true})

        var items = event.dataTransfer.items
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry()
            if (item) {
                this.findFileRecursive(item)
                setTimeout(() => this.setState({searched: true, searching: false}), 10000)
            }
        }
    }


    onDragEnter(event) {
        event.stopPropagation()
        event.preventDefault()
    }

    onDragOver(event) {
        event.stopPropagation()
        event.preventDefault()
    }

    //---------------------------- File and Directory Entries API (Input with Webkitdirectory) ----------------------------
    onWebkit(event) {
        event.stopPropagation()
        event.preventDefault()
        this.setState({searching: true})
        console.log('searching')

        let files = event.target.files

        files = Array.from(files)
        let netlogs = files.filter((file) => {
            return file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_netlog.txt/)
        })
        let r3dlogs = files.filter((file) => {
            return file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_r3dlog.txt/)
        })
        r3dlogs.forEach(file => {
            return this.setGameId(file)
        })

        const dates = netlogs.map((file) => {
            return this.parseDate(file.name)
        })

        this.setState({
            files: netlogs,
            matches: dates,
            found: dates.length > 0,
            searched: true,
            cancelled: false,
            searching: false,
        })
    }



    //----------------------------------------------------------------------

    parseDate(fileName) {
        fileName = fileName.replace("_netlog.txt", "")
        let dateArray = fileName.split(/-|T/)
        return dateArray[0] + '.' + dateArray[1] + '.' + dateArray[2] + '   ' + dateArray[3] + ':' + dateArray[4]
    }

    async setGameId(file) {
        const reader = new FileReader()
        var obj = this
        reader.readAsText(file)
        reader.onload = ((event) => {

            let lines = reader.result.split('\n')
            const date = Upload.dateFromName(file.name)

            for (let i = 1; i < lines.length; i++) {
                let id = lines[i].match(/-GameID=\d*/)
                let region = lines[i].match(/-PlatformID=\w*\d*/)
                if (id != null) {
                    obj.setState(prevstate => {
                        prevstate.date_match_map[date] = {
                            id: id[0].replace("-GameID=", ''),
                            region: region[0].replace("-PlatformID=", '')
                        }
                    })
                    return
                }
            }
        })
    }

    static dateFromName(name) {
        return name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/)[0]
    }

    async handleSubmit() {
        this.setState({
            uploading: true,
            total: this.state.files.length
        })
        const progress_per_file = 100 / this.state.files.length

        this.state.files.forEach((file, index) => {
            let formdata = new FormData()
            formdata.append('netlog', file)

            const date = Upload.dateFromName(file.name)
            formdata.append('match_id', JSON.stringify(this.state.date_match_map[date]['id']))
            formdata.append('region', JSON.stringify(this.state.date_match_map[date]['region']))

            axiosInstance.post('riotapi/match/create/', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                this.setState(prevstate => {
                    prevstate.progress += progress_per_file
                    prevstate.successes += 1
                    prevstate.total -= 1
                    prevstate.uploaded = prevstate.total == 0
                    return prevstate
                })
            }).catch(error => {
                this.setState(prevstate => {
                    prevstate.progress += progress_per_file
                    prevstate.failures += 1
                    prevstate.total -= 1
                    prevstate.uploaded = prevstate.total == 0
                    console.log(error)
                    return prevstate
                })
            })
        })
    }

    renderInstructions() {
        const { classes, t } = this.props
        const mac_steps = ['upload.mac_step_1', 'upload.mac_step_2', 'upload.mac_step_3', 'upload.mac_step_4']
        const windows_steps = ['upload.windows_step_1', 'upload.windows_step_2', 'upload.windows_step_3', 'upload.windows_step_4']
        const renderStep = (step) => {
            return (
                <ListItem key={step} alignItems={'flex-start'}>
                    <ListItemIcon>
                        <DoubleArrowIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t(step)}/>
                </ListItem>
            )
        }
        return (
            <Grid item container className={classes.instructions} direction={'column'} spacing={5}
                  alignItems={'flex-start'} justify={'center'}>
                <Grid item>
                    <Typography variant={'h3'}>{t('upload.title')}</Typography>
                    <Typography>{t('upload.information')}</Typography>
                </Grid>
                <Grid item className={classes.steps}>
                    <Accordion className={clsx(classes.accordion, classes.border)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant={'h4'}>{t('upload.mac_title')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction={'column'}>
                                <Grid item container display={'flex'} justify={'center'} alignItems={'center'}>
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/JLs8XtaUhXs?autoplay=0&showinfo=0"
                                            title="YouTube video player" frameBorder="0"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen></iframe>
                                </Grid>
                                <Grid item>
                                    <List>
                                        {mac_steps.map(step => renderStep(step))}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item className={classes.steps}>
                    <Accordion className={clsx(classes.accordion, classes.border)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant={'h4'}>{t('upload.windows_title')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction={'column'}>
                                <Grid item container display={'flex'} justify={'center'} alignItems={'center'}>
                                    <iframe width="560" height="315"
                                            src="https://www.youtube.com/embed/qJtGJOeAahA?autoplay=0&showinfo=0"
                                            title="YouTube video player" frameBorder="0"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen></iframe>
                                </Grid>
                                <Grid item>
                                    <List>
                                        {windows_steps.map(step => renderStep(step))}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        )

    }

    render() {
        const {classes, t} = this.props

        const matchList = this.state.matches
        const num_matches = matchList.length

        const searching = this.state.searching
        const found = this.state.found
        const uploading = this.state.uploading
        const uploaded = this.state.uploaded

        let filePrompt
        /*if (found && !uploading && !uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        {t('upload.ask.part1')} {num_matches} {t('upload.ask.part2')}?
                    </Typography>
                    <Box mx={"auto"}>
                        <Button variant={"contained"} className={classes.control} type={"Submit"}
                                onClick={this.handleSubmit}>
                            {t('upload.upload')}
                        </Button>
                        <Button variant={"contained"} className={classes.control}
                                onClick={() => this.setState({
                                    matches: [],
                                    files: [],
                                    date_match_map: {},
                                    found: false,
                                    cancelled: true
                                })}>
                            <Typography>{t('cancel')}</Typography>
                        </Button>
                    </Box>
                </Box>
            )
        }*/

        if(!found && !uploading && !uploaded) {
            filePrompt = (
                <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                    {!searching &&
                    <Fragment>
                        <Grid item>
                            <Typography>{t('upload.drag_and_drop')}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>{t('or')}</Typography>
                        </Grid>
                        <Grid item className={"filepicker"}>
                            <input type="file" id="filepicker" name="fileList" webkitdirectory={"true"} multiple
                                   onChange={this.onWebkit}/>
                        </Grid>
                    </Fragment>
                    }
                    {searching &&
                    <Grid item>
                        <CircularProgress style={{"color": "white"}} size={25}/>
                    </Grid>
                    }
                    <Grid item container display={"flex"} alignItems={"center"} justify={"center"}>
                        {found == false && this.state.searched == true && this.state.cancelled == false &&
                        <Alert variant={"danger"}><Typography>{t('upload.no_logs')}</Typography></Alert>}
                    </Grid>
                </Grid>
            )
        } else if (found && !uploading && !uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        {t('upload.ask.part1')}
                    </Typography>
                    <Box mx={"auto"}>
                        <Button variant={"contained"} className={classes.control} type={"Submit"}
                                onClick={this.handleSubmit}>
                            {t('upload.upload')}
                        </Button>
                        <Button variant={"contained"} className={classes.control}
                                onClick={() => this.setState({
                                    matches: [],
                                    files: [],
                                    date_match_map: {},
                                    found: false,
                                    cancelled: true,
                                    searching: false,
                                })}>
                            <Typography>{t('cancel')}</Typography>
                        </Button>
                    </Box>
                </Box>
            )
        } else if(found && uploading && !uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        {t('upload.uploading')}
                    </Typography>
                    <BorderLinearProgress variant={'determinate'} value={this.state.progress}
                                          className={classes.progressbar}/>
                </Box>
            )
        } else if(found && uploading && uploaded) {
             filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        {t('upload.success.part1')} {this.state.successes} {t('upload.success.part2')}
                    </Typography>
                    <Button variant={"contained"} className={classes.control}
                            onClick={() => window.location.href = '/'}>
                        Continue
                    </Button>
                </Box>
            )
        }

        return (
            <Fragment>
                <Grid className={classes.full_height} container direction="column" alignItems="center" justify="flex-start">
                    {this.renderInstructions()}
                    <Grid item>
                        <Box
                             style={{'minHeight': '100px', 'minWidth': '300px'}} mt={5} py={3}
                             onDragEnter={this.onDragEnter}
                             onDragOver={this.onDragOver}
                             onDrop={this.onDrop}>
                            <Box style={{'minHeight': 'inherit', 'minWidth': 'inherit'}} display={"flex"}
                                 alignItems={"center"} justifyContent={"center"} className={classes.border}>
                                {filePrompt}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}


export default withStyles(styles)(withTranslation()(Upload))

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: '#EBE0CB',
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#B6893A',
    },
}))(LinearProgress);