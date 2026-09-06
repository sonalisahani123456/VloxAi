import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple in-memory token bucket rate limiter for server-side Gemini API calls
const rateLimiter = {
  tokens: 20,
  maxTokens: 20,
  refillRate: 1, // 1 token per 2 seconds
  lastRefill: Date.now(),
  tryConsume(tokensNeeded = 1) {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsedSeconds * 0.5);
    this.lastRefill = now;

    if (this.tokens >= tokensNeeded) {
      this.tokens -= tokensNeeded;
      return true;
    }
    return false;
  },
};

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Keep the model configurable, while defaulting to the current fast text
  // model instead of the retired gemini-1.5-flash endpoint.
  return genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
};

// 1. Generate Blog Outline
export const generateOutline = async (req, res) => {
  try {
    const { title, subTitle, category } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!rateLimiter.tryConsume(1)) {
      return res.status(429).json({
        success: false,
        message: 'AI request limit reached. Please wait a few seconds before trying again.',
      });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are an expert tech blog editor and content strategist. 
Generate a rich, structured HTML blog article outline for a post titled "${title}".
Subtitle context: "${subTitle || ''}".
Category: "${category || 'Technology'}".

Requirements:
- Output clean HTML code (using <h1>, <h2>, <p>, <ul>, <li>, <strong>, <blockquote>).
- Do NOT wrap in markdown code fences (\`\`\`html). Output raw HTML tags directly.
- Include a strong introductory hook, 3 key takeaways with <ul> and <li>, a practical section, a quote block, and an actionable conclusion.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text() || '';
      const cleanHtml = generatedText.replace(/```html/g, '').replace(/```/g, '').trim();

      return res.json({ success: true, outline: cleanHtml, source: 'gemini-api' });
    } else {
      const fallbackOutline = `
<h1>${title}</h1>
<p><em>${subTitle || 'An in-depth exploration into modern innovation and creative execution.'}</em></p>
<h2>1. Executive Summary & Context</h2>
<p>Start with a compelling narrative hook establishing why ${title} matters today.</p>
<h2>2. Core Architectural Principles</h2>
<ul>
  <li><strong>First Principle:</strong> Streamline complexity through intelligent workflow automation.</li>
  <li><strong>Second Principle:</strong> Elevate aesthetic standards with modern 3D WebGL micro-interactions.</li>
  <li><strong>Third Principle:</strong> Deploy multi-platform syndication across web and mobile channels.</li>
</ul>
<h2>3. Hands-On Practical Implementation</h2>
<p>Detailed step-by-step guidance and code structures for implementing these ideas efficiently.</p>
<blockquote>"The key to sustainable creator velocity is seamless integration between human creativity and AI precision."</blockquote>
<h2>4. Crucial Pitfalls to Avoid</h2>
<p>Analyze key missteps such as generic styling, missing analytics, or lack of audience personalization.</p>
<h2>5. Conclusion & Action Plan</h2>
<p>Synthesize core learnings into immediate, actionable steps.</p>
      `.trim();

      return res.json({
        success: true,
        outline: fallbackOutline,
        source: 'simulated-fallback',
        notice: 'Add GEMINI_API_KEY in server/.env to use real Gemini AI model generation.',
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateOutline]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Polish Prose & Tone
export const polishText = async (req, res) => {
  try {
    const { contentHtml, tone } = req.body;
    if (!contentHtml) {
      return res.status(400).json({ success: false, message: 'Content HTML is required' });
    }

    if (!rateLimiter.tryConsume(1)) {
      return res.status(429).json({ success: false, message: 'AI request limit reached. Please wait a few seconds.' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Quill", a senior magazine editor and editorial writing specialist.
Refine and polish the following HTML article content to elevate its readability, grammar, and ${tone || 'executive professional'} tone.
Maintain all original HTML structure while refining word choice and flow.
Do NOT wrap output in code blocks or markdown fences. Return only the updated HTML.

HTML Content to Polish:
${contentHtml}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanHtml = (response.text() || '')
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

      return res.json({ success: true, polishedHtml: cleanHtml, source: 'gemini-api' });
    } else {
      const polished = contentHtml
        .replace(/<p>/g, '<p class="lead font-medium">')
        .concat('\n<p><strong>Quill Polish Note:</strong> Refined with editorial clarity & cadence.</p>');
      return res.json({ success: true, polishedHtml: polished, source: 'simulated-fallback' });
    }
  } catch (error) {
    console.error('[Gemini API Error - polishText]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Generate SEO Tags & Meta Description
export const generateSeoTags = async (req, res) => {
  try {
    const { title, category, contentHtml } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are an SEO optimization specialist.
Given a blog post titled "${title}" in category "${category || 'General'}", generate 5 high-converting, relevant SEO tag keywords.
Return your response ONLY as a JSON object with this exact structure:
{
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "metaDescription": "A concise 150-character meta description."
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      try {
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          tags: parsed.tags || [],
          metaDescription: parsed.metaDescription || '',
          source: 'gemini-api',
        });
      } catch (e) {
        return res.json({
          success: true,
          tags: [category.toLowerCase(), 'vlox ai', 'tech blog', 'ai creation', 'digital strategy'],
          metaDescription: `Discover key insights on ${title} at VloxAI.`,
          source: 'gemini-api-fallback',
        });
      }
    } else {
      const tags = [
        category.toLowerCase(),
        'ai content',
        'vlox ai 2026',
        'digital creation',
        'tech roadmap',
      ];
      return res.json({
        success: true,
        tags,
        metaDescription: `Explore in-depth analysis on ${title}.`,
        source: 'simulated-fallback',
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateSeoTags]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Headline A/B Generator (Quill Tool)
export const generateHeadlineAB = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Current title is required' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Quill", senior editorial strategist.
Given the current article title "${title}" in category "${category || 'Technology'}", generate 3 high-converting, alternative headline options designed to maximize reader CTR.
Return ONLY JSON format:
{
  "variants": [
    { "headline": "Option 1...", "ctrReason": "Reason why CTR is predicted high...", "predictedCTR": "+28%" },
    { "headline": "Option 2...", "ctrReason": "Reason why...", "predictedCTR": "+35%" },
    { "headline": "Option 3...", "ctrReason": "Reason why...", "predictedCTR": "+42%" }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json({ success: true, variants: parsed.variants || [], source: 'gemini-api' });
    } else {
      return res.json({
        success: true,
        variants: [
          { headline: `The Ultimate Guide to ${title}: 5 Game-Changing Insights`, ctrReason: 'Uses authority power words and clear numbered promise.', predictedCTR: '+32%' },
          { headline: `Why ${title} Is Redefining Content Studio Velocity in 2026`, ctrReason: 'Creates curiosity and timeliness around industry trends.', predictedCTR: '+41%' },
          { headline: `Stop Missing Out: What Top Creators Know About ${title}`, ctrReason: 'Employs FOMO and high-converting audience framing.', predictedCTR: '+48%' }
        ],
        source: 'simulated-fallback'
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateHeadlineAB]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Fact-Check Advisory Flag (Quill Tool)
export const factCheckDraft = async (req, res) => {
  try {
    const { contentHtml } = req.body;
    if (!contentHtml) {
      return res.status(400).json({ success: false, message: 'Content HTML is required' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Quill", senior fact-checker.
Scan the following HTML article text for unverified statistical, scientific, or factual claims that warrant citation or verification.
Return ONLY a JSON array of advisory flags:
{
  "flags": [
    { "claim": "Exact phrase from text...", "reason": "Why this claim needs a citation or verification...", "suggestion": "Suggested hedge or citation placement..." }
  ]
}

HTML Content:
${contentHtml}`;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json({ success: true, flags: parsed.flags || [], source: 'gemini-api' });
    } else {
      return res.json({
        success: true,
        flags: [
          { claim: 'boost audience engagement by 300%', reason: 'Statistical metric claim lacks authoritative benchmark link.', suggestion: 'Add link or state: "according to creator benchmarks".' },
          { claim: 'Reduces video production time by 80%', reason: 'Uncited performance metric.', suggestion: 'Provide source context for the 80% reduction statistic.' }
        ],
        source: 'simulated-fallback'
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - factCheckDraft]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Dual AI Persona Chat Router (Quill vs Nova vs Assistant)
export const chatCopilot = async (req, res) => {
  try {
    const { prompt, persona, actionType } = req.body;
    if (!prompt && !actionType) {
      return res.status(400).json({ success: false, message: 'Prompt or action type is required' });
    }

    if (!rateLimiter.tryConsume(1)) {
      return res.status(429).json({ success: false, message: 'Rate limit reached. Please pause briefly.' });
    }

    const model = getGeminiModel();

    let systemInstruction = '';
    if (persona === 'quill') {
      systemInstruction = `You are "Quill", the Blog AI Copilot for VloxAI. Your persona is editorial, precise, and literary — like a senior editor at a high-end magazine. You assist with prose refinement, headline A/B strategy, SEO alignment, and structural flow.`;
    } else if (persona === 'nova') {
      systemInstruction = `You are "Nova", the Vlog AI Director for VloxAI. Your persona is energetic, visual, and director-on-set focused. You assist with shot lists, avatar lip-sync beats, B-roll cutaway suggestions, and caption timing.`;
    } else {
      systemInstruction = `You are AI Vlox Assistant, an intelligent co-pilot for creators building 3D blogs and AI vlogs on VloxAI. Provide helpful, concise, aesthetically focused advice.`;
    }

    if (model) {
      let query = prompt;
      if (actionType === 'color') {
        query = 'Recommend 4 futuristic cyberpunk and modern dark-mode color palettes for a 3D glassmorphic blog/vlog design with exact hex codes.';
      } else if (actionType === 'grammar') {
        query = 'Explain best practices for polishing article grammar and tone for executive technical audiences.';
      } else if (actionType === 'translate') {
        query = 'Provide sample translations of a blog headline into Spanish, French, Japanese, and German.';
      } else if (actionType === 'summary') {
        query = 'Draft a 3-bullet executive summary format for high-impact technical articles.';
      }

      const result = await model.generateContent(`${systemInstruction}\n\nUser Request: ${query}`);
      const response = await result.response;

      return res.json({ success: true, reply: response.text() || '', source: 'gemini-api' });
    } else {
      let reply = '';
      if (persona === 'quill') {
        reply = `✨ **Quill Editorial Insight**: For maximum reader retention on "${prompt || 'your story'}", lead with a strong problem statement in the first 2 sentences, followed by an inline quote callout.`;
      } else if (persona === 'nova') {
        reply = `🎬 **Nova Director Beat**: For "${prompt || 'this scene'}", let's start with a wide 3D camera zoom, transition into the AI Avatar close-up at 0:15s, and overlay dynamic kinetic subtitles!`;
      } else {
        reply = `I evaluated your request "${prompt}".\n\n✨ **AI Recommendation:** Keep headlines concise, use glass card hover elevation, and maintain contrast!`;
      }

      return res.json({ success: true, reply, source: 'simulated-fallback' });
    }
  } catch (error) {
    console.error('[Gemini API Error - chatCopilot]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Generate Vlog Script & Clips
export const generateVlogScript = async (req, res) => {
  try {
    const { title, avatarName, avatarVoice } = req.body;

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Nova", video scriptwriter and director for AI avatar presenters.
Create an engaging 45-second script for an AI presenter named "${avatarName || 'Aria'}" (${avatarVoice || 'Studio Voice'}) discussing "${title || 'Future of AI Avatars'}".
Also suggest 3 visual video timeline clips with titles and durations.
Format output as JSON:
{
  "script": "The text script for the presenter...",
  "suggestedClips": [
    { "title": "Intro Motion Graphic", "duration": 10, "color": "bg-indigo-600/60 border-indigo-400" },
    { "title": "Avatar Presenter Shot", "duration": 25, "color": "bg-cyan-600/60 border-cyan-400" },
    { "title": "Spatial Mesh B-Roll", "duration": 15, "color": "bg-purple-600/60 border-purple-400" }
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      try {
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          script: parsed.script,
          suggestedClips: parsed.suggestedClips,
          source: 'gemini-api',
        });
      } catch (e) {
        return res.json({
          success: true,
          script: `Hey creators! Did you know that 3D AI video workflows can boost audience engagement by 300%? Here are 3 game-changing tools you need to build viral shorts today!`,
          source: 'gemini-api-fallback',
        });
      }
    } else {
      return res.json({
        success: true,
        script: `Hey creators! Did you know that 3D AI video workflows can boost audience engagement by 300%? Here are 3 game-changing tools you need to build viral shorts today!`,
        source: 'simulated-fallback',
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateVlogScript]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Shot List Generator (Nova Tool)
export const generateShotList = async (req, res) => {
  try {
    const { script, title } = req.body;
    if (!script && !title) {
      return res.status(400).json({ success: false, message: 'Script or title required' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Nova", Vlog AI Director.
Break down this script into a timestamped shot list mapped to avatar gestures and visual framing:
Script: "${script || title}"

Return ONLY JSON format:
{
  "shots": [
    { "timecode": "0:00 - 0:08", "framing": "Wide 3D Cyber City", "gesture": "Welcoming open arms", "beat": "Hook line and title intro" },
    { "timecode": "0:08 - 0:25", "framing": "Medium Avatar Shot", "gesture": "Hand pointing left to graphic", "beat": "Core thesis explanation" },
    { "timecode": "0:25 - 0:45", "framing": "Close Up Presenter", "gesture": "Nodding emphasis", "beat": "Call to action & broadcast" }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json({ success: true, shots: parsed.shots || [], source: 'gemini-api' });
    } else {
      return res.json({
        success: true,
        shots: [
          { timecode: '0:00 - 0:10', framing: 'Wide 3D Cyber City Flythrough', gesture: 'Welcoming gesture', beat: 'High-energy opening hook' },
          { timecode: '0:10 - 0:30', framing: 'Medium Shot Presenter', gesture: 'Hand pointing to overlay', beat: 'Core tool demonstration' },
          { timecode: '0:30 - 0:45', framing: 'Close Up Presenter', gesture: 'Empathetic nod', beat: 'Call to action & subscribe' }
        ],
        source: 'simulated-fallback'
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateShotList]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Auto-Captions Sync Generator (Nova Tool)
export const generateAutoCaptions = async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ success: false, message: 'Script text required' });
    }

    // Split script into sentences or chunks of ~5-7 words
    const words = script.split(/\s+/);
    const captionClips = [];
    let currentTime = 0;
    const wordsPerSecond = 2.5; // ~150 wpm

    for (let i = 0; i < words.length; i += 6) {
      const chunkWords = words.slice(i, i + 6);
      const text = chunkWords.join(' ');
      const duration = Math.max(2, Math.round(chunkWords.length / wordsPerSecond));

      captionClips.push({
        id: `sub_${Date.now()}_${i}`,
        text,
        start: currentTime,
        duration,
        color: 'bg-amber-600/60 border-amber-400',
      });

      currentTime += duration;
    }

    return res.json({ success: true, captions: captionClips, totalDuration: currentTime });
  } catch (error) {
    console.error('[Gemini API Error - generateAutoCaptions]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 10. B-Roll & Transition Suggester (Nova Tool)
export const generateBRollSuggestions = async (req, res) => {
  try {
    const { script } = req.body;

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Nova", Vlog AI Director.
Analyze this script and recommend 3 B-roll visual cutaways and transition presets:
Script: "${script}"

Return ONLY JSON:
{
  "suggestions": [
    { "title": "Neural Mesh Graphic", "recommendedAt": "0:12", "transition": "Crossfade", "color": "bg-purple-600/60 border-purple-400" },
    { "title": "Cyber Server Room Drone", "recommendedAt": "0:28", "transition": "Zoom-Blur", "color": "bg-cyan-600/60 border-cyan-400" }
  ]
}`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json({ success: true, suggestions: parsed.suggestions || [], source: 'gemini-api' });
    } else {
      return res.json({
        success: true,
        suggestions: [
          { title: '3D Neural Mesh Hologram', recommendedAt: '0:12', transition: 'Crossfade', duration: 10, color: 'bg-purple-600/60 border-purple-400' },
          { title: 'Cyberpunk Drone Flythrough', recommendedAt: '0:30', transition: 'Zoom-Blur', duration: 15, color: 'bg-cyan-600/60 border-cyan-400' }
        ],
        source: 'simulated-fallback'
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - generateBRollSuggestions]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 11. Voice DNA Continuity Checker
export const analyzeVoiceDna = async (req, res) => {
  try {
    const { contentHtml } = req.body;
    if (!contentHtml) {
      return res.status(400).json({ success: false, message: 'Content text or HTML is required' });
    }

    if (!rateLimiter.tryConsume(1)) {
      return res.status(429).json({ success: false, message: 'Rate limit reached. Please pause briefly.' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are "Quill", Voice Fingerprint & Tone Continuity Specialist.
Analyze this creator draft text against their typical brand voice fingerprint (average sentence length, vocabulary tier, and tone markers).
Flag any paragraph or section that drifts significantly from a standard engaging conversational-executive creator tone.

Return ONLY a JSON response:
{
  "fingerprint": {
    "avgSentenceLength": "14 words",
    "vocabularyTier": "Conversational Tech",
    "dominantTone": "Authoritative & Accessible",
    "consistencyScore": "88%"
  },
  "driftFlags": [
    {
      "snippet": "First 10-15 words of drifting paragraph...",
      "issue": "This paragraph reads more formal than your usual style.",
      "suggestion": "Use active voice and break up long sentences."
    }
  ]
}

Content to analyze:
${contentHtml}`;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        fingerprint: parsed.fingerprint || {
          avgSentenceLength: '15 words',
          vocabularyTier: 'Conversational Executive',
          dominantTone: 'Engaging & Direct',
          consistencyScore: '90%',
        },
        driftFlags: parsed.driftFlags || [],
        source: 'gemini-api',
      });
    } else {
      return res.json({
        success: true,
        fingerprint: {
          avgSentenceLength: '14 words',
          vocabularyTier: 'Conversational Tech',
          dominantTone: 'Authoritative & Accessible',
          consistencyScore: '86%',
        },
        driftFlags: [
          {
            snippet: 'Start with a compelling narrative hook establishing why modern tech...',
            issue: 'This paragraph reads more formal than your usual style.',
            suggestion: 'Use direct address ("you") and conversational transitions.',
          },
        ],
        source: 'simulated-fallback',
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - analyzeVoiceDna]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 12. Audience Simulator
export const simulateAudience = async (req, res) => {
  try {
    const { title, contentHtml, script } = req.body;
    const textToSimulate = contentHtml || script || title;
    if (!textToSimulate) {
      return res.status(400).json({ success: false, message: 'Draft content or title is required' });
    }

    if (!rateLimiter.tryConsume(1)) {
      return res.status(429).json({ success: false, message: 'Rate limit reached. Please pause briefly.' });
    }

    const model = getGeminiModel();
    if (model) {
      const prompt = `You are an Audience Persona Simulator.
Simulate 3 diverse audience personas reacting to this content draft:
1. "Skeptical Expert" (demands citations, looks for hype/fluff)
2. "Fast Skimmer" (wants key takeaways, scannable subheadings, immediate value)
3. "Superfan Enthusiast" (looks for inspirational framing and actionable tips)

Return ONLY a JSON response with this exact structure:
{
  "overallEngagement": "85%",
  "personas": [
    {
      "name": "Dr. Aris (Skeptical Expert)",
      "avatar": "🧪",
      "reaction": "Intriguing premise, but the claims in section 2 need concrete benchmarks.",
      "dropoffRisk": "Medium (at 40% mark)",
      "objection": "Lacks empirical evidence for the 300% efficiency metric."
    },
    {
      "name": "Maya (Fast Skimmer)",
      "avatar": "⚡",
      "reaction": "Loved the bullet points and key takeaways! Easy to digest quickly.",
      "dropoffRisk": "Low",
      "objection": "First intro paragraph could be 2 sentences shorter."
    },
    {
      "name": "Leo (Superfan)",
      "avatar": "🚀",
      "reaction": "Inspiring vision! The step-by-step framework is super actionable.",
      "dropoffRisk": "None",
      "objection": "Add a call-to-action link at the bottom."
    }
  ]
}

Content to simulate:
"${textToSimulate}"`;

      const result = await model.generateContent(prompt);
      const responseText = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(responseText);
      return res.json({
        success: true,
        overallEngagement: parsed.overallEngagement || '88%',
        personas: parsed.personas || [],
        source: 'gemini-api',
      });
    } else {
      return res.json({
        success: true,
        overallEngagement: '84%',
        personas: [
          {
            name: 'Dr. Aris (Skeptical Expert)',
            avatar: '🧪',
            reaction: 'Good thesis, but section 2 needs empirical benchmarking.',
            dropoffRisk: 'Medium (at 45% mark)',
            objection: 'Uncited performance metric in the second paragraph.',
          },
          {
            name: 'Maya (Fast Skimmer)',
            avatar: '⚡',
            reaction: 'Great scannable structure! Bullets make it easy to digest.',
            dropoffRisk: 'Low',
            objection: 'Trim opening lead by 1 sentence for faster hook.',
          },
          {
            name: 'Leo (Superfan)',
            avatar: '🚀',
            reaction: 'High energy and super actionable content! Ready to share.',
            dropoffRisk: 'None',
            objection: 'Include a direct community link at the end.',
          },
        ],
        source: 'simulated-fallback',
      });
    }
  } catch (error) {
    console.error('[Gemini API Error - simulateAudience]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
