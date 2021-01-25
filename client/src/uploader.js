import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };

        //     this.handleUpload = this.handleUpload.bind(this);
        //     this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange(e) {
        // console.log("changeeeee!");
        // console.log(e.target.files[0]);
        this.setState({
            image: e.target.files[0],
        });
    }

    handleUpload(e) {
        e.preventDefault();
        // console.log("upload button is working!");
        var formData = new FormData();
        formData.append("image", this.state.image);
        // if (this.state.profilePic) {
        axios
            .post("/user/upload/profile-pic", formData)
            .then(({ data }) => {
                console.log("response", data);
                this.props.setImage(data.profile_pic);
            })
            .catch((err) => {
                console.log("error on POST /profilePic", err);
            });
        // }
    }

    close() {
        this.props.toggleUploader;
    }

    render() {
        console.log("this.props in Uploader: ", this.props);
        return (
            <div className="profile-pic-uploader">
                <div>
                    <h3>Upload new profile picture</h3>
                    {/* <h5 onClick={(e) => this.close(e)} className="x">
                        x
                    </h5> */}
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => this.handleFileChange(e)}
                        id="image"
                        className="inputfile"
                    />

                    <button onClick={(e) => this.handleUpload(e)}>
                        Upload
                    </button>
                </div>
            </div>
        );
    }
}
