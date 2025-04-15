import ProfileBar from "@/components/ProfileBar";
import Button from "react-bootstrap/esm/Button";
import { FaVolumeUp } from "react-icons/fa";
import questionBank from "./LessonOneQuestions";
import React, { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useSound from 'use-sound';
import mySound from '../../../public/mp3/omae.mp3';

export default function LessonOne() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); //Updates what question you're currently on
    const question = questionBank[currentQuestionIndex];
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); //used for handling checking answers atm
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // keeps track of # of correct questions (TODO: add scoring/SRS components to this)
    const [showResults, setShowResults] = useState(false);
    const [playSound] = useSound(mySound, { volume: 1.25 })

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
        if (answer === question.correctAnswer) {
            setCorrectAnswersCount(correctAnswersCount + 1);
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

                    <div className="text-center">
                        <Button onClick={() => playSound()}>
                            <FaVolumeUp size="xl" />
                            <span className="ms-1">Click here to listen</span>
                        </Button>
                    </div>

                    <Row className="justify-content-center">
                        {question.answers.map((answer, index) => {
                            let variant: "outline-primary" | "success" | "danger" = "outline-primary";

                            if (selectedAnswer) {
                                if (answer === question.correctAnswer) {
                                    variant = "success"; // Green if correct
                                } else if (answer === selectedAnswer) {
                                    variant = "danger"; // Red if incorrect
                                }
                            }

                            return (
                                <Col xs={6} className="mb-2" key={index}>
                                    <Button
                                        className="d-grid gap-2 col-12 btn-lg mx-auto"
                                        variant={variant}
                                        onClick={() => handleAnswerClick(answer)}
                                        disabled={selectedAnswer !== null} // Disable buttons after selection
                                    >
                                        {answer}
                                    </Button>
                                </Col>
                            );
                        })}
                    </Row>

                    <div className="mt-3">
                        <Button variant="secondary" onClick={handleNextQuestion} disabled={!selectedAnswer}>
                            Next Question
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}