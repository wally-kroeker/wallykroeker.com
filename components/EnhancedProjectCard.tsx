import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from './StatusBadge'

interface EnhancedProjectCardProps {
    slug: string;
    title: string;
    description: string;
    status: "Active" | "Paused" | "Completed";
    stage?: string;
    tech?: string[];
    lastUpdated?: string;
    milestoneCount?: number;
    image?: string;
}

export default function EnhancedProjectCard({
    slug,
    title,
    description,
    status,
    stage,
    tech,
    lastUpdated,
    milestoneCount,
    image
}: EnhancedProjectCardProps) {
    return (
        <Link href={`/projects/${slug}`}
            className="block group border-2 border-zinc-800 rounded-xl overflow-hidden
                     hover:border-zinc-700 transition bg-zinc-900/20">
            {/* Hero Image (optional) */}
            {image && (
                <div className="aspect-video bg-zinc-900 overflow-hidden relative">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3 mb-4">
                    <StatusBadge status={status} />
                    {stage && <span className="text-sm text-zinc-400">{stage}</span>}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition">
                    {title}
                </h3>
                <p className="text-zinc-300 mb-4 leading-relaxed">{description}</p>

                {/* Tech Stack */}
                {tech && tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tech.map((item) => (
                            <span key={item}
                                className="px-2 py-1 text-xs bg-zinc-950 text-zinc-400 rounded border border-zinc-800">
                                {item}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer Metadata */}
                {(milestoneCount !== undefined || lastUpdated) && (
                    <div className="flex items-center justify-between text-sm text-zinc-500 pt-4 border-t border-zinc-800 mt-auto">
                        {milestoneCount !== undefined && <span>{milestoneCount} milestones</span>}
                        {lastUpdated && <span>Updated {lastUpdated}</span>}
                    </div>
                )}
            </div>
        </Link>
    );
}
