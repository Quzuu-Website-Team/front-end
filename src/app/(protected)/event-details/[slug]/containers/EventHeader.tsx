interface EventHeaderProps {
    title: string
    subtitle: string
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, subtitle }) => {
    return (
        <section className="head-info py-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            <h3 className="text-xl font-normal">{subtitle}</h3>
        </section>
    )
}

export default EventHeader
