import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WelcomingContent() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Register to access the material</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <p className="text-lg text-gray-500">
                        You need to register for this academy to access the
                        material content.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
