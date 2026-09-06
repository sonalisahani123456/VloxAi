const API_BASE = '/api';

const readJson = async (response) => {
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'The server could not complete this request.');
  }
  return data;
};

export const api = {
  // Publishing OAuth — the server returns a provider URL only after it has
  // verified that the relevant platform credentials are configured.
  async getPublishingConnections(workspaceId) {
    const res = await fetch(`${API_BASE}/publishing/connections?workspaceId=${encodeURIComponent(workspaceId)}`);
    const data = await readJson(res);
    return data.connections || [];
  },

  async getPublishingAuthorizationUrl(platform, workspaceId, returnUrl) {
    const params = new URLSearchParams({ workspaceId, returnUrl });
    const res = await fetch(`${API_BASE}/publishing/${platform}/connect?${params.toString()}`);
    const data = await readJson(res);
    return data.authorizationUrl;
  },

  // Blogs
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE}/blogs?${query}` : `${API_BASE}/blogs`;
      const res = await fetch(url);
      const data = await readJson(res);
      return data.blogs || [];
    } catch (e) {
      console.error('API getBlogs error:', e);
      throw e;
    }
  },

  async getBlogById(id) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`);
      const data = await readJson(res);
      return data.blog;
    } catch (e) {
      console.warn('API getBlogById fallback:', e);
      return null;
    }
  },

  async createBlog(blogData) {
    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });
      const data = await readJson(res);
      return data.blog;
    } catch (e) {
      console.error('API createBlog error:', e);
      throw e;
    }
  },

  async updateBlog(id, blogData) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });
      const data = await readJson(res);
      return data.blog;
    } catch (e) {
      console.error('API updateBlog error:', e);
      throw e;
    }
  },

  async toggleBlogVisibility(id) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}/toggle-visibility`, {
        method: 'PATCH',
      });
      const data = await readJson(res);
      return data.isPrivate;
    } catch (e) {
      console.error('API toggleBlogVisibility error:', e);
      throw e;
    }
  },

  async clapBlog(id) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}/clap`, { method: 'PATCH' });
      const data = await readJson(res);
      return data.claps;
    } catch (e) {
      console.warn('API clapBlog fallback:', e);
      return null;
    }
  },

  async incrementBlogViews(id) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}/view`, { method: 'PATCH' });
      const data = await readJson(res);
      return data.views;
    } catch (e) {
      console.warn('API incrementBlogViews fallback:', e);
      return null;
    }
  },

  async deleteBlog(id) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
      await readJson(res);
      return true;
    } catch (e) {
      console.error('API deleteBlog error:', e);
      throw e;
    }
  },

  // Vlogs
  async getVlogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE}/vlogs?${query}` : `${API_BASE}/vlogs`;
      const res = await fetch(url);
      const data = await readJson(res);
      return data.vlogs || [];
    } catch (e) {
      console.error('API getVlogs error:', e);
      throw e;
    }
  },

  async saveVlog(vlogData) {
    try {
      const res = await fetch(`${API_BASE}/vlogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vlogData),
      });
      const data = await readJson(res);
      return data.vlog;
    } catch (e) {
      console.error('API saveVlog error:', e);
      throw e;
    }
  },

  async toggleVlogVisibility(id) {
    try {
      const res = await fetch(`${API_BASE}/vlogs/${id}/toggle-visibility`, {
        method: 'PATCH',
      });
      const data = await readJson(res);
      return data.isPrivate;
    } catch (e) {
      console.error('API toggleVlogVisibility error:', e);
      throw e;
    }
  },

  async deleteVlog(id) {
    try {
      const res = await fetch(`${API_BASE}/vlogs/${id}`, { method: 'DELETE' });
      await readJson(res);
      return true;
    } catch (e) {
      console.error('API deleteVlog error:', e);
      throw e;
    }
  },

  async renderVlog(id, renderSettings) {
    try {
      const res = await fetch(`${API_BASE}/vlogs/${id}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renderSettings),
      });
      return await res.json();
    } catch (e) {
      console.warn('API renderVlog fallback:', e);
      return { success: false, message: e.message };
    }
  },

  async getRenderStatus(id) {
    try {
      const res = await fetch(`${API_BASE}/vlogs/${id}/render-status`);
      return await res.json();
    } catch (e) {
      console.warn('API getRenderStatus fallback:', e);
      return { success: false, status: 'completed', progress: 100 };
    }
  },

  // Gemini AI Endpoints
  async generateOutline({ title, subTitle, category }) {
    try {
      const res = await fetch(`${API_BASE}/ai/outline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subTitle, category }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateOutline error:', e);
      return { success: false, message: e.message };
    }
  },

  async polishText({ contentHtml, tone }) {
    try {
      const res = await fetch(`${API_BASE}/ai/polish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentHtml, tone }),
      });
      return await res.json();
    } catch (e) {
      console.error('API polishText error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateSeoTags({ title, category, contentHtml }) {
    try {
      const res = await fetch(`${API_BASE}/ai/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, contentHtml }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateSeoTags error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateHeadlineAB({ title, category }) {
    try {
      const res = await fetch(`${API_BASE}/ai/headline-ab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateHeadlineAB error:', e);
      return { success: false, message: e.message };
    }
  },

  async factCheckDraft({ contentHtml }) {
    try {
      const res = await fetch(`${API_BASE}/ai/fact-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentHtml }),
      });
      return await res.json();
    } catch (e) {
      console.error('API factCheckDraft error:', e);
      return { success: false, message: e.message };
    }
  },

  async chatCopilot({ prompt, persona, actionType }) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, persona, actionType }),
      });
      return await res.json();
    } catch (e) {
      console.error('API chatCopilot error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateVlogScript({ title, avatarName, avatarVoice }) {
    try {
      const res = await fetch(`${API_BASE}/ai/vlog-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, avatarName, avatarVoice }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateVlogScript error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateShotList({ script, title }) {
    try {
      const res = await fetch(`${API_BASE}/ai/shot-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, title }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateShotList error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateAutoCaptions({ script }) {
    try {
      const res = await fetch(`${API_BASE}/ai/auto-captions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateAutoCaptions error:', e);
      return { success: false, message: e.message };
    }
  },

  async generateBRollSuggestions({ script }) {
    try {
      const res = await fetch(`${API_BASE}/ai/b-roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });
      return await res.json();
    } catch (e) {
      console.error('API generateBRollSuggestions error:', e);
      return { success: false, message: e.message };
    }
  },

  // User Profile & Authentication Sync
  async syncUser(userData, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/users/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (e) {
      console.warn('API syncUser fallback:', e);
      return { user: userData, isNewUser: false };
    }
  },

  async getUserProfile(clerkId) {
    try {
      const res = await fetch(`${API_BASE}/users/profile/${clerkId}`);
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.warn('API getUserProfile fallback:', e);
      return null;
    }
  },

  async updateUserProfile(clerkId, profileData) {
    try {
      const res = await fetch(`${API_BASE}/users/profile/${clerkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.warn('API updateUserProfile fallback:', e);
      return null;
    }
  },

  async getUserStats(clerkId) {
    try {
      const res = await fetch(`${API_BASE}/users/stats/${clerkId}`);
      const data = await res.json();
      return data.stats;
    } catch (e) {
      console.warn('API getUserStats fallback:', e);
      return null;
    }
  },

  async analyzeVoiceDna({ contentHtml }) {
    try {
      const res = await fetch(`${API_BASE}/ai/voice-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentHtml }),
      });
      return await res.json();
    } catch (e) {
      console.error('API analyzeVoiceDna error:', e);
      return { success: false, message: e.message };
    }
  },

  async simulateAudience({ title, contentHtml, script }) {
    try {
      const res = await fetch(`${API_BASE}/ai/audience-simulator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, contentHtml, script }),
      });
      return await res.json();
    } catch (e) {
      console.error('API simulateAudience error:', e);
      return { success: false, message: e.message };
    }
  },
};
