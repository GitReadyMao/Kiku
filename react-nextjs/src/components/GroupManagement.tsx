import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<string[]>(["TEAM ALLMIGHT"]);
  const [groupName, setGroupName] = useState("");
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    if (groups.includes(groupName)) {
      setError("Group already exists.");
      return;
    }

    setGroups([...groups, groupName]);
    setGroupName("");
  };

  const handleJoinGroup = (group: string) => {
    if (userGroup === group) {
      setError("You are already in this group.");
      return;
    }

    setUserGroup(group);
  };

  const handleLeaveGroup = () => {
    setUserGroup(null);
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

              {error && <p className="text-danger fw-bold">{error}</p>}

              <div className="d-grid">
                <Button variant="success" type="submit">
                  Create Group
                </Button>
              </div>
            </Form>

            <hr />

            <h3 className="text-center">Your Current Group</h3>
            {userGroup ? (
              <div className="text-center mb-3">
                <p><strong>{userGroup}</strong></p>
                <Button variant="danger" onClick={handleLeaveGroup}>Leave Group</Button>
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
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    {group}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleJoinGroup(group)}
                      disabled={userGroup === group}
                    >
                      {userGroup === group ? "Joined" : "Join"}
                    </Button>
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
