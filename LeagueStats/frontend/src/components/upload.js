import React, {Component, Fragment} from "react";
import {Box, ListItem, List, Typography, Grid, Paper, Button} from "@material-ui/core";
import SummonerList from "./summoner";
import {Alert} from "react-bootstrap";
import {forEach} from "react-bootstrap/ElementChildren";
import {axiosInstance} from "../axiosApi";
import {StatusCodes} from "http-status-codes";


class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            matches: [],
            date_match_map: {},
            found: false,
            searched: false,
            cancelled: false,
        }

        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.findFileRecursive = this.findFileRecursive.bind(this);
        this.onWebkit = this.onWebkit.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.setGameId = this.setGameId.bind(this);
        this.directoryCallback = this.directoryCallback.bind(this);
        this.fileCallback = this.fileCallback.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        };
        const directoryhandle = await window.showDirectoryPicker(options);
        const subdirhandle = await directoryhandle.getDirectoryHandle('LoL', {create: false});
    }*/


    //---------------------------- File and Directory Entries API (Drag&Drop) ----------------------------
    //TODO: make search faster by testing normal path first

    fileCallback(file) {
        if (file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_netlog.txt/)) {
            this.setState(prevstate => {
                let newfiles = [...prevstate.files, file];
                let newmatches = [...prevstate.matches, this.parseDate(file.name)];
                return {
                    files: newfiles,
                    matches: newmatches,
                    found: true,
                    searched: true,
                    cancelled: false,
                }
            });
        } else if(file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_r3dlog.txt/)) {
            this.setGameId(file);
        }
    }

    directoryCallback(entries) {
        for (var i = 0; i < entries.length; i++) {
            this.findFileRecursive(entries[i]);
        }
    }

    findFileRecursive(item) {
        if (item.isFile) {
            item.file(this.fileCallback);
        } else if (item.isDirectory) {
            var dirReader = item.createReader();
            dirReader.readEntries(this.directoryCallback);
        }
    }

    onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        var items = event.dataTransfer.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i].webkitGetAsEntry();
            if (item) {
                this.findFileRecursive(item);
                setTimeout(() => this.setState({searched: true}), 5000);
            }
        }
    }


    onDragEnter(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    //---------------------------- File and Directory Entries API (Input with Webkitdirectory) ----------------------------
    onWebkit(event) {
        event.stopPropagation();
        event.preventDefault();

        let files = event.target.files;

        files = Array.from(files);
        let netlogs = files.filter((file) => {
            return file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_netlog.txt/);
        });
        let r3dlogs = files.filter((file) => {
            return file.name.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_r3dlog.txt/)
        });
        r3dlogs.forEach(file => {
            return this.setGameId(file);
        })

        const dates = netlogs.map((file) => {
            return this.parseDate(file.name);
        });

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
        fileName = fileName.replace("_netlog.txt", "");
        let dateArray = fileName.split(/-|T/);
        return dateArray[0] + '.' + dateArray[1] + '.' + dateArray[2] + '   ' + dateArray[3] + ':' + dateArray[4];
    }

    async setGameId(file) {
        const reader = new FileReader();
        var obj = this;
        reader.readAsText(file);
        reader.onload = ((event) => {

            let lines = reader.result.split('\n');
            let date = lines[0].match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)[0].replaceAll(':', '-');

            for (let i = 1; i < lines.length; i++) {
                let id = lines[i].match(/-GameID=\d*/);
                if (id != null) {
                    obj.setState(prevstate => {
                       prevstate.date_match_map[date] = id[0].replace("-GameID=", '');
                    })
                    return;
                }
            }
        });
    }

    // TODO: try sending post request for each file, if its fast enough a progressbar could easily be implemented
    async handleSubmit() {
        console.log(this.state);
        let formdata = new FormData();
        this.state.files.forEach((file, index) => formdata.append('File_' + index, file));
        formdata.append('date_match_map',JSON.stringify(this.state.date_match_map));
        try {
            const response = await axiosInstance.post('riotapi/match/create/', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            this.setState({
                errors: error.response.data,
            });
        }
    }

    render() {
        let matchList = this.state.matches;
        matchList = matchList.map((name) =>
            <ListItem key={name}>
                <Typography>{name}</Typography>
            </ListItem>);


        let filePrompt;
        if (this.state.found) {
            filePrompt = (
                <Fragment>
                    <Box mx={"auto"}>
                        <Button variant={"contained"} type={"Submit"} onClick={this.handleSubmit}>
                            Upload
                        </Button>
                        <Button variant={"contained"} type={"Submit"}
                                onClick={() => this.setState({matches: [], files: [], found: false, cancelled: true})}>
                            Cancel
                        </Button>
                    </Box>
                </Fragment>
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
                            {this.state.found == false && this.state.searched == true && this.state.cancelled == false &&
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
                    <Grid item md={6}>
                        <Paper variant="outlined"
                               style={{'minHeight': '100px', 'minWidth': '300px'}} mt={5} border={1} py={3}
                               onDragEnter={this.onDragEnter}
                               onDragOver={this.onDragOver}
                               onDrop={this.onDrop}>
                            <Box style={{'minHeight': 'inherit', 'minWidth': 'inherit'}} display={"flex"}
                                 alignItems={"center"} justifyContent={"center"}>
                                {filePrompt}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item md={6}>
                        <Paper variant="outlined">
                            <List>
                                {matchList}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}


export default Upload;