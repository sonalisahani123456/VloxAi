import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="px-4 sm:px-8 max-w-5xl mx-auto my-16">
      <div className="relative rounded-3xl glass-panel-glow border border-indigo-500/30 p-8 sm:p-12 overflow-hidden text-center">
        {/* Glow Blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly AI & Content Digest</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-outfit">
            Stay Ahead in AI Blogging & Vlog Creation
          </h2>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Get exclusive guides on AI avatars, viral vlog strategies, 3D web design trends, and multi-platform growth delivered straight to your inbox.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 font-semibold text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>You're subscribed! Welcome to the Vlox Creator Club.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-5 py-3.5 rounded-2xl glass-input text-sm text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
