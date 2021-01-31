import { BrowserRouter, Route, Link } from "react-router-dom";
import { useState } from "react";
import useAuthSubmit from "./hooks/use-auth-submit.js";
import useGet from "./hooks/use-get";
import ToolPicUploader from "./toolPicUploader.js";
import ToolPic from "./toolPic.js";
import Tool from "./tool.js";
import axios from "./axios";

export default function AddTool(userId) {
    const [toolInfo, setToolInfo] = useState({
        tool_id: null,
        type: null,
        title: null,
        description: null,
        condition: null,
        url: null,
        available: true,
        toolPicUploader: false,
        userId: userId,
    });

    const [error, setError] = useState(false);
    const [view, setView] = useState(1);
    const handleSubmit = async () => {
        if (userId) {
            try {
                const { data } = await axios.post("/add-tool", toolInfo);

                data.success ? setView(2) : setError(true);
            } catch (err) {
                console.log(err);
                setError(true);
            }
        }
    };

    const handleChange = (e) => {
        setToolInfo({
            ...toolInfo,
            [e.target.name]: e.target.value,
        });
    };

    const setToolImage = (newProfilePic) => {
        setToolInfo({
            ...toolInfo,
            url: newProfilePic,
            toolPicUploader: !toolInfo.toolPicUploader,
        });
    };

    const ToolToggleUploader = () => {
        setToolInfo({
            ...toolInfo,
            toolPicUploader: !toolInfo.toolPicUploader,
        });
    };

    const handleAddNew = () => {
        location.replace("/add");
    };

    // const handelEdit = () => {
    //     setView(3);
    // };
    // const [errorGet, get] = useGet("/tool/delete/pic");

    // const handleKeyPress = (e) => {
    //     if (e.key === "Enter") {
    //         handleSubmit();
    //     }
    // };

    return (
        <>
            <BrowserRouter>
                {toolInfo.toolPicUploader && (
                    <ToolPicUploader
                        setToolImage={setToolImage}
                        tool_id={toolInfo.tool_id}
                    />
                )}

                {/* <Route
                    exact
                    path="/tool"
                    render={() => (
                        <Tool
                            tool_id={toolInfo.tool_id}
                            type={toolInfo.type}
                            title={toolInfo.title}
                            description={toolInfo.description}
                            condition={toolInfo.condition}
                            url={toolInfo.url}
                            ToolToggleUploader={ToolToggleUploader}
                        />
                    )}
                /> */}

                <Route
                    path="/item/:toolid"
                    render={(props, toolInfo, ToolToggleUploader) => (
                        <Tool
                            userId={toolInfo.userId}
                            tool_id={toolInfo.tool_id}
                            ToolToggleUploader={ToolToggleUploader}
                            match={props.match}
                            key={props.match.url}
                            history={props.history}
                        />
                    )}
                />

                <section>
                    <h2 className="share-love">
                        Share love with your goodNeighbors
                    </h2>
                    <div className="tool-pic-container">
                        <ToolPic
                            url={toolInfo.url}
                            ToolToggleUploader={ToolToggleUploader}
                        />
                    </div>

                    <img className="add-pic-back" src="./dream.png" />
                </section>

                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}

                {view === 1 && (
                    <section className="add-tool">
                        <ul className="form1">
                            <li>
                                <label>Choose the type of your item:</label>
                                <select
                                    className="field-divided"
                                    name="type"
                                    id="type"
                                    onChangeCapture={(e) => handleChange(e)}
                                >
                                    <option value="book">Book</option>
                                    <option value="tool">Tool</option>
                                    <option value="equipment">Equipment</option>
                                </select>
                            </li>
                            <li>
                                <label>Title/ Name: </label>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    name="title"
                                    className="field-divided"
                                    placeholder="Add a title or name for your item"
                                />
                            </li>
                            <li>
                                <label>Discription: </label>
                                <textarea
                                    name="description"
                                    placeholder="Add a discription if any .."
                                    cols="30"
                                    rows="5"
                                    onChange={(e) => handleChange(e)}
                                ></textarea>
                            </li>
                            <li>
                                <label>Conditions: </label>
                                <textarea
                                    name="condition"
                                    placeholder="State your conditions if any .."
                                    cols="30"
                                    rows="5"
                                    onChange={(e) => handleChange(e)}
                                ></textarea>
                            </li>
                            <li>
                                <input
                                    onClick={() => handleSubmit()}
                                    type="submit"
                                    value="Add"
                                />
                            </li>
                        </ul>
                    </section>
                )}
                {view === 2 && (
                    <section className="add-tool">
                        <ul className="form1">
                            <li>
                                <label>Type: </label>
                                <h4>{toolInfo.type}</h4>
                            </li>
                            <li>
                                <label>Title/ Name: </label>
                                <h4>{toolInfo.title}</h4>
                            </li>
                            <li>
                                <label>Discription: </label>
                                <p>{toolInfo.description}</p>
                            </li>
                            <li>
                                <label>Conditions: </label>
                                <p>{toolInfo.condition}</p>
                            </li>
                            <li>
                                <input
                                    onClick={() => handleAddNew()}
                                    type="submit"
                                    value="Add New Item"
                                />
                                <input
                                    onClick={() => handelEdit()}
                                    type="submit"
                                    value="Edit Item"
                                />
                            </li>
                        </ul>
                    </section>
                )}
            </BrowserRouter>
        </>
    );
}
