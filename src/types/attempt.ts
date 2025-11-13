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
        exam_attempt: {
            id_attempt: string
            id_account: string
            id_event: string
            id_exam: string
            remaining_time: number
            created_at: string
            due_at: string
            submitted: boolean
        }
    }
    message: string
    meta_data: Record<string, unknown>
}
