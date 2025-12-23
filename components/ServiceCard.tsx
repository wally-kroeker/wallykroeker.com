export default function ServiceCard({
    title,
    price,
    duration,
    description,
    includes,
    bestFor
}: {
    title: string
    price?: string
    duration: string
    description: string
    includes: string[]
    bestFor: string
}) {
    return (
        <div className="p-8 border-2 border-zinc-800 rounded-xl hover:border-zinc-700 transition bg-zinc-900/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <div className="text-left md:text-right">
                    {price && <div className="text-2xl font-bold text-white mb-1">{price}</div>}
                    <div className="text-sm text-zinc-400">{duration}</div>
                </div>
            </div>

            <p className="text-zinc-300 mb-6 leading-relaxed">{description}</p>

            <div className="mb-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                    What's Included
                </h4>
                <ul className="space-y-3">
                    {includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="text-blue-400 mt-1 shrink-0">✓</span>
                            <span className="text-zinc-300 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-4 border-t border-zinc-800">
                <p className="text-sm text-zinc-400">
                    <strong className="text-zinc-300">Best for:</strong> {bestFor}
                </p>
            </div>
        </div>
    )
}
