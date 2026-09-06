import React, { useState } from 'react';
import { motion } from 'motion/react';
import { blogCategories } from '../assets/assets';
import { useBlog } from '../context/BlogContext';
import Blogcard from './Blogcard';
import { Sparkles, SearchX } from 'lucide-react';

const Bloglist = ({ searchQuery = '' }) => {
  const { blogs } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blogs based on category & search term (excluding private items)
  const filteredBlogs = blogs.filter((blog) => {
    if (blog.isPrivate) return false; // Private blogs only accessible in My Published Media section

    const matchesCategory =
      selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.subTitle && blog.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="px-4 sm:px-8 max-w-7xl mx-auto py-8">
      {/* Category Pills Header */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
        {blogCategories.map((item) => {
          const isSelected = selectedCategory === item;
          return (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`relative px-5 py-2 text-sm font-semibold rounded-2xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 glass-panel border border-slate-800'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="categoryUnderline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl -z-10"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {item}
                {item === 'All' && (
                  <span className="text-xs opacity-75 font-mono">({blogs.length})</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Blog Cards */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
          {filteredBlogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Blogcard blog={blog} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 max-w-xl mx-auto my-12 p-8">
          <SearchX className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white font-outfit">No stories found</h3>
          <p className="text-slate-400 text-sm mt-2">
            No blogs match your filter "{selectedCategory}" {searchQuery && `and search "${searchQuery}"`}. Try searching another topic!
          </p>
        </div>
      )}
    </section>
  );
};

export default Bloglist;
