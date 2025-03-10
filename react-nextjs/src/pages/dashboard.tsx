import ProfileBar from "@/components/ProfileBar";
import LessonOverview from "../components/Dashboard";

export default function Home() {
  return (
    <div>
      <header className="text-center bg-green-200 py-10">
        <h1 className="text-4xl font-bold">Welcome to Lesson Overview</h1>
        <p className="text-xl mt-2">View and select a lesson!</p>
        <a href="/landing" className="inline-block mt-4 bg-white text-black font-bold py-2 px-4 rounded border border-gray-300">
          Back To HomePage
        </a>
        <hr></hr>
      </header>
      <ProfileBar />
      <LessonOverview />
    </div>
  );
}
