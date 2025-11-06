import QuizContainer from "../containers/QuizContainer"

const QuizPage = ({ params }: { params: { slug: string } }) => {
    return <QuizContainer slug={params.slug} />
}

export default QuizPage
