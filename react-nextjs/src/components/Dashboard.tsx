import Image from "next/image";
import Link from "next/link";
import Button from "react-bootstrap/esm/Button";

const LessonOverview = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-10">
            <div className="flex flex-row gap-8">
                {["Hiragana and Katakana", "Kanji Mastery", "Japanese Grammar"].map((title, index) => (
                    <section
                        key={index}
                        style={{ background: "#ffb7c5" }}
                        className="w-[260px] py-8 px-10 text-center rounded-lg shadow-lg"
                    >
                        <h2 className="uppercase font-bold text-3xl mb-4">{title}</h2>

                        {/* Image */}
                        <Image
                            src="/Kikuflower.png"
                            alt="Lesson Image"
                            width={200}
                            height={150}
                            className="mx-auto mb-4 rounded-lg"
                        />

                        <p className="text-sm leading-relaxed mb-6">
                            Learn the fundamentals of {title.toUpperCase()} in this lesson. According to all known laws of aviation, there is no way a bee should be able to fly.
                            Its wings are too small to get its fat little body off the ground.
                            The bee, of course, flies anyway because bees don't care what humans think is impossible.
                            Yellow, black. Yellow, black. Yellow, black. Yellow, black.
                            Ooh, black and yellow!
                            Let's shake it up a little.
                            Barry! Breakfast is ready!
                            Coming!
                            Hang on a second.
                            Hello?
                            Barry?
                            Adam?
                            Can you believe this is happening?
                            I can't.
                            I'll pick you up.
                            Looking sharp.
                            Use the stairs, Your father paid good money for those.
                            Sorry. I'm excited.
                            Here's the graduate.
                            We're very proud of you, son.
                        </p>
                        
                        <Link href="lessons/LessonOne/">
                            <Button style={{ color: "#ffb7c5" }}
                                className="px-6 bg-white rounded-full hover:ring-1 hover:text-white hover:bg-inherit py-2 hover:ring-white transition-all">
                                Lesson {index + 1}
                            </Button>
                        </Link>
                    </section>
                ))}
            </div>
        </div>

    );
};

export default LessonOverview;
