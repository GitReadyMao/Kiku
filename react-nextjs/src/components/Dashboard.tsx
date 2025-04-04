import Image from 'react-bootstrap/Image';
import Link from "next/link";

const LessonOverview = () => {

    const lessonLinks = ["/lessons/LessonOne", "/lessons/LessonTwo", "/lessons/LessonThree"];

    return (
        <div className="text-center mt-4" id="lessons">
            <p style={{ fontSize: "20px" }}>Explore key aspects of the Japanese language</p>

            <div className="row" style={{ marginTop: '64px' }}>
                {[
                    { title: "Hiragana and Katakana", description: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.", img: "/Kikuflower.png" },
                    { title: "Kanji Mastery", description: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.", img: "/Kikuflower.png" },
                    { title: "Japanese Grammar", description: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.", img: "/Kikuflower.png" }
                ].map((lesson, index) => (
                    <div key={index} className="col-md-4 col-sm-6 mb-4">
                        <div className="card" style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
                            <div className="card-body">
                                <h3 className="card-title">{lesson.title}</h3>

                                <Image
                                    src={lesson.img}
                                    alt={lesson.title}
                                    width={200}
                                    height={150}
                                    fluid
                                    className="rounded-lg my-3"
                                />

                                <p className="card-text">{lesson.description}</p>


                                <Link href={lessonLinks[index]}>
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
                                        Start Lesson {index + 1}
                                    </button>

                                </Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonOverview;
