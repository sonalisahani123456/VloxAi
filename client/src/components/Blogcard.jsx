import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Sparkles, ArrowRight } from 'lucide-react';
import Tilt3DCard from './Tilt3DCard';

const Blogcard = ({ blog }) => {
  const { title, description, category, image, _id, createdAt, subTitle } = blog;
  const navigate = useNavigate();

  // Strip HTML for clean snippet
  const cleanDescription = description
    ? description.replace(/<[^>]+>/g, '').slice(0, 110) + '...'
    : '';

  // Approximate read time
  const wordCount = description ? description.split(/\s+/).length : 200;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <Tilt3DCard scaleOnHover={1.03} tiltMaxAngle={8} className="h-full rounded-2xl">
      <div
        onClick={() => navigate(`/blog/${_id}`)}
        className="group relative flex flex-col justify-between h-full rounded-2xl glass-panel bubble-hover border border-slate-800/80 overflow-hidden cursor-pointer shadow-lg"
      >
        {/* Cover Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-md">
            {category}
          </div>

          {/* Read Time */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              {formattedDate}
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug font-outfit">
              {title}
            </h3>
            {subTitle && (
              <p className="text-xs text-indigo-400/90 font-medium mt-1 line-clamp-1">
                {subTitle}
              </p>
            )}
            <p className="text-xs text-slate-300/80 mt-2 line-clamp-3 leading-relaxed">
              {cleanDescription}
            </p>
          </div>

          {/* Footer Card Actions */}
          <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                V
              </div>
              <span className="text-slate-300 font-medium">Vlox Creator</span>
            </div>

            <div className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Read Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
};

export default Blogcard;
