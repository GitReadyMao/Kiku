import ProfileBar from "@/components/ProfileBar";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/Table";

export default function Leaderboards() {
  return (
    <>
      <br />
      <ProfileBar />

      <Container className="leaderboard-container">
        <h2 className="text-center mb-4">🏆 Leaderboards 🏆</h2>

        <Table className="text-center leaderboard-table" striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
          <tr className="gold-row">
              <td>1</td>
              <td>John Kiku</td>
              <td>100</td>
            </tr>
            <tr className="silver-row">
              <td>2</td>
              <td>MaoMao</td>
              <td>90</td>
            </tr>
            <tr className="bronze-row">
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
      </Container>

      <style jsx>{`

        .gold-row {
          font-weight: bold;
        }

        .silver-row {
          font-weight: bold;
        }

        .bronze-row {
          font-weight: bold;
        }
      `}</style>

    </>
  );
}
