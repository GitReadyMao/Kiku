import ProfileBar from "@/components/ProfileBar";
import Container from "react-bootstrap/esm/Container";
import Table from 'react-bootstrap/Table';

export default function Leaderboards() {
  return (
    <>
    <br />
    <ProfileBar />
    
    <Table bordered hover size="sm" className="mx-auto" style={{ width: "auto" }}>
      <thead>
        <tr className="text-center">
          <th >Rank</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-success">
          <td >1</td>
          <td>John Kiku</td>
          <td>100</td>

        </tr>
        <tr>
          <td>2</td>
          <td>MaoMao</td>
          <td>90</td>

        </tr>
        <tr>
          <td>3</td>
          <td>MauMau</td>
          <td>75</td>
        </tr>
        <tr>
          <td>4</td>
          <td>ZackAttack2025</td>
          <td>50</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Soup</td>
          <td>0</td>
        </tr>
      </tbody>
    </Table>
    </>
  );
}
