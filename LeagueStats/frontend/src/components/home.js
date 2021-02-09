import React, {Component, Fragment} from "react";
import {Box, Paper, Typography} from "@material-ui/core";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            filehandle: null,
        }

        this.onDirectoryPicker = this.onDirectoryPicker.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.traverseFileTree = this.traverseFileTree.bind(this);
        this.onWebkit = this.onWebkit.bind(this);

    }

    //---------------------------- File System Access API (DirectoryPicker) ----------------------------
    async onDirectoryPicker() {
        const options = {
            types: [{
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt'],
            }}],
            multiple: false,
        };
        const directoryhandle = await window.showDirectoryPicker(options);
        console.log(directoryhandle);
        const subdirhandle = await directoryhandle.getDirectoryHandle('League\ of\ Legends', {create: false});
        console.log(subdirhandle);
    }


    //---------------------------- File and Directory Entries API (Drag&Drop) ----------------------------

    traverseFileTree(item, path, obj) {
        path = path || "";

        if (item.isFile) {
            // Get file
            item.file(function (file) {
                if (path.match("/Contents/LoL/Logs/GameLogs/") !== null) {
                    console.log("File:", path + file.name);
                }
            });
        } else if (item.isDirectory) {
            // Get folder contents
            var dirReader = item.createReader();
            dirReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    obj.traverseFileTree(entries[i], path + item.name + "/", obj);
                }
            });
        }
    }

    onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        var items = event.dataTransfer.items;

        for (var i = 0; i < items.length; i++) {
            var item = items[i].webkitGetAsEntry();
            if (item) {
                this.traverseFileTree(item, "", this);
            }
        }
    }

    onDragEnter(event) {
        document.getElementById('output').textContent = '';
        event.stopPropagation();
        event.preventDefault();
    }

    onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    //---------------------------- File and Directory Entries API (Input with Webkitdirectory) ----------------------------

    onWebkit(event) {
        console.log(event);
        event.stopPropagation();
        event.preventDefault();

        this.elementById = document.getElementById("listing");
        let output = this.elementById;
        let files = event.target.files;

        console.log('1');
        console.log(files[0]);

        files = files.filter((file, index) => {
            file.webkitRelativePath.match("/.*\/League of Legends.app\/Contents\/LoL\/Logs\/GameLogs\/.*/")
        });

        for (let i = 0; i < files.length; i++) {
            let item = document.createElement("li");
            item.innerHTML = files[i].webkitRelativePath;
            output.appendChild(item);
        }
    }

    //----------------------------------------------------------------------


    render() {

        return (
            <Fragment>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={5} border={1} py={3}>
                    <div>
                        <button onClick={this.onDirectoryPicker}> DirectoryPicker</button>
                    </div>
                </Box>


                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={5} border={1} py={3}>
                    <div id="output"
                         style={{'minHeight': '100px', 'minWidth': '150px', 'border': '1px solid black'}}
                         onDragEnter={this.onDragEnter}
                         onDragOver={this.onDragOver}
                         onDrop={this.onDrop}
                    >
                        <Typography>Drag & Drop</Typography>
                    </div>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={5} border={1} py={3}>
                    <input type="file" id="filepicker" name="fileList" webkitdirectory={"true"} multiple onChange={this.onWebkit} />
                    <ul id="listing"></ul>
                </Box>


            </Fragment>
        );
    }
}


export default Home;