import EventExam from "./containers/EventExam"

const QuizPage = ({
    params,
}: {
    params: { attemptSlug: string; slug: string }
}) => {
    return <EventExam eventSlug={params.slug} examSlug={params.attemptSlug} />
}

export default QuizPage
