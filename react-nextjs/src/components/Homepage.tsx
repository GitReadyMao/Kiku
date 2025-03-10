import Col from "react-bootstrap/Col";
import Image from "next/image";
import Registration from "@/components/Registration";
import Login from "./Login";
import { FaBook, FaBullseye, FaCheckSquare } from "react-icons/fa";

const Homepage: React.FC = () => {
  return (
    <>
      {/* The KikuLanding image (gotta fix name)*/}
      <header id="home" className="mb-4">
        <Image
          src="/KikuLanding.png"
          alt="Kiku Landing"
          width={1920}
          height={600}
          layout="responsive"
        />
      </header>

      <br></br>

      

      {/* About section */}
      <div className="text-center mt-4">
        <h2 className="mt-2">ABOUT きく</h2>
        <p className="fs-5">Our Story, Mission, and Goals</p>
      </div>


      <div className="row text-center mt-5">
        <div className="col-md-4">
          <FaBook size={60} className="text-primary mb-3" />
          <h3>Story</h3>
          <p>
            With three of our team members having gone through the Japanese program at UF, we’ve experienced both
            the benefits and drawbacks of the structured system for learning Japanese. In response to this experience, we started to brainstorm ideas that could benefit
            not only our learning experience but also that of other students either currently going through the Japanese program or that take it in the future.
          </p>
        </div>

        <div className="col-md-4">
          <FaBullseye size={60} className="text-danger mb-3" />
          <h3>Mission</h3>
          <p>
            We aim to develop a web application that focuses on teaching vocabulary useful for students at the
            Intermediate to Advanced levels. Kiku will teach students vocabulary through small mini-lessons containing definitions and potentially other useful
            information. Furthermore, Kiku will use spaced repetition to help students retain information in their long-term memory instead of forgetting terms quickly after a
            session of cramming.
          </p>
        </div>

        <div className="col-md-4">
          <FaCheckSquare size={60} className="text-success mb-3" />
          <h3>Goals</h3>
          <p>
            We believe that Kiku will provide students learning Japanese with an easy-to-use, effective, and fun
            tool that can serve as a good complement to the UF
            Japanese program or other methods of Japanese language learning.
          </p>
        </div>
      </div>

      <hr className="col-auto my-5 mx-0" style={{ color: 'white' }} />

      {/*Meet the team */}
      <div className="text-center mt-4" style={{ padding: '64px 16px 20px' }} id="team">
        <h3>Senior Citizens</h3>
        <p style={{ fontSize: "20px"}}>The creators of Kiku きく</p>

        <div className="row" style={{ marginTop: '64px' }}>
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
              <div className="card-body">
                <h3 className="card-title">Mauro Chavez Vega</h3>
                <p className="card-text w3-opacity">Backend</p>
                <p className="card-text">Computer Science CLAS with a Japanese minor.</p>
                <p className="card-text">Class of 2025.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
              <div className="card-body">
                <h3 className="card-title">Mauricio Lara</h3>
                <p className="card-text w3-opacity">Frontend</p>
                <p className="card-text">Computer Science COE with an AI Specialization.</p>
                <p className="card-text">Class of 2025.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
              <div className="card-body">
                <h3 className="card-title">Sean Regan</h3>
                <p className="card-text w3-opacity">Backend</p>
                <p className="card-text">Computer Science COE with a Japanese minor.</p>
                <p className="card-text">Class of 2025.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
              <div className="card-body">
                <h3 className="card-title">Zackary Elmottalib</h3>
                <p className="card-text w3-opacity">Frontend</p>
                <p className="card-text">Computer Science CLAS with a Japanese minor.</p>
                <p className="card-text">Class of 2025.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/*Lessons Button*/}
      <div className="text-center mt-4" style={{ padding: "64px 16px" }} id="lesson">
        <h1>Lessons Available</h1>
        <p style={{ fontSize: "20px"}}>What we've created for your learning experience!</p>

        <div className="text-center mt-4" style={{ margin: "64px" }}>
            <button className="btn btn-lg"
              style={{
                fontSize: '24px',
                padding: '20px 40px',
                backgroundColor: '#ff5833',
                color: 'white',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              View all Available Lessons
            </button>

        </div>


      </div>

    </>
  );
};

export default Homepage;
