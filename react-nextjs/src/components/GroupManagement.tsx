import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getCsrfToken } from "@/util/token";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [groupLeader, setGroupLeader] = useState<string | null>(null); 
  const [username, setUsername] = useState<string | null>(null);       
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchUserGroup();
    fetchCurrentUser(); 
  }, []);

  useEffect(() => {
    if (userGroup) {
      const fetchGroupLeader = async () => {
        try {
          const res = await apiClient.get("/group");
          const groupData = res.data.data;
          const group = groupData.find((g: any) => g.name === userGroup);
          setInviteCode(group?.invite_code || null);
          setGroupLeader(group?.leader || null);
        } catch (err) {
          console.error("Error fetching group leader:", err);
        }
      };

      fetchGroupLeader();
    }
  }, [userGroup]);

  const fetchCurrentUser = async () => { 
    try {
      const res = await apiClient.get("/current-user", {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });
      setUsername(res.data.username);
    } catch (err) {
      console.error("Failed to fetch current username");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await apiClient.get("/group");
      const groupData = res.data.data;
      setGroups(groupData.map((g: any) => g.name));

      if (userGroup) {
        const group = groupData.find((g: any) => g.name === userGroup);
        setInviteCode(group?.invite_code || null);
        setGroupLeader(group?.leader || null);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const fetchUserGroup = async () => {
    try {
      const res = await apiClient.get("/lookup", {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });
      setUserGroup(res.data.group || null);
    } catch (err) {
      console.error("Failed to fetch user group");
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    try {
      await apiClient.post(
        "/unite",
        { name: groupName },
        {
          headers: {
            "X-CSRF-Token": getCsrfToken(),
          },
        }
      );

      setUserGroup(groupName);
      setGroupName("");

      await apiClient.put("/invite", {}, {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });

      fetchGroups();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Group creation failed.");
    }
  };

  const handleJoinByInvite = async () => {
    try {
      await apiClient.post(
        "/join",
        { group_code: inviteCodeInput },
        {
          headers: {
            "X-CSRF-Token": getCsrfToken(),
          },
        }
      );

      setInviteCodeInput("");
      fetchUserGroup();
      fetchGroups();
    } catch (err) {
      setError("Invalid or expired invite code.");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await apiClient.delete("/leave", {
        data: { name: userGroup },
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });

      setUserGroup(null);
      setInviteCode(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to leave group.");
    }
  };

  const handleGenerateInviteCode = async () => {
    try {
      await apiClient.put("/invite", {}, {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });

      fetchGroups();
    } catch (err) {
      setError("Failed to generate invite code.");
    }
  };

  const handleDisbandGroup = async () => {
    try {
      await apiClient.delete("/disband", {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });
      setUserGroup(null);
      setInviteCode(null);
      fetchGroups();
    } catch (err) {
      setError("Failed to disband group.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={8} lg={6}>
          <div className="p-4 border rounded shadow bg-light">
            <h2 className="text-center mb-4">Manage Groups</h2>

            <Form onSubmit={handleCreateGroup}>
              <Form.Group className="mb-3" controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="success" type="submit">
                  Create Group
                </Button>
              </div>
            </Form>

            <Form.Group className="mb-3" controlId="inviteCode">
              <Form.Label>Join by Invite Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter invite code"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
              />
              <div className="d-grid mt-2">
                <Button
                  variant="primary"
                  onClick={handleJoinByInvite}
                >
                  Join Group
                </Button>
              </div>
            </Form.Group>

            {error && <p className="text-danger fw-bold">{error}</p>}

            <hr />

            <h3 className="text-center">Your Current Group</h3>
            {userGroup ? (
              <div className="text-center mb-3">
                <p><strong>{userGroup}</strong></p>
                {inviteCode && (
                  <p className="text-muted">
                    Invite Code: <code>{inviteCode}</code>
                  </p>
                )}
                <div className="d-grid gap-2">
                  {groupLeader?.toLowerCase() === username?.toLowerCase() ? (
                    <Button variant="outline-danger" onClick={handleDisbandGroup}>
                      Disband Group
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={handleLeaveGroup}>
                      Leave Group
                    </Button>
                  )}
                  <Button variant="info" onClick={handleGenerateInviteCode}>
                    Generate Invite Code
                  </Button>
                </div>

              </div>
            ) : (
              <p className="text-center">You are not in any group.</p>
            )}

            <hr />

            <h3 className="text-center">Available Groups</h3>
            {groups.length === 0 ? (
              <p className="text-center">No groups available.</p>
            ) : (
              <ListGroup>
                {groups.map((group, index) => (
                  <ListGroup.Item
                    key={index}
                    className="text-center"
                  >
                    {group}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupManagement;
