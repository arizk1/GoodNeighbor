import { Component } from "react";
import ToolPic from "./toolPic";
import axios from "./axios";

export default class Tool extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log(this.props.match.params);
        // if (this.props.match.params.id == this.props.id) {
        //     this.props.history.push("/other/:userId:toolId");
        // } else {
        axios
            .get("/user/" + this.props.userId + "/" + this.props.tool_id)
            .then(({ data }) => {
                console.log(data[0]);
                // this.setState({ ...data[0] });
            })
            .catch((error) => console.log("error in geting /user-data", error));
        // }
    }
    render() {
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
}
