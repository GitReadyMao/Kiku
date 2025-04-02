import Link from "next/link";
import Image from "next/image";
import ProfileBar from "@/components/ProfileBar";
import Button from "react-bootstrap/esm/Button";

export default function LessonOne() {
  return (
    <>
    <br />
    <ProfileBar/>
    <div className="w-full min-h-screen bg-gray-100">

      <header className="w-full text-center py-6" style={{ backgroundColor: "#bdd99b" }}>
        <h1 className="text-4xl font-semibold">Hiragana and Katakana</h1>
      </header>
      <br />

      <div className="max-w-3xl mx-auto p-8 mt-6" style={{backgroundColor: "#ffb7c5"}}>
        <br />
        <h2 className="text-2xl font-bold text-green-700 mb-3">Learning Objectives</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Learning Objective 1</li>
          <li>Learning Objective 2</li>
          <li>Learning Objective 3</li>
          <li>Learning Objective 4</li>
        </ul>

        <h2 className="text-2xl font-bold mt-4">Welcome,</h2>
        <p className="mt-2">
          Katakana (<b>片仮名、カタカナ</b>) is a Japanese syllabary, one component of the Japanese writing system
          along with hiragana, kanji, and in some cases the Latin script (known as rōmaji).
        </p>

        <p className="mt-2">
          The word **katakana** means "fragmentary kana", as the katakana characters are derived from
          components or fragments of more complex kanji.
        </p>

        <h2 className="text-2xl font-bold mt-6">Hiragana,</h2>
        <p className="mt-2">
          Hiragana (<b>平仮名, ひらがな</b>) is a Japanese syllabary, part of the Japanese writing system,
          along with katakana as well as kanji.
        </p>

        <div className="flex flex-col md:flex-row items-center mt-6">
          <Image src="/Kikuflower.png" alt="Example" width={128} height={192} className="rounded-md md:ml-6" />
          <p className="mt-4 md:mt-0 md:mr-6">
            Hiragana and katakana are both kana systems. With few exceptions, each mora in the Japanese language
            is represented by one character (or one digraph) in each system.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-6">Usages</h2>
        <p className="mt-2">
          Hiragana and katakana are two different ways to write the same set of **46 sounds**. They’re the closest
          the Japanese language has to an alphabet.
        </p>
        <p className="mt-2">
          Usually, we write native Japanese words using **hiragana**, while **katakana** is used for borrowed words.
          For example, **ありがとう (arigatou)** uses **hiragana**, while **アメリカ (America)** uses **katakana**.
        </p>

        <div className="text-center mt-8">
          
        <Link href="LessonOnePractice/">
          <Button>
            Practice  
          </Button>
        </Link>
        </div>

        <div className="text-center mt-4">
          
          <Link href="/dashboard">
            <button className="px-4 py-2 text-lg text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-all">
              Back to Lessons
            </button>
          </Link>

        </div>
      </div>
    </div></>
  );
}
