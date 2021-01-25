import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisiable: false,
            draftBio: "",
        };
    }
    handleChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }
    handelBioAdding() {
        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                this.props.addBio(data.bio);
                this.handleAddorUpdate();
            })
            .catch((err) => {
                console.log("error on POST /update-bio", err);
            });
    }

    handleAddorUpdate() {
        this.setState({
            draftBio: this.props.bio,
            textareaVisiable: !this.state.textareaVisiable,
        });
    }

    render() {
        return (
            <>
                {this.state.textareaVisiable && (
                    <div className="bio-button">
                        <textarea
                            rows="4"
                            cols="50"
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.handelBioAdding()}>
                            Save
                        </button>
                    </div>
                )}
                {!this.state.textareaVisiable && (
                    <>
                        <p className="bio">{this.props.bio}</p>

                        <div className="bio-button">
                            {this.props.addBio && (
                                <button
                                    onClick={() => this.handleAddorUpdate()}
                                >
                                    {this.props.bio ? "Update Bio" : "Add Bio"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </>
        );
    }
}
