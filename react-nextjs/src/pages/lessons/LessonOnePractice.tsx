import ProfileBar from "@/components/ProfileBar";
import Button from "react-bootstrap/esm/Button";
import { FaVolumeUp } from "react-icons/fa";
import questionBank from "./LessonOneQuestions";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useSound from 'use-sound';
import GetTermCount from "./Lessonapi copy";
import axios from "axios";
import { getCsrfToken } from "@/util/token";
import shuffleArray from "@/util/shuffle";

export default function LessonOne() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); //Updates what question you're currently on
    const question = questionBank[currentQuestionIndex];
    const [selectedAnswer, setSelectedAnswer] = useState<any | null>(null); //used for handling checking answers atm
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // keeps track of # of correct questions (TODO: add scoring/SRS components to this)
    const [showResults, setShowResults] = useState(false);

    const [loading, setLoading] = useState(true);
    const [termId, setTermId] = useState(0);
    const [answer, setAnswer] = useState<any>();
    const [questionTerms, setQuestionTerms] = useState<any[]>();

    const [playSound] = useSound("/mp3/お前【おまえ】.mp3");

    async function getTerms() {
        setLoading(true);

        const apiClient = axios.create({
            baseURL: "http://localhost:8080",
            withCredentials: true,
        });

        await apiClient.get(`/api/v1/term`, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
                'Lesson': 1,
            }
        }).then((response) => {
            setTermId(response.data.data.term_id);
        }).catch(err => console.error(err));

        await apiClient.get(`/api/v1/question-terms`, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
                'ID': 1,
            }
        }).then((response) => {
            console.log("r", response)
            setAnswer(response.data.term);
            var choices: Array<any> = response.data.choices;
            choices.push(response.data.term);
            shuffleArray(choices);
            setQuestionTerms(choices);
        }).catch(err => console.error(err));

        setLoading(false);
    }

    useEffect(() => {
        getTerms();
        console.log("t", termId)
        console.log("a", answer)
        console.log("q", questionTerms)
    }, [termId]);

    const handleAnswerClick = (ans: any) => {
        setSelectedAnswer(ans);
        if (ans.id === answer.id) {
            //study term api
            console.log("Good job chuddy");
        }
        else {
            //study term api
            console.log("Fuck you chuddy");
        }
    };
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionBank.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null); // Reset selection for the new question
        }
        else {
            setShowResults(true);  //Show results screen after quiz is completed
        }
    }

    return (
        <>
            <br />
            <ProfileBar />
            {showResults ? ( //handles displaying results 
                <div className="text-center">
                    <h2 className="mt-3">Quiz completed!</h2>
                    <h4>You got {correctAnswersCount} out of {questionBank.length} correct!</h4>
                    <Button variant="primary" className="mt-3" onClick={() => window.location.reload()}>
                        Restart Quiz
                    </Button>
                </div>
            ) : ( //handles displaying question content
                <div>
                    <h2 className="text-center">Which sound do you hear?</h2>

                    <br></br>

                    <div className="text-center">
                        <Button onClick={() => playSound()}>
                            <FaVolumeUp style={{ fontSize: '6vw' }} />
                            <span className="ms-1"> Click here to listen</span>
                        </Button>
                    </div>

                    <br></br>

                    <Row className="justify-content-center">
                        {loading ? (<></>) : questionTerms !== undefined ? (
                            questionTerms.map((term: any) => {
                                let variant: "outline-primary" | "success" | "danger" = "outline-primary";

                                if (selectedAnswer) {
                                    if (term.id === answer.id) {
                                        variant = "success"; // Green if correct
                                    } else if (term.id === selectedAnswer.id) {
                                        variant = "danger"; // Red if incorrect
                                    }
                                }

                                return (
                                    <Col
                                        key={term.id}
                                        xs={6} md={5} lg={5}
                                        className="d-flex justify-content-center mb-3"
                                    >
                                        <Button
                                            size="lg"
                                            className={`w-100 fw-bold fs-4 ${selectedAnswer !== null && term.id === answer.id && selectedAnswer.id ? 'custom-bright-green' : ''}`}
                                            variant={variant}
                                            onClick={() => handleAnswerClick(term)}
                                            disabled={selectedAnswer !== null}
                                            style={{
                                                backgroundColor: selectedAnswer !== null && term.id === answer.id && selectedAnswer.id ? '#28f745' : undefined,
                                                borderColor: selectedAnswer !== null && term.id === answer.id && selectedAnswer.id ? '#28f745' : undefined,
                                            }}
                                        >
                                            {term.hiragana}
                                        </Button>
                                    </Col>
                                );
                            })) : "Nothing to see here"}
                        {/* {question.answers.map((answer, index) => {
                            let variant: "outline-primary" | "success" | "danger" = "outline-primary";

                            if (selectedAnswer) {
                                if (answer === question.correctAnswer) {
                                    variant = "success"; // Green if correct
                                } else if (answer === selectedAnswer) {
                                    variant = "danger"; // Red if incorrect
                                }
                            }

                            return (
                                <Col
                                    key={index}
                                    xs={6} md={5} lg={5}
                                    className="d-flex justify-content-center mb-3"
                                >
                                    <Button
                                        size="lg"
                                        className={`w-100 fw-bold fs-4 ${answer === question.correctAnswer && selectedAnswer ? 'custom-bright-green' : ''}`}
                                        variant={variant}
                                        onClick={() => handleAnswerClick(answer)}
                                        disabled={selectedAnswer !== null}
                                        style={{
                                            backgroundColor: answer === question.correctAnswer && selectedAnswer ? '#28f745' : undefined,
                                            borderColor: answer === question.correctAnswer && selectedAnswer ? '#28f745' : undefined,
                                        }}
                                    >
                                        {answer}
                                    </Button>
                                </Col>
                            );
                        })} */}
                    </Row>

                    <Row className="justify-content-center mt-3">
                        <Col xs={8} md={4} lg={2} className="d-flex justify-content-center">
                            <Button
                                variant="secondary"
                                onClick={handleNextQuestion}
                                disabled={!selectedAnswer}
                                className="w-100"
                            >
                                Next Question: {GetTermCount()}
                            </Button>
                        </Col>
                    </Row>

                </div>
            )}
        </>
    );
}