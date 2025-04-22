import ProfileBar from "@/components/ProfileBar";
import Button from "react-bootstrap/esm/Button";
import { FaVolumeUp } from "react-icons/fa";
import questionBank from "./LessonOneQuestions";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useSound from 'use-sound';
import axios from "axios";
import { getCsrfToken } from "@/util/token";
import shuffleArray from "@/util/shuffle";

export default function LessonOne() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const question = questionBank[currentQuestionIndex];
    if (!question) return null;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [freeResponse, setFreeResponse] = useState(false);
    const [playSound] = useSound(question.audio);

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer !== null && freeResponse) return;
        setSelectedAnswer(answer);
        setFreeResponse(true);
        if (answer === question.correctAnswer) {
            setCorrectAnswersCount(prev => prev + 1);
        }
    };


    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionBank.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null); // Reset selection for the new question
            setFreeResponse(false);
        } else {
            setShowResults(true);  //Show results screen after quiz is completed
        }
    };

    return (
        <>
            <br />
            <ProfileBar />

            {showResults ? ( //handles displaying results
                <div className="text-center">
                    <h2 className="mt-3">Lesson completed!</h2>
                    <Button variant="primary" className="mt-3" onClick={() => window.location.reload()}>
                        Restart Quiz
                    </Button>
                </div>
            ) : ( //handles displaying question content
                <div>
                    <h2 className="text-center">{question.question}</h2>
                    <br />
                    <div className="text-center">
                        <Button onClick={() => playSound()}>
                            <FaVolumeUp style={{ fontSize: '6vw' }} />
                            <span className="ms-1"> Click here to listen</span>
                        </Button>
                    </div>
                    <br />

                    {question.type === "mcq" ? (
                        <Row className="justify-content-center">
                            {question.answers.map((answer, index) => {
                                let variant: "outline-primary" | "success" | "danger" = "outline-primary";
                                if (selectedAnswer) {
                                    if (answer === question.correctAnswer) {
                                        variant = "success";
                                    } else if (answer === selectedAnswer) {
                                        variant = "danger";
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
                            })}
                        </Row>
                    ) : (
                        <Row className="justify-content-center">
                            <Col xs={10} md={6} className="text-center">
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-3"
                                    placeholder="Type what you heard..."
                                    value={selectedAnswer || ""}
                                    onChange={(e) => {
                                        setSelectedAnswer(e.target.value);
                                        setFreeResponse(false);
                                    }}
                                    disabled={freeResponse}
                                />

                                {!freeResponse && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleAnswerClick(selectedAnswer ?? "")}
                                        disabled={!selectedAnswer || selectedAnswer.trim().length < 2} //Won't let you submit unless you typed out 2 characters.
                                    >
                                        Submit
                                    </Button>
                                )}

                                {freeResponse && selectedAnswer && (
                                    <div className="mb-3">
                                        {selectedAnswer === question.correctAnswer ? (
                                            <span className="text-success fs-5">Correct! 🤗</span>
                                        ) : (
                                            <span className="text-danger fs-5">Incorrect 🥺. Correct answer: {question.correctAnswer}</span>
                                        )}
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}

                    <Row className="justify-content-center mt-3">
                        <Col xs={8} md={4} lg={2} className="d-flex justify-content-center">
                            <Button
                                variant="secondary"
                                onClick={handleNextQuestion}
                                disabled={ //disables the gray button for FRQ/MCQ respectively
                                    question.type === "multiple-choice"
                                        ? !selectedAnswer
                                        : !freeResponse
                                }
                                className="w-100"
                            >
                                Next Question
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
}