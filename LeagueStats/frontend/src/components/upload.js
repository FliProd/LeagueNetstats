import React, {Component, Fragment} from "react"
import {Box, ListItem, List, Typography, Grid, Paper, Button} from "@material-ui/core"
import SummonerList from "./user/summoner"
import {Alert} from "react-bootstrap"
import {forEach} from "react-bootstrap/ElementChildren"
import {axiosInstance} from "../axiosApi"
import {StatusCodes} from "http-status-codes"
import {withStyles} from "@material-ui/core/styles"
import LinearProgress from '@material-ui/core/LinearProgress';

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
    }

    //---------------------------- File System Access API (DirectoryPicker) ----------------------------
    //better use the other api as drag and drop works bette rand we also have a directorypciker
    /*async onDirectoryPicker() {
        const options = {
            types: [{
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt'],
            }}],
            multiple: false,
        }
        const directoryhandle = await window.showDirectoryPicker(options)
        const subdirhandle = await directoryhandle.getDirectoryHandle('LoL', {create: false})
    }*/


    //---------------------------- File and Directory Entries API (Drag&Drop) ----------------------------
    //TODO: make search faster by testing normal path first

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
            dirReader.readEntries(this.directoryCallback)
        }
    }

    onDrop(event) {
        event.stopPropagation()
        event.preventDefault()

        var items = event.dataTransfer.items
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry()
            if (item) {
                this.findFileRecursive(item)
                setTimeout(() => this.setState({searched: true}), 5000)
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
                let region = lines[i].match(/-Region=\w*\d*/)
                if (id != null) {
                    obj.setState(prevstate => {
                        prevstate.date_match_map[date] = {
                            id: id[0].replace("-GameID=", ''),
                            region: region[0].replace("-Region=", '')
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

    // TODO: try sending post request for each file, if its fast enough a progressbar could easily be implemented
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
                console.log(index + ' success')
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
                    return prevstate
                })
                console.log(error)
            })
        })
    }

    render() {
        const classes = this.props.classes

        const matchList = this.state.matches
        const num_matches = matchList.length

        const found = this.state.found
        const uploading = this.state.uploading
        const uploaded = this.state.uploaded

        let filePrompt
        if (found && !uploading && !uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        Upload {num_matches} matches?
                    </Typography>
                    <Box mx={"auto"}>
                        <Button variant={"contained"} className={classes.control} type={"Submit"}
                                onClick={this.handleSubmit}>
                            Upload
                        </Button>
                        <Button variant={"contained"} className={classes.control}
                                onClick={() => this.setState({
                                    matches: [],
                                    files: [],
                                    date_match_map: {},
                                    found: false,
                                    cancelled: true
                                })}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )
        } else if (found && uploading && !uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        Uploading {num_matches} matches.
                    </Typography>
                    <BorderLinearProgress variant={'determinate'} value={this.state.progress}
                                          className={classes.progressbar}/>
                </Box>
            )
        } else if (found && uploading && uploaded) {
            filePrompt = (
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Typography variant={'body1'} align={'center'}>
                        Successfully uploaded {this.state.successes} matches out of {this.state.files.length} matches.
                    </Typography>
                    <Button variant={"contained"} className={classes.control}
                            onClick={() => window.location.href = '/'}>
                        Continue
                    </Button>
                </Box>
            )
        } else {
            filePrompt = (
                <Fragment>
                    <div>
                        <Box display={"flex"} justifyContent={"center"}>
                            <Typography>Drag&Drop</Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"center"}>
                            <Typography>or</Typography>
                        </Box>
                        <Box className={"filepicker"}>
                            <input type="file" id="filepicker" name="fileList" webkitdirectory={"true"} multiple
                                   onChange={this.onWebkit}/>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            {found == false && this.state.searched == true && this.state.cancelled == false &&
                            <Alert variant={"danger"}>No League of Legends Logs found in this directory, choose a
                                different one.</Alert>}
                        </Box>
                    </div>
                </Fragment>
            )
        }

        return (
            <Fragment>
                <Grid className={"signup-grid"} container spacing={5} direction="row" alignItems="center"
                      justify="center">
                    <Grid item>
                        <Box className={classes.border}
                             style={{'minHeight': '100px', 'minWidth': '300px'}} mt={5} border={1} py={3}
                             onDragEnter={this.onDragEnter}
                             onDragOver={this.onDragOver}
                             onDrop={this.onDrop}>
                            <Box style={{'minHeight': 'inherit', 'minWidth': 'inherit'}} display={"flex"}
                                 alignItems={"center"} justifyContent={"center"}>
                                {filePrompt}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}


export default withStyles(styles)(Upload)

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