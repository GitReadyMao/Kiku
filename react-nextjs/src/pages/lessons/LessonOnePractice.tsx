import ProfileBar from "@/components/ProfileBar";
import Button from "react-bootstrap/esm/Button";
import { FaVolumeUp } from "react-icons/fa";
import questionBank from "./LessonOneQuestions";
import React, { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export default function LessonOne() {
    const [question] = useState(questionBank[0]); 
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
    };

    return (
        <>
            <br />
            <ProfileBar />
            <h2 className="text-center">Which sound do you hear?</h2>

            <div className="text-center">
                <Button>
                    <FaVolumeUp size="xl"></FaVolumeUp>
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
                            key={index}
                            style={{}}
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

        </>
    );
}

