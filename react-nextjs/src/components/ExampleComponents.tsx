import Col from "react-bootstrap/Col";
import ExamplePopover from "@/components/ExamplePopover";
import ExampleOffcanvas from "./ExampleOffcanvas";

const ExampleComponents: React.FC = () => {
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

      <ExampleOffcanvas className="me-3" />
      <ExamplePopover />
    </>
  );
};

export default ExampleComponents;
