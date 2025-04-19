import InitializeLesson from "@/components/InitializeLesson";
import ProfileBar from "@/components/ProfileBar";
import { getCsrfToken } from "@/util/token";
import axios from "axios";
import Link from 'next/link';


export default function LessonOne() {
  
  

  return (
    <>
      <ProfileBar />
      <title>Lesson 1 : きく</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
      <link
        rel="stylesheet"
        href="https://www.w3schools.com/lib/w3-theme-black.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n .center-text {\n text-align: center;\n}\n\n .content {\n max-width: 900px;\n margin: auto;\n padding: 20px;\n }\n\n .image-container {\n text-align: center;\n margin-top: 20px;\n }\n\n .image-left {\n  float: left;\n margin-right: 20px;\n }\n\n .image-right {\n float: right;\n margin-left: 20px;\n }\n\n .clearfix {\n overflow: auto;\n}\n"
        }}
      />
      <header
        className="w3-container w3-padding w3-center"
        style={{ backgroundColor: "#bdd99b !important" }}
      >
        <h1 style={{ fontWeight: 600 }}>Hiragana and Katakana</h1>
      </header>
      <div className="w3-container w3-white w3-padding content w3-card-4">
        <h2 className="w3-text-theme">Learning Objectives</h2>
        <ul>
          <li>Learning Objective 1</li>
          <li>Learning Objective 2</li>
          <li>Learning Objective 3</li>
          <li>Learning Objective 4</li>
        </ul>
        <h2>Welcome,</h2>
        <p>
          Katakana (片仮名、カタカナ, IPA: [katakaꜜna, kataꜜkana]) is a Japanese
          syllabary, one component of the Japanese writing system along with
          hiragana,[2] kanji and in some cases the Latin script (known as rōmaji).
        </p>
        <p>
          The word katakana means "fragmentary kana", as the katakana characters are
          derived from components or fragments of more complex kanji. Katakana and
          hiragana are both kana systems. With one or two minor exceptions, each
          syllable (strictly mora) in the Japanese language is represented by one
          character or kana in each system.
        </p>
        <h2>Hiragana,</h2>
        <p>
          Hiragana (平仮名, ひらがな, IPA: [çiɾaɡaꜜna, çiɾaɡana(ꜜ)]) is a Japanese
          syllabary, part of the Japanese writing system, along with katakana as
          well as kanji. It is a phonetic lettering system. The word hiragana means
          "common" or "plain" kana (originally also "easy", as contrasted with
          kanji).[1][2][3]
        </p>
        <div className="image-container clearfix">
          <img
            src="/Kikuflower.png"
            alt="example"
            className="image-right"
            width={412}
            height={223}
          />
          <p>
            Hiragana and katakana are both kana systems. With few exceptions, each
            mora in the Japanese language is represented by one character (or one
            digraph) in each system. This may be a vowel such as /a/ (hiragana あ);
            a consonant followed by a vowel such as /ka/ (か); or /N/ (ん), a nasal
            sonorant which, depending on the context and dialect, sounds either like
            English m, n or ng ([ŋ]) when syllable-final or like the nasal vowels of
            French, Portuguese or Polish.
          </p>
        </div>
        <h2>Casual / Ranking System</h2>
        <p>
          Hiragana and katakana are two different ways to write the same set of 46
          sounds. They’re the closest the Japanese language has to an alphabet. The
          primary difference between this kind of writing system – technically a
          'syllabary' – and an 'alphabet'? Characters generally represent a whole
          sound (like ‘ki’ or ‘ra’), rather than individual letters (like ‘k’ or
          ‘r’).
        </p>
        <p>
          Usually, we write native Japanese words using hiragana, while katakana is
          used for words borrowed from other languages. So, for example, arigatou,
          Japanese for “thank you”, is typically written ありがとう (a ri ga to u)
          using hiragana characters, whereas “America” is written アメリカ (a me ri
          ka) using katakana.
        </p>
        <p />
        <div className="w3-center w3-margin-top">
          <Link href="LessonOne">
            <button
              onClick={InitializeLesson}
              className="btn "
              style={{
                fontSize: 'clamp(14px, 4vw, 25px)', 
                padding: '10px 20px',              
                backgroundColor: '#ff5833',
                color: 'white',
                border: 'none',
                borderRadius: '10px'
              }}
            >
             Go to Lesson One Practice
            </button>

          </Link>

        </div>
      </div>
    </>

  );
}
