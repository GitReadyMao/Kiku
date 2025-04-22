import { useEffect, useState } from "react";
import axios from "axios";
import ProfileBar from "@/components/ProfileBar";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/Table";
import { getCsrfToken } from "@/util/token";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiClient.get("/points", {
          headers: {
            "X-CSRF-Token": getCsrfToken(),
          },
        });

        const sorted = res.data.sort((a: any, b: any) => b.points - a.points);
        setLeaderboard(sorted);
      } catch (err) {
        setError("Failed to fetch leaderboard.");
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <br />
      <ProfileBar />

      <Container className="leaderboard-container">
        <h2 className="text-center mb-4">🏆 Group Leaderboard 🏆</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        {leaderboard.length > 0 ? (
          <Table className="text-center leaderboard-table" striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user: any, index: number) => (
                <tr
                  key={user.username}
                  className={
                    index === 0
                      ? "gold-row"
                      : index === 1
                      ? "silver-row"
                      : index === 2
                      ? "bronze-row"
                      : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{"🌟"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">You're not in a group! Join one and compete for the best score with your friends!.</p>
        )}
      </Container>

      <style jsx>{`
        .gold-row {
          font-weight: bold;
          background-color: #ffd700;
        }
        .silver-row {
          font-weight: bold;
          background-color: #c0c0c0;
        }
        .bronze-row {
          font-weight: bold;
          background-color: #cd7f32;
        }
      `}</style>
    </>
  );
}
