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
  content?: string; // Markdown content
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
  isDarkMode?: boolean;
  onTagClick?: (tag: string) => void;
  onClick?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index, isDarkMode, onTagClick, onClick }) => {
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
    article: "text-stone-600 dark:text-stone-400 bg-stone-100/80 dark:bg-stone-800/80",
    resource: "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/30",
    tool: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/30",
  };

  const typeLabels = {
    article: "深度文章",
    resource: "教学资源",
    tool: "智能工具",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 transition-all duration-500",
        isDarkMode 
          ? "bg-stone-900/60 border-stone-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:bg-stone-900/80 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-stone-700/50" 
          : "bg-white/90 border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-stone-300/60",
        "backdrop-blur-sm",
        onClick && "cursor-pointer"
      )}
    >
      {/* Subtle Ink Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-stone-100/50 dark:from-stone-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors backdrop-blur-sm",
              typeStyles[resource.type]
            )}
          >
            {typeLabels[resource.type]}
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono tracking-wider">
            {resource.date}
          </span>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[var(--text-ink)] group-hover:opacity-80 transition-colors leading-tight pr-6">
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="focus:outline-none"
              onClick={(e) => {
                if (onClick) {
                  e.preventDefault();
                }
              }}
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {resource.title}
            </a>
          </h3>
          <p className="text-[15px] text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed font-light font-serif">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="relative mt-10 flex items-center justify-between border-t border-stone-200/30 dark:border-stone-800/30 pt-5">
        <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500">
                <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">{resource.author}</span>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
            <button 
                onClick={handleLike}
                className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors p-1.5 rounded-full hover:bg-stone-100/50 dark:hover:bg-stone-800/50",
                    isLiked ? "text-red-500" : "text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
                )}
            >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span>{likes}</span>
            </button>
            
            <button 
                onClick={handleShare}
                className="flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors p-1.5 rounded-full hover:bg-stone-100/50 dark:hover:bg-stone-800/50"
                title="Share"
            >
                {isCopied ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                    <Share2 className="h-4 w-4" />
                )}
            </button>

            <div className="h-4 w-px bg-stone-200 dark:bg-stone-800" />
            <div className="flex gap-2">
                {resource.tags.slice(0, 1).map(tag => (
                    <button 
                        key={tag} 
                        onClick={(e) => handleTagClickInternal(e, tag)}
                        className="text-[11px] text-stone-500 dark:text-stone-500 font-mono opacity-80 hover:opacity-100 hover:text-stone-900 dark:hover:text-stone-200 hover:underline transition-all cursor-pointer"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="absolute top-7 right-7 opacity-0 -translate-x-3 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 pointer-events-none">
        <ArrowUpRight className="h-6 w-6 text-stone-300 dark:text-stone-600" />
      </div>
    </motion.div>
  );
}
