export type QuestionType =
    | "choice"
    | "multiple_choices"
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
    id_question: string
    type: QuestionType
    question: string
    options: string[]
    current_answer: string[]
    ans_key: string[] | null
}

export interface AttemptAnswer {
    id: string
    id_attempt: string
    id_question: string
    score: number
    created_at: string
    updated_at: string
    answer: string[]
}

export interface Attempt {
    id_event: string
    id_exam: string
    id_attempt: string
    id_account: string
    submitted: boolean
    remaining_time: number // in minutes
    due_at: string
    created_at: string
    answered_question: string[]
    questions: Question[]
    answers: AttemptAnswer[]
}

export interface AnswerAttemptResponse {
    message: string
    meta_data?: CodeMetadata
}

export interface AnswerAttemptPayload {
    question_id: string
    answer: string[]
}

export interface ExamListItem {
    id_exam: string
    slug: string
    title: string
    description: string
    duration: number
    randomize: number

    // not yet implemented
    is_completed: boolean
}

export interface ExamListResponse {
    data: ExamListItem[]
}

export interface AnswerQuestionResponse {
    status: string
    data: {
        question_id: string
        answer: string[]
    }
    message: string
    meta_data?: {
        cp_grader_result: {
            time_exec: number
            memory: number
            verdict: string
            score: number
        }
    }
}

export interface SubmitAttemptResponse {
    status: string
    data: {
        id_result: string
        id_attempt: string
        final_score: number
        exam_attempt: Attempt
    }
    message: string
    meta_data: Record<string, unknown>
}

export interface AttemptDetailResponse {
    status: string
    data: Attempt
    message: string
    meta_data: Record<string, unknown>
}
