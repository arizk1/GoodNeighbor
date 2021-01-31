import { Component } from "react";
import ToolPic from "./toolPic";
import axios from "./axios";
import { useState, useEffect } from "react";

export default function Tool(props) {
    console.log(props);

    const [toolInfo, setToolInfo] = useState({});

    useEffect(() => {
        let abort;

        (async () => {
            const { data } = await axios.get(
                `/item/${props.match.params.tool_id}`
            );
            if (!abort) {
                setToolInfo(...data[0]);
            }
        })();

        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            <h1>userID/TOOLID</h1>
            {/* <div className="tool-pic-container">
                    <ToolPic
                        url={toolInfo.url}
                        ToolToggleUploader={ToolToggleUploader}
                    />
                </div> */}
            {/* <div className="profile-container">
                    <div>
                        <img src={this.state.profile_pic} />
                    </div>
                    <div>
                        <h3>
                            {this.state.first} {this.state.last}
                        </h3>
                        <p> {this.state.bio} </p>
                    </div>
                </div> */}
        </>
    );
}
