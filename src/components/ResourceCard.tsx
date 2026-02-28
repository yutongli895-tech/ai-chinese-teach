import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Tag, User, Calendar, FileText, Globe, Feather, ArrowUpRight, Heart, Share2, Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "resource" | "tool";
  author: string;
  date: string;
  tags: string[];
  link: string;
  likes: number;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
  onTagClick?: (tag: string) => void;
  onClick?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index, onTagClick, onClick }) => {
  const [likes, setLikes] = useState(resource.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const storedLike = localStorage.getItem(`liked_${resource.id}`);
    if (storedLike === 'true') {
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
  }, [resource.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
      localStorage.removeItem(`liked_${resource.id}`);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      localStorage.setItem(`liked_${resource.id}`, 'true');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: resource.link,
        });
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      navigator.clipboard.writeText(resource.link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleTagClickInternal = (e: React.MouseEvent, tag: string) => {
      e.preventDefault();
      e.stopPropagation();
      onTagClick?.(tag);
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const typeStyles = {
    article: "text-stone-600 bg-stone-100/80",
    resource: "text-emerald-700 bg-emerald-50/80",
    tool: "text-indigo-600 bg-indigo-50/80",
  };

  const typeLabels = {
    article: "Article / 文章",
    resource: "Resource / 资源",
    tool: "Tool / 工具",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:bg-white/80",
        onClick && "cursor-pointer"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors backdrop-blur-sm",
              typeStyles[resource.type]
            )}
          >
            {typeLabels[resource.type]}
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            {resource.date}
          </span>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-stone-600 transition-colors leading-snug pr-6">
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="focus:outline-none"
              onClick={(e) => {
                if (onClick) {
                  e.preventDefault();
                  // Event will bubble up to card click
                }
              }}
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {resource.title}
            </a>
          </h3>
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed font-light">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-stone-200/50 pt-4">
        <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-stone-100/80 flex items-center justify-center text-stone-500">
                <User className="h-3 w-3" />
            </div>
            <span className="text-xs font-medium text-stone-600">{resource.author}</span>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
            <button 
                onClick={handleLike}
                className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors p-1.5 rounded-full hover:bg-stone-100/50",
                    isLiked ? "text-red-500" : "text-stone-400 hover:text-stone-600"
                )}
            >
                <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                <span>{likes}</span>
            </button>
            
            <button 
                onClick={handleShare}
                className="flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors p-1.5 rounded-full hover:bg-stone-100/50"
                title="Share"
            >
                {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                    <Share2 className="h-3.5 w-3.5" />
                )}
            </button>

            <div className="h-3 w-px bg-stone-200" />
            <div className="flex gap-2">
                {resource.tags.slice(0, 2).map(tag => (
                    <button 
                        key={tag} 
                        onClick={(e) => handleTagClickInternal(e, tag)}
                        className="text-[10px] text-stone-500 font-mono opacity-70 hover:opacity-100 hover:text-stone-800 hover:underline transition-all cursor-pointer"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="absolute top-6 right-6 opacity-0 -translate-x-2 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 pointer-events-none">
        <ArrowUpRight className="h-5 w-5 text-stone-400" />
      </div>
    </motion.div>
  );
}
