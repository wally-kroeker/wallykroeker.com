import { DaemonSection, getSectionMeta } from '@/lib/daemon'

interface DaemonCardProps {
  section: DaemonSection
  size?: 'default' | 'large'
}

export default function DaemonCard({ section, size = 'default' }: DaemonCardProps) {
  const meta = getSectionMeta(section.name)
  const isLarge = size === 'large'
  
  return (
    <div className={`group p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 ${isLarge ? 'md:p-8' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`${isLarge ? 'text-4xl' : 'text-3xl'} group-hover:scale-110 transition-transform duration-300`}>
          {meta.icon}
        </div>
        <div>
          <h3 className={`font-semibold text-white group-hover:text-emerald-400 transition-colors ${isLarge ? 'text-xl' : 'text-lg'}`}>
            {meta.title}
          </h3>
          {meta.description && (
            <p className="text-sm text-zinc-500">{meta.description}</p>
          )}
        </div>
      </div>
      
      {/* Content */}
      {section.items.length > 0 ? (
        <ul className={`space-y-2 mt-4 ${isLarge ? 'columns-1 md:columns-2 gap-x-8' : ''}`}>
          {section.items.slice(0, isLarge ? 10 : 5).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400 break-inside-avoid">
              <span className="text-emerald-600 mt-0.5 flex-shrink-0">-</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
          {section.items.length > (isLarge ? 10 : 5) && (
            <li className="text-sm text-zinc-600 pl-4">
              +{section.items.length - (isLarge ? 10 : 5)} more...
            </li>
          )}
        </ul>
      ) : (
        <div 
          className={`prose prose-invert prose-sm prose-zinc prose-p:text-zinc-400 prose-p:leading-relaxed max-w-none ${isLarge ? '' : 'line-clamp-6'}`}
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      )}
    </div>
  )
}
