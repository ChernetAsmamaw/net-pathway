import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface AptitudeTestProps {
  onBack: () => void;
}

const questions = [
  {
    id: 1,
    category: "Analytical Thinking",
    question:
      "If all roses are flowers and some flowers fade quickly, which statement is correct?",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade quickly",
      "Roses never fade",
    ],
    correctAnswer: 1,
  },
  // Add more questions here (total 30)
];

export default function AptitudeTest({ onBack }: AptitudeTestProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const getCurrentQuestions = () => {
    const start = (currentPage - 1) * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Assessment Options</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aptitude Assessment
          </h2>
          <p className="text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="space-y-8">
          {getCurrentQuestions().map((q, idx) => (
            <div key={q.id} className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-sky-600">
                  {q.category}
                </span>
                <h3 className="text-lg font-medium text-gray-900 mt-1">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-3">
                {q.options.map((option, optionIdx) => (
                  <label
                    key={optionIdx}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={answers[q.id] === optionIdx}
                      onChange={() => handleAnswer(q.id, optionIdx)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => {
              if (currentPage === totalPages) {
                // Handle test submission
                console.log("Test completed:", answers);
              } else {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }
            }}
            className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800"
          >
            {currentPage === totalPages ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
