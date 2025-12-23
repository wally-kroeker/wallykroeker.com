export default function ProcessStep({
    number,
    title,
    description
}: {
    number: string
    title: string
    description: string
}) {
    return (
        <div className="relative p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
            <div className="text-5xl font-bold text-zinc-800/50 absolute -top-4 -left-2 select-none">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white mb-3 relative z-10 pt-2">{title}</h3>
            <p className="text-sm text-zinc-400 relative z-10 leading-relaxed">{description}</p>
        </div>
    )
}
