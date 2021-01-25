import { Component } from "react";
import BioEditor from "./bioEditor";
import ProfilePic from "./profilepic";

export default function Profile({
    first,
    last,
    bio,
    addBio,
    profile_pic,
    toggleUploader,
}) {
    return (
        <section>
            <div className="profile-pic-container">
                <ProfilePic
                    profile_pic={profile_pic}
                    toggleUploader={toggleUploader}
                />
            </div>
            <div className="profile-name">
                <h2>
                    {first} {last}
                </h2>

                <BioEditor bio={bio} addBio={addBio} />
            </div>
        </section>
    );
}
