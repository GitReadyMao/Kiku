import { useState } from "react";
import ProfileBar from "@/components/ProfileBar";
import UsernameForm from "@/components/Profile";
import GroupManagement from "@/components/GroupManagement";
import DeleteAccount from "@/components/DeleteAccount";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useUsername from "./useUsername";
import axios from "axios";
import { getCsrfToken } from "@/util/token";

const Profile = () => {
  const { username, refreshUsername } = useUsername();

  const updateUsername = async (newUsername: string) => {
    try {
      const apiClient = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
      });

      await apiClient.put("/api/v1/user", {
        username: newUsername,
      }, {
        headers: {
          "X-CSRF-Token": getCsrfToken()
        }
      });

      //alert("update successful");
      window.location.reload();
      refreshUsername();
    } catch (error: any) {
      //alert("Failed to update user");
    }
  };

  return (
    <>
      <ProfileBar />
      <Container className="mt-4">
        <Row className="justify-content-center text-center">
          <Col xs={12} md={8} lg={6}>
            <h1>Welcome in, {username}!</h1>
            <p>These are crucial settings for your account. Please proceed carefully.</p>
          </Col>
        </Row>
      </Container>

      <UsernameForm currentUsername={username} onUpdateUsername={updateUsername} />
      <GroupManagement />

      <DeleteAccount />
    </>
  );
};

export default Profile;
