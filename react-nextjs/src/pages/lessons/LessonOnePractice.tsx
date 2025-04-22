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
    const [selectedAnswer, setSelectedAnswer] = useState<any | null>(null); //used for handling checking answers atm
    const [showResults, setShowResults] = useState(false);

    const [loading, setLoading] = useState(true);
    const [termCount, setTermCount] = useState(0);
    const [termId, setTermId] = useState(0);
    const [answer, setAnswer] = useState<any>();
    const [questionTerms, setQuestionTerms] = useState<any[]>();

    const [playSound] = useSound("/mp3/感じ【かんじ】.mp3");

    async function getTermCount() {
        setLoading(true);
        const apiClient = axios.create({
            baseURL: "http://localhost:8080",
            withCredentials: true,
        });

        await apiClient.get(`/api/v1/term-count`, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
                'Lesson': 1,
            }
        }).then((response) => {
            setTermCount(response.data.count);
        }).catch(err => console.error(err));
        setLoading(false);
    }
    useEffect(() => {
        getTermCount();
    }, [termCount]);

    async function getTerms() {
        setLoading(true);
    
        const apiClient = axios.create({
            baseURL: "http://localhost:8080",
            withCredentials: true,
        });
    
        const fetchTerm = await apiClient.get(`/api/v1/term`, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
                'Lesson': 1,
            }
        }).catch(err => console.error(err));
    
        const newTermId = fetchTerm?.data.data.term_id;
        setTermId(fetchTerm?.data.data.term_id);
    
        const questionResponse = await apiClient.get(`/api/v1/question-terms`, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
                'ID': newTermId,
            }
        }).catch(err => console.error(err));
    
        if (questionResponse) {
            setAnswer(questionResponse.data.term);
            const choices = [...questionResponse.data.choices, questionResponse.data.term];
            shuffleArray(choices);
            setQuestionTerms(choices);
        }
    
        setLoading(false);
        
        console.log("tc", termCount)
        console.log("t", termId)
        console.log("a", answer)
        console.log("q", questionTerms)
    }
    useEffect(() => {
        getTerms();
    }, []);

    async function studyTerm(lvlMod: number) {
        setLoading(true);
        const apiClient = axios.create({
            baseURL: "http://localhost:8080",
            withCredentials: true,
        });

        await apiClient.post(`/api/v1/study-term`, {
            'term_id': termId,
            'level_mod': lvlMod,
        }, {
            headers: {
                'X-CSRF-Token': getCsrfToken(),
            }
        }).then(() => { console.log("term studied: " + termId + " " + lvlMod) }).catch(err => console.error(err));
        setLoading(false);
    }

    const handleAnswerClick = (ans: any) => {
        setSelectedAnswer(ans);
        if (ans.id === answer.id) {
            //study term api
            studyTerm(1);
            console.log("Good job chuddy");
        }
        else {
            //study term api
            studyTerm(-1);
            console.log("Fuck you chuddy");
        }
    };
   const handleNextQuestion = async () => {
    if (termCount > 0) {
        setShowResults(false);
        await getTerms();
        await getTermCount(); 
        setSelectedAnswer(null);
        setTermCount(prev => prev - 1);
    } else {
        setShowResults(true); //end quiz when termCount is 0.
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
                                Next Question: {termCount}
                            </Button>
                        </Col>
                    </Row>

                </div>
            )}
        </>
    );
}