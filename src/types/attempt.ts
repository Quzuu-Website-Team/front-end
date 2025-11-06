export type QuestionType =
    | "choice"
    | "multiple_choice"
    | "true_false_choice"
    | "short_answer"
    | "code_puzzle"
    | "competitive_programming"
    | "upload_file"

export interface Question {
    id: string
    question_type: QuestionType
    content: string
    options: string[]
    current_answer: string[]
    correctAnswer: string[] | null
}

export interface Attempt {
    id_event: string
    id_exam: string
    remaining_time: number
    answered_question: string[]
    questions: Question[]
}
