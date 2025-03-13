import { useState } from "react";
import ProfileBar from "@/components/ProfileBar";
import UsernameForm from "@/components/Profile";
import GroupManagement from "@/components/GroupManagement";
import DeleteAccount from "@/components/DeleteAccount";

export default function Profile() {
  const [username, setUsername] = useState("Username"); // Default username

  return (
    <>
    <br />
      <ProfileBar />
      <h1>Welcome in, {username}!</h1>
      <p>
        These are crucial settings for your account and anything deleted will be
        unrecoverable. Please proceed if you understand the consequences.
      </p>

      <h2>Change Name:</h2>
      <hr />
      <UsernameForm currentUsername={username} onUpdateUsername={setUsername} />

      <hr />

      <GroupManagement />

      <DeleteAccount />
    </>
  );
}
