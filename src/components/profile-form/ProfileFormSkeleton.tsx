export default function ProfileFormSkeleton() {
    return (
        <div className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            {/* Phone & School Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            {/* City & Province Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between pt-4">
                <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
        </div>
    )
}
