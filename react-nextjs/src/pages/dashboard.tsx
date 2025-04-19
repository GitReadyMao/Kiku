import ProfileBar from "@/components/ProfileBar";
import LessonOverview from "../components/Dashboard";
import Button from "react-bootstrap/Button";


export default function Home() {
  return (
    <>
      <br />
      <div>
        <header className="text-center bg-green-200 py-10">
          <h1 className="text-4xl font-bold">Welcome to Lesson Overview</h1>
          <p style={{ fontSize: "20px" }}>View and select a lesson!</p>
          <a href="/">
            <button
              
              style={{
                fontSize: 'clamp(14px, 4vw, 18px)', 
                padding: '12px 20px',              
                backgroundColor: '#ff5833',       
                color: 'white',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              Back To HomePage
            </button>
          </a>


        </header>
       
        <ProfileBar />
        <LessonOverview />
      </div></>
  );
}
