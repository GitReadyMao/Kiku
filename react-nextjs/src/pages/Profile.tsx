import { useState } from "react";
import ProfileBar from "@/components/ProfileBar";
import UsernameForm from "@/components/Profile";
import GroupManagement from "@/components/GroupManagement";
import DeleteAccount from "@/components/DeleteAccount";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Profile() {
  const [username, setUsername] = useState("Username"); // Default username

  return (
    <>
      <br />
      <ProfileBar />
      <Container className="mt-4">
        <Row className="justify-content-center text-center">
          <Col xs={12} md={8} lg={6}>
            <h1>Welcome in, {username}!</h1>
            <p>
              These are crucial settings for your account and anything deleted will be
              unrecoverable. Please proceed if you understand the consequences.
            </p>
          </Col>
        </Row>
      </Container>
      <UsernameForm currentUsername={username} onUpdateUsername={setUsername} />


      <GroupManagement />

      <DeleteAccount />
    </>
  );
}
