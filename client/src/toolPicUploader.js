import { useState } from "react";
import axios from "./axios";

export default function ToolPicUploader(props) {
    const [toolPic, setToolPic] = useState({ image: null });

    const handleFileChange = (e) => {
        setToolPic({
            image: e.target.files[0],
        });
        console.log(e.target.files[0]);
    };

    const handleUpload = () => {
        var formData = new FormData();
        formData.append("image", toolPic.image);
        axios
            .post("/add/item/pic", formData)
            .then(({ data }) => {
                console.log("response", data);
                props.setToolImage(data.url);
            })
            .catch((err) => {
                console.log("error on POST /profilePic", err);
            });
    };

    return (
        <div className="profile-pic-uploader">
            <div>
                <h3>Upload picture for your item</h3>
                {/* <h5 onClick={(e) => this.close(e)} className="x">
                        x
                    </h5> */}
                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                    id="image"
                    className="inputfile"
                />

                <button onClick={(e) => handleUpload(e)}>Upload</button>
            </div>
        </div>
    );
}
