import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<string[]>(["TEAM ALLMIGHT"]); 
  const [groupName, setGroupName] = useState("");
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Creating of new group
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

    setUserGroup(group); // switch between groups
  };

  const handleLeaveGroup = () => {
    setUserGroup(null);
  };

  const handleDeleteUser = () => {
    
  }
  
  {/*const handleDeleteGroup = (group: string) => {
    setGroups(groups.filter((g) => g !== group));
  };
    <Button variant="danger" size="sm" onClick={() => handleDeleteGroup(group)}>
                  Delete
                </Button> */}
  

  return (
    <div>
      <h2>Manage Groups</h2>

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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button variant="success" type="submit">
          Create Group
        </Button>
        
      </Form>

      <hr />

      
      <h3>Your Current Group:</h3>
      {userGroup ? (
        <div>
          <p><strong>{userGroup}</strong></p>
          <Button variant="danger" onClick={handleLeaveGroup}>Leave Group</Button>
        </div>
      ) : (
        <p>You are not in any group.</p>
      )}

      <hr />


      <h3>Available Groups</h3>
      {groups.length === 0 ? (
        <p>No groups available.</p>
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

      <h3>Delete Account</h3>

    </div>
  );
};

export default GroupManagement;
