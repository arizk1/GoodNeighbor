import React from "react";

export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleUploader,
}) {
    // console.log("props in ProfilePic: ", first, last);
    return (
        <div>
            {profile_pic && (
                <img
                    className="profile-pic"
                    onClick={toggleUploader}
                    src={profile_pic}
                    alt={`${first}${last}`}
                />
            )}
            {!profile_pic && (
                <img
                    className="profile-pic"
                    onClick={toggleUploader}
                    src="/flame-166.png"
                    alt="Add your profile pic"
                />
            )}
        </div>
    );
}
