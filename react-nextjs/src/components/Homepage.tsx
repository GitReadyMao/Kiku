import Col from "react-bootstrap/Col";
import Registration from "@/components/Registration";
import Login from "./Login";

const Homepage: React.FC = () => {
  return (
    <>
      <Col lg={8} className="px-0">
        <p className="fs-4">
          上げ your きく!{" "}
          <a href="https://www.youtube.com/watch?v=iIu9YHWZUzE&list=LL">Learn more</a>
        </p>
        <p>
          Don't wait, get started now!
        </p>
      </Col>

      <Login className="me-3" />
      <Registration />
    </>
  );
};

export default Homepage;