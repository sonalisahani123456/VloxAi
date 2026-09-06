import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuillBlogCopilot from '../components/QuillBlogCopilot';
import { useBlog } from '../context/BlogContext';
import { api } from '../services/api';
import { blogCategories } from '../assets/assets';
import { motion } from 'motion/react';
import {
  PenTool,
  Eye,
  Save,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Sparkles,
  Languages,
  Wand2,
  FilePenLine,
  ArrowRight,
  RefreshCw,
  SpellCheck,
  Maximize2,
  AlignLeft,
  Check,
} from 'lucide-react';

const BlogEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { blogs, addBlog, updateBlog, showToast } = useBlog();

  const existingBlog = id ? blogs.find((b) => b._id === id) : null;

  const [title, setTitle] = useState(existingBlog ? existingBlog.title : '');
  const [subTitle, setSubTitle] = useState(existingBlog ? existingBlog.subTitle || '' : '');
  const [category, setCategory] = useState(
    existingBlog ? existingBlog.category : blogCategories[1] || 'Technology'
  );
  const [imageUrl, setImageUrl] = useState(existingBlog ? existingBlog.image || '' : '');
  const [contentHtml, setContentHtml] = useState(
    existingBlog
      ? existingBlog.description
      : '<h2>Introduction</h2><p>Write your engaging story here...</p>'
  );

  useEffect(() => {
    if (location.state?.repurposedOutline) {
      setContentHtml(location.state.repurposedOutline);
      showToast('Loaded repurposed vlog outline into editor!');
    }
    if (location.state?.title) {
      setTitle(location.state.title);
    }
  }, [location.state]);

  const [seoKeywords, setSeoKeywords] = useState([]);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [creationMode, setCreationMode] = useState(existingBlog ? 'ai' : null);
  const [translationLanguage, setTranslationLanguage] = useState('Hindi');
  const [translationResult, setTranslationResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [manualAssistAction, setManualAssistAction] = useState(null);
  const [manualAssistResult, setManualAssistResult] = useState('');
  const [coverIdea, setCoverIdea] = useState('');
  const [coverIdeaLoading, setCoverIdeaLoading] = useState(false);
  const richEditorRef = useRef(null);

  const PRESET_COVERS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  ];

  useEffect(() => {
    if (!imageUrl && PRESET_COVERS[0]) {
      setImageUrl(PRESET_COVERS[0]);
    }
  }, []);

  // AI output and editor state always render into the lower visual writing box.
  useEffect(() => {
    if (richEditorRef.current && richEditorRef.current.innerHTML !== contentHtml) {
      richEditorRef.current.innerHTML = contentHtml;
    }
  }, [contentHtml]);

  const formatAiOutputForEditor = (text = '') => {
    const clean = text.replace(/```(?:html|markdown)?/gi, '').replace(/```/g, '').trim();
    return clean
      .split(/\n{2,}/)
      .map((block) => {
        const line = block.trim();
        if (!line) return '';
        const heading = line.match(/^#{1,3}\s+(.+)/);
        const body = (heading ? heading[1] : line)
          .replace(/^>\s*/gm, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        return heading ? `<h2>${body}</h2>` : `<p>${body.replace(/\n/g, '<br />')}</p>`;
      })
      .join('');
  };

  const appendHtmlTag = (tag) => {
    if (tag === 'h1') {
      setContentHtml((prev) => prev + '\n<h1>New Main Heading</h1>');
    } else if (tag === 'h2') {
      setContentHtml((prev) => prev + '\n<h2>Section Subheading</h2>');
    } else if (tag === 'p') {
      setContentHtml((prev) => prev + '\n<p>Add body paragraph details here...</p>');
    } else if (tag === 'bold') {
      setContentHtml((prev) => prev + ' <strong>Bold text</strong> ');
    } else if (tag === 'italic') {
      setContentHtml((prev) => prev + ' <em>Italic text</em> ');
    } else if (tag === 'ul') {
      setContentHtml(
        (prev) =>
          prev +
          '\n<ul><li>Key takeaway 1</li><li>Key takeaway 2</li><li>Key takeaway 3</li></ul>'
      );
    } else if (tag === 'quote') {
      setContentHtml(
        (prev) => prev + '\n<blockquote>"Insightful quote from an industry leader."</blockquote>'
      );
    } else if (tag === 'code') {
      setContentHtml(
        (prev) =>
          prev +
          '\n<pre><code>const vloxAi = () => {\n  console.log("Future of Content");\n};</code></pre>'
      );
    }
  };

  const handleTranslateDraft = async () => {
    const draft = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!draft) {
      showToast('Write some content before translating.', 'error');
      return;
    }

    setIsTranslating(true);
    const res = await api.chatCopilot({
      persona: 'quill',
      prompt: `Translate this blog draft into ${translationLanguage}. Keep headings and paragraphs clear. Return only the translated article text.\n\n${draft}`,
      actionType: 'custom',
    });
    setIsTranslating(false);

    if (res?.success && res.reply) {
      setTranslationResult(res.reply);
      showToast(`Translation to ${translationLanguage} is ready.`);
    } else {
      showToast(res?.message || 'Could not translate this draft.', 'error');
    }
  };

  const handleManualAssist = async (action) => {
    if (!contentHtml.replace(/<[^>]+>/g, '').trim()) {
      showToast('Write some content before using this tool.', 'error');
      return;
    }

    setManualAssistAction(action);
    let result;
    if (action === 'grammar' || action === 'readability') {
      result = await api.polishText({
        contentHtml,
        tone: action === 'grammar' ? 'grammatically correct, professional and natural' : 'clear, simple and easy to read',
      });
      if (result?.success && result.polishedHtml) setManualAssistResult(result.polishedHtml);
    } else {
      const draft = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const instruction = action === 'expand'
        ? 'Expand this article with useful details, examples and smooth transitions. Preserve its topic and return only the improved article.'
        : 'Rewrite this article to be concise, clear and engaging. Keep the essential ideas and return only the improved article.';
      result = await api.chatCopilot({ persona: 'quill', actionType: 'custom', prompt: `${instruction}\n\n${draft}` });
      if (result?.success && result.reply) setManualAssistResult(result.reply);
    }
    setManualAssistAction(null);

    if (result?.success) showToast('Your improved draft is ready to review.');
    else showToast(result?.message || 'Could not improve this draft.', 'error');
  };

  const handleGenerateCoverIdea = async () => {
    if (!title.trim()) {
      showToast('Add a story title first.', 'error');
      return;
    }
    setCoverIdeaLoading(true);
    const res = await api.chatCopilot({
      persona: 'quill',
      actionType: 'custom',
      prompt: `Create a concise, production-ready blog cover image prompt for this story: "${title}". Subtitle: "${subTitle}". Include subject, composition, lighting, colors, and the instruction: no text, no logo, no watermark.`,
    });
    setCoverIdeaLoading(false);
    if (res?.success && res.reply) {
      const coverBrief = `<h2>AI Cover Visual Direction</h2>${formatAiOutputForEditor(res.reply)}`;
      setCoverIdea('Added to the article editor below.');
      setContentHtml((current) => `${coverBrief}${current}`);
      window.setTimeout(() => richEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
      showToast('AI cover direction was added to the article editor below.');
    }
    else showToast(res?.message || 'Could not generate a cover concept.', 'error');
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contentHtml.trim()) {
      showToast('Title and content cannot be empty!', 'error');
      return;
    }

    try {
      const payload = {
        title,
        subTitle,
        category,
        image: imageUrl || PRESET_COVERS[0],
        description: contentHtml,
        isPublished: true,
      };

      if (existingBlog) {
        await updateBlog(existingBlog._id, payload);
        navigate(`/blog/${existingBlog._id}`);
      } else {
        const newId = await addBlog(payload);
        navigate(`/blog/${newId}`);
      }
    } catch (error) {
      showToast(error.message || 'Could not save this story.', 'error');
    }
  };

  const cleanText = contentHtml.replace(/<[^>]+>/g, '');
  const wordCount = cleanText ? cleanText.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!existingBlog && !creationMode) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-200 text-xs font-bold"><PenTool className="w-4 h-4" /> VLOXAI BLOG STUDIO</div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-black font-outfit text-white">How would you like to create?</h1>
              <p className="mt-4 text-slate-400 leading-7">Choose your starting point. You will still have the full editor, formatting controls and translation tools in either mode.</p>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-5">
              <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setCreationMode('ai')}
                className="group text-left rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-600/20 via-indigo-950/60 to-slate-950 p-7 sm:p-8 shadow-xl shadow-violet-950/20 transition hover:border-violet-300/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 border border-violet-300/25 text-violet-200"><Wand2 className="w-6 h-6" /></div>
                <h2 className="mt-6 text-2xl font-bold text-white">Create with AI</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Start with a topic and let Scribe build your outline, polish your tone, test headlines, improve SEO and check key claims.</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-violet-200"><span className="rounded-full bg-violet-400/10 px-3 py-1.5">Outline generator</span><span className="rounded-full bg-violet-400/10 px-3 py-1.5">SEO tools</span><span className="rounded-full bg-violet-400/10 px-3 py-1.5">Translate draft</span></div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white">Create with AI <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setCreationMode('manual')}
                className="group text-left rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/12 via-slate-950 to-slate-950 p-7 sm:p-8 shadow-xl shadow-cyan-950/15 transition hover:border-cyan-300/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-300/20 text-cyan-200"><FilePenLine className="w-6 h-6" /></div>
                <h2 className="mt-6 text-2xl font-bold text-white">Create manually</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Write from scratch with a clean editor, headings, paragraphs, lists, quotes, code blocks, cover selection and live preview.</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-cyan-100"><span className="rounded-full bg-cyan-400/10 px-3 py-1.5">Rich formatting</span><span className="rounded-full bg-cyan-400/10 px-3 py-1.5">Live preview</span><span className="rounded-full bg-cyan-400/10 px-3 py-1.5">Translate draft</span></div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white">Start writing <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></span>
              </motion.button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                <PenTool className="w-4 h-4" />
                <span>3D BLOG AUTHORING STUDIO</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-outfit">
                {existingBlog ? 'Edit Blog Post' : 'Author New Story'}
              </h1>
              {!existingBlog && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs font-bold">
                  <button type="button" onClick={() => setCreationMode('ai')} className={`px-3 py-1.5 rounded-lg transition ${creationMode === 'ai' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'}`}>AI mode</button>
                  <button type="button" onClick={() => setCreationMode('manual')} className={`px-3 py-1.5 rounded-lg transition ${creationMode === 'manual' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Manual mode</button>
                </div>
              )}
            </div>

            {/* Mode Switcher & Publish Action */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-1 rounded-xl glass-panel border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Write Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D Live Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{existingBlog ? 'Update Post' : 'Publish Story'}</span>
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            /* Write View Mode */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Form (Left 2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Subtitle Card */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Building Scalable 3D Web Apps in 2026..."
                      className="w-full px-4 py-3 rounded-2xl glass-input text-lg font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Subtitle / Hook Line
                    </label>
                    <input
                      type="text"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      placeholder="A short punchy preview of your article's main value proposition..."
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Category & Cover Image Setup */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 focus:outline-none"
                      >
                        {blogCategories
                          .filter((c) => c !== 'All')
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-2">
                        Cover Image URL
                      </label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Preset Covers Selector */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                      Or Pick a Preset Cover:
                    </span>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {PRESET_COVERS.map((preset, idx) => (
                        <img
                          key={idx}
                          src={preset}
                          alt="preset"
                          onClick={() => setImageUrl(preset)}
                          className={`w-20 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                            imageUrl === preset ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-pink-400/20 bg-pink-500/[0.055] p-4">
                    <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-pink-200">AI cover concept</p><p className="mt-1 text-[11px] text-slate-400">Generate a ready-to-use visual brief for your title.</p></div><button type="button" disabled={coverIdeaLoading} onClick={handleGenerateCoverIdea} className="shrink-0 rounded-xl border border-pink-300/25 bg-pink-400/10 px-3 py-2 text-xs font-bold text-pink-100 transition hover:bg-pink-400/20 disabled:opacity-50">{coverIdeaLoading ? 'Creating...' : 'Create concept'}</button></div>
                    {coverIdea && <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] p-3 text-xs font-semibold text-emerald-200"><Check className="h-4 w-4 shrink-0" />{coverIdea}</div>}
                  </div>
                </div>

                {/* Rich Editor Area */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                  <div className="mb-4 flex items-center gap-2 text-xs font-bold text-indigo-200"><FilePenLine className="h-4 w-4" />ARTICLE EDITOR — AI OUTPUT APPEARS HERE</div>
                  {/* Rich Text Quick Formatting Toolbar */}
                  <div className="flex items-center gap-1.5 flex-wrap pb-4 border-b border-slate-800 mb-4 text-slate-300">
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('h1')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Add H1 Heading"
                    >
                      <Heading1 className="w-4 h-4" />
                      <span>H1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('h2')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Add H2 Heading"
                    >
                      <Heading2 className="w-4 h-4" />
                      <span>H2</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('p')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 text-xs font-bold cursor-pointer"
                      title="Add Paragraph"
                    >
                      Paragraph
                    </button>
                    <div className="w-px h-5 bg-slate-800 mx-1" />
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('bold')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
                      title="Bold text"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('italic')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
                      title="Italic text"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('ul')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('quote')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
                      title="Blockquote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => appendHtmlTag('code')}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
                      title="Code Block"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Visual rich-text editor — content is stored as HTML, but never shown as raw code. */}
                  <div
                    ref={richEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setContentHtml(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    data-placeholder="Start writing your story..."
                    className="blog-rich-editor min-h-[26rem] w-full rounded-2xl bg-slate-950/25 p-4 text-sm leading-7 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-400/40 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500"
                  />

                  {/* Word Count Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Word Count: {wordCount} words</span>
                    <span>Estimated Read Time: {readTime} min</span>
                  </div>
                </div>
              </div>

              {/* AI / Translation Sidebar (Right 1 Col) */}
              <div className="space-y-6">
                {creationMode === 'ai' && (
                  <QuillBlogCopilot
                    title={title}
                    subTitle={subTitle}
                    category={category}
                    contentHtml={contentHtml}
                    setContentHtml={setContentHtml}
                    setTitle={setTitle}
                    setSeoKeywords={setSeoKeywords}
                  />
                )}

                {creationMode === 'manual' && (
                  <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20">
                    <div className="flex items-center gap-2"><div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-300"><SpellCheck className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-white">Writing tools</h3><p className="text-[11px] text-slate-400">Improve your draft while staying in control</p></div></div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[['grammar', 'Fix grammar', SpellCheck], ['expand', 'Expand draft', Maximize2], ['concise', 'Make concise', AlignLeft], ['readability', 'Improve clarity', Wand2]].map(([action, label, Icon]) => (
                        <button key={action} type="button" disabled={manualAssistAction !== null} onClick={() => handleManualAssist(action)} className="flex min-h-[4.5rem] flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left text-xs font-bold text-slate-200 transition hover:border-emerald-300/30 hover:bg-emerald-400/[0.07] disabled:opacity-50">
                          {manualAssistAction === action ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" /> : <Icon className="w-4 h-4 text-emerald-300" />}{label}
                        </button>
                      ))}
                    </div>
                    {manualAssistResult && <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-slate-950/70 p-3"><p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">{manualAssistResult.replace(/<[^>]+>/g, ' ')}</p><button type="button" onClick={() => { setContentHtml(manualAssistResult.includes('<') ? manualAssistResult : `<p>${manualAssistResult.replace(/\n/g, '</p><p>')}</p>`); setManualAssistResult(''); showToast('Improved draft applied to editor.'); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"><Check className="w-3.5 h-3.5" />Apply to draft</button></div>}
                  </div>
                )}

                <div className="glass-panel p-5 rounded-3xl border border-cyan-500/20">
                  <div className="flex items-center gap-2"><div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-300"><Languages className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-white">Translate your draft</h3><p className="text-[11px] text-slate-400">Available in both writing modes</p></div></div>
                  <select value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50"><option>Hindi</option><option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Japanese</option></select>
                  <button type="button" disabled={isTranslating} onClick={handleTranslateDraft} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-400/20 disabled:opacity-50">{isTranslating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}{isTranslating ? 'Translating...' : `Translate to ${translationLanguage}`}</button>
                  {translationResult && <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-slate-950/70 p-3"><p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">{translationResult}</p><button type="button" onClick={() => { setContentHtml(`<p>${translationResult.replace(/\n/g, '</p><p>')}</p>`); setTranslationResult(''); showToast('Translated draft applied to editor.'); }} className="mt-3 w-full rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300">Apply translation to draft</button></div>}
                </div>
              </div>
            </div>
          ) : (
            /* Immersive 3D Reader Preview Mode */
            <div className="relative mx-auto max-w-5xl py-4 sm:py-8 [perspective:1800px]">
              <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-4/5 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[110px]" />
              <motion.article
                initial={{ opacity: 0, y: 20, rotateX: 4 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ y: -5, rotateX: 1.2, rotateY: -0.8 }}
                transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/90 shadow-[0_32px_90px_rgba(0,0,0,0.5),0_0_50px_rgba(99,102,241,0.15)] [transform-style:preserve-3d]"
              >
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-indigo-500/25 via-violet-500/10 to-transparent" />
                <div className="relative px-6 pb-10 pt-10 sm:px-12 sm:pb-14 sm:pt-14">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-400/10 px-3 py-1.5 text-indigo-200"><PenTool className="w-3.5 h-3.5" /> {category}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-slate-400">{wordCount} words · {readTime} min read</span>
                  </div>
                  <h1 className="mt-7 max-w-4xl font-outfit text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{title || 'Untitled Story Title'}</h1>
                  {subTitle && <p className="mt-4 max-w-3xl text-lg leading-8 text-indigo-200 sm:text-xl">{subTitle}</p>}

                  {imageUrl && (
                    <div className="group relative mt-9 aspect-[16/8] w-full overflow-hidden rounded-3xl border border-white/12 bg-slate-900 shadow-2xl shadow-indigo-950/40">
                      <img src={imageUrl} alt="Blog cover preview" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-slate-950/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white/80 backdrop-blur">Cover preview</div>
                    </div>
                  )}

                  <div className="mx-auto mt-10 max-w-3xl border-t border-white/10 pt-8">
                    <div className="blog-preview text-[1.02rem] leading-8 text-slate-200" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  </div>
                </div>
              </motion.article>
              <p className="mt-5 text-center text-xs text-slate-500">Move your cursor over the article to see the depth effect.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogEditor;
