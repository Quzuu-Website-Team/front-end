import QuizContainer from "../containers/QuizContainer"

const QuizPage = ({ params }: { params: { attemptSlug: string } }) => {
    return <QuizContainer slug={params.attemptSlug} />
}

export default QuizPage
