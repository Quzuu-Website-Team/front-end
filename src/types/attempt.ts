export type QuestionType =
    | "choice"
    | "multiple_choice"
    | "true_false_choice"
    | "short_answer"
    | "code_puzzle"
    | "competitive_programming"
    | "upload_file"

export type Verdict = "AC" | "WA" | "TLE" | "RTE" | "CE"

export interface CodeMetadata {
    verdict: Verdict
    score: number
    time_exec: number
    memory: number
}

export interface Question {
    id: string
    question_type: QuestionType
    content: string
    options: string[]
    current_answer: string[]
    correct_answer: string[] | null
}

export interface Attempt {
    id_event: string
    id_exam: string
    id_attempt: string
    submitted: boolean
    remaining_time: number
    answered_question: string[]
    questions: Question[]
}

export interface AnswerAttemptResponse {
    message: string
    meta_data?: CodeMetadata
}
