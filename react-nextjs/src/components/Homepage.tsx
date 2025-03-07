import Col from "react-bootstrap/Col";

const Homepage: React.FC = () => {
  return (
    <>
      <Col lg={8} className="px-0">
        <p className="fs-4">
          上げ your きく!{" "}
          <a href="https://www.youtube.com/watch?v=iIu9YHWZUzE&list=LL">Learn more</a>
        </p>
        <p>
          Don't wait, get started today!
        </p>
      </Col>
    </>
  );
};

export default Homepage;
