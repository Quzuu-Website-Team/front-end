import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EventOverview = async () => {
    return (
        <Card className="text-slate-800">
            <CardHeader>
                <CardTitle>Event Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal ml-5 space-y-2">
                    <li>
                        Soal Ujian terdiri dari 2 jenis. Bagian A : Soal Pilihan
                        Ganda dan Isian
                    </li>
                    <li>Dan Bagian B : Soal Membuat Program</li>
                    <li>
                        Lorem ipsum dolar si amet Lorem ipsum dolar si ametLorem
                        ipsum dolar si amet
                    </li>
                    <li>
                        Lorem ipsum dolar si amet Lorem ipsum dolar si ametLorem
                        ipsum dolar si amet
                    </li>
                </ol>
            </CardContent>
        </Card>
    )
}

export default EventOverview
