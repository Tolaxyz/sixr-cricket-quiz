import SixrQuiz from "../app/components/SixrQuiz";
import rawQuestions from "../app/data/questions.json";

export default function Page() {
  const formattedQuestions = rawQuestions.map((q, index) => ({
    id: index + 1,
    question: q.question,
    choices: q.options,
    answerIndex: q.options.indexOf(q.answer),
  }));

  return (
    <div className="p-4">
      <SixrQuiz questions={formattedQuestions} />
    </div>
  );
}
