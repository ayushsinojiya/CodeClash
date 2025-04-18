import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "./dropdown-menu";
import { Button } from "./button";
import { Card } from "./card";

export default function Subject() {
    const [questions, setQuestions] = useState([]);
    const [sortBy, setSortBy] = useState("difficulty");
    const [filterBy, setFilterBy] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/questions?page=${page}`);
                setQuestions(response.data.questions);
                setTotalPages(Math.ceil(response.data.total / 25));
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [page]);

    const filteredQuestions = useMemo(() => {
        let filtered = [...questions];
        if (filterBy !== "all") {
            filtered = filtered.filter((q) => q["Difficulty Level"] === filterBy);
        }
        if (sortBy === "difficulty") {
            filtered.sort(
                (a, b) =>
                    difficultyOrder[a["Difficulty Level"]] - difficultyOrder[b["Difficulty Level"]]
            );
        } else if (sortBy === "topic") {
            filtered.sort((a, b) => a["Topic"].localeCompare(b["Topic"]));
        }
        return filtered;
    }, [questions, sortBy, filterBy]);

    const handleSolve = (id) => {
        console.log(id);
        navigate(`/details/${id}`); // Use navigate to navigate
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="flex mx-40 flex-col w-3/4 h-screen bg-background">
            <div className="flex-1 p-6 gap-6">
                <div className="bg-card p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Filters</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <span className="mr-2">Difficulty</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuRadioGroup value={filterBy} onValueChange={setFilterBy}>
                                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Easy">Easy</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Hard">Hard</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <span className="mr-2">Sort By</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                    <DropdownMenuRadioItem value="difficulty">Difficulty</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="topic">Topic</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Questions</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid gap-4">
                            {filteredQuestions.map((question) => (
                                <Card key={question._id} className="bg-background p-2 rounded-lg shadow-md">
                                    <div className="flex justify-between items-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${question["Difficulty Level"] === "Easy"
                                                    ? "bg-green-100 text-green-600"
                                                    : question["Difficulty Level"] === "Medium"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {question["Difficulty Level"]}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold">{question["Question Title"]}</h3>
                                    <p className="text-muted-foreground mb-2">{question["Topic"]}</p>
                                    <div
                                        className="w-full bg-green-500 hover:bg-green-400 text-center cursor-pointer"
                                        onClick={() => {
                                            handleSolve(question._id);
                                        }}
                                    >
                                        Solve
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    <div className="pagination flex justify-between mt-4">
                        <Button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronDownIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
