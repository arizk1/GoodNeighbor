import React from "react";

export default function ToolPic({ url, ToolToggleUploader }) {
    return (
        <div>
            {url && (
                <img
                    className="profile-pic"
                    onClick={ToolToggleUploader}
                    src={url}
                />
            )}
            {!url && (
                <img
                    className="profile-pic"
                    onClick={ToolToggleUploader}
                    src="/lime-236.png"
                    alt="Add a picture"
                />
            )}
        </div>
    );
}
