import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within a BlogProvider');
  return context;
};

export const BlogProvider = ({ children }) => {
  const readWorkspaceItems = (key) => {
    try {
      return JSON.parse(window.localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  };
  const [blogs, setBlogs] = useState([]);
  const [vlogProjects, setVlogProjects] = useState([]);
  // Avatar and AI Studio are client-side creative workspaces for now. Keep them
  // on the device so a refresh never discards a creator's generated work.
  const [avatarAssets, setAvatarAssets] = useState(() => readWorkspaceItems('vloxai-avatar-assets'));
  const [aiContents, setAiContents] = useState(() => readWorkspaceItems('vloxai-ai-contents'));
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [aiCredits, setAiCredits] = useState(185);
  const [toast, setToast] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [publishingWorkspaceId] = useState(() => {
    const existing = window.localStorage.getItem('vloxai-publishing-workspace');
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem('vloxai-publishing-workspace', created);
    return created;
  });
  const [publishingConnections, setPublishingConnections] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    window.setTimeout(() => setToast(null), 4000);
  };

  const refreshContent = async () => {
    setIsContentLoading(true);
    try {
      const [remoteBlogs, remoteVlogs] = await Promise.all([api.getBlogs(), api.getVlogs()]);
      setBlogs(remoteBlogs || []);
      setVlogProjects(remoteVlogs || []);
    } catch (error) {
      showToast('Could not load your workspace. Check that the backend is running.', 'error');
    } finally {
      setIsContentLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  const refreshPublishingConnections = async () => {
    try {
      const connections = await api.getPublishingConnections(publishingWorkspaceId);
      setPublishingConnections(connections);
    } catch (error) {
      // OAuth setup may intentionally be absent in local development.
      setPublishingConnections([]);
    }
  };

  useEffect(() => {
    refreshPublishingConnections();
  }, [publishingWorkspaceId]);

  useEffect(() => {
    window.localStorage.setItem('vloxai-avatar-assets', JSON.stringify(avatarAssets));
  }, [avatarAssets]);

  useEffect(() => {
    window.localStorage.setItem('vloxai-ai-contents', JSON.stringify(aiContents));
  }, [aiContents]);

  const saveWorkspaceItem = (setter, item, kind) => {
    const savedItem = {
      ...item,
      _id: item._id || `${kind}_${Date.now()}`,
      id: item.id || item._id || `${kind}_${Date.now()}`,
      isUserCreated: true,
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    };
    setter((current) => {
      const exists = current.some((entry) => entry._id === savedItem._id || entry.id === savedItem.id);
      return exists
        ? current.map((entry) => (entry._id === savedItem._id || entry.id === savedItem.id ? { ...entry, ...savedItem } : entry))
        : [savedItem, ...current];
    });
    return savedItem;
  };

  const saveAvatarAsset = (asset) => {
    const saved = saveWorkspaceItem(setAvatarAssets, asset, 'avatar');
    showToast('Avatar project saved to your workspace.');
    return saved;
  };

  const saveAiContent = (content) => {
    const saved = saveWorkspaceItem(setAiContents, content, 'ai');
    showToast('AI content saved to your workspace.');
    return saved;
  };

  const deleteAvatarAsset = (id) => {
    setAvatarAssets((current) => current.filter((item) => item._id !== id && item.id !== id));
    showToast('Avatar project deleted.', 'info');
  };

  const deleteAiContent = (id) => {
    setAiContents((current) => current.filter((item) => item._id !== id && item.id !== id));
    showToast('AI content deleted.', 'info');
  };

  const addBlog = async (blogData) => {
    const savedBlog = await api.createBlog({
      ...blogData,
      _id: `blog_${Date.now()}`,
      isPublished: true,
      isUserCreated: true,
      isPrivate: Boolean(blogData.isPrivate),
      claps: 0,
      views: 0,
    });
    if (!savedBlog) throw new Error('The server could not publish this story.');
    setBlogs((current) => [savedBlog, ...current]);
    showToast(savedBlog.isPrivate ? 'Story saved to your private workspace.' : 'Story published successfully.');
    return savedBlog._id;
  };

  const updateBlog = async (id, updatedData) => {
    const savedBlog = await api.updateBlog(id, updatedData);
    if (!savedBlog) throw new Error('The server could not update this story.');
    setBlogs((current) => current.map((blog) => (blog._id === id ? savedBlog : blog)));
    showToast('Story updated successfully.');
    return savedBlog;
  };

  const toggleBlogVisibility = async (id) => {
    const isPrivate = await api.toggleBlogVisibility(id);
    if (typeof isPrivate !== 'boolean') throw new Error('The server could not change visibility.');
    setBlogs((current) => current.map((blog) => (blog._id === id ? { ...blog, isPrivate } : blog)));
    showToast(isPrivate ? 'Moved to your private workspace.' : 'Published to the public feed.');
  };

  const deleteBlog = async (id) => {
    const deleted = await api.deleteBlog(id);
    if (!deleted) throw new Error('The server could not delete this story.');
    setBlogs((current) => current.filter((blog) => blog._id !== id));
    showToast('Story deleted.', 'info');
  };

  const saveVlogProject = async (projectData) => {
    const id = projectData.id || projectData._id || `vlog_${Date.now()}`;
    const savedProject = await api.saveVlog({
      ...projectData,
      id,
      _id: id,
      isUserCreated: true,
      isPrivate: Boolean(projectData.isPrivate),
    });
    if (!savedProject) throw new Error('The server could not save this video project.');
    setVlogProjects((current) => {
      const exists = current.some((project) => project._id === savedProject._id || project.id === savedProject.id);
      return exists
        ? current.map((project) => (project._id === savedProject._id || project.id === savedProject.id ? savedProject : project))
        : [savedProject, ...current];
    });
    showToast('Video project saved.');
    return savedProject._id || savedProject.id;
  };

  const toggleVlogVisibility = async (id) => {
    const isPrivate = await api.toggleVlogVisibility(id);
    if (typeof isPrivate !== 'boolean') throw new Error('The server could not change visibility.');
    setVlogProjects((current) => current.map((project) => (project._id === id || project.id === id ? { ...project, isPrivate } : project)));
    showToast(isPrivate ? 'Moved to your private workspace.' : 'Published to the public feed.');
  };

  const deleteVlogProject = async (id) => {
    const deleted = await api.deleteVlog(id);
    if (!deleted) throw new Error('The server could not delete this video project.');
    setVlogProjects((current) => current.filter((project) => project._id !== id && project.id !== id));
    showToast('Video project deleted.', 'info');
  };

  const consumeAiCredits = (amount = 10) => {
    if (aiCredits < amount) {
      showToast('AI credit limit reached.', 'error');
      return false;
    }
    setAiCredits((current) => current - amount);
    return true;
  };

  const connectPublishingPlatform = async (platform) => {
    try {
      const authorizationUrl = await api.getPublishingAuthorizationUrl(platform, publishingWorkspaceId, `${window.location.origin}/my-published`);
      window.location.assign(authorizationUrl);
    } catch (error) {
      showToast(error.message || `${platform} OAuth is not configured yet.`, 'error');
    }
  };

  const publishToPlatforms = (title, platforms) => {
    const connected = platforms?.filter((platform) => publishingConnections.some((connection) => connection.platform === platform));
    if (!connected?.length) {
      showToast('Connect a publishing account first.', 'info');
      return;
    }
    showToast(`${title} is ready to publish to ${connected.join(', ')}. Platform posting will activate after its account permissions are approved.`, 'info');
  };

  return (
    <BlogContext.Provider value={{
      blogs, vlogProjects, avatarAssets, aiContents, isContentLoading, aiCredits, toast, showToast, refreshContent,
      publishingConnections, publishingWorkspaceId, refreshPublishingConnections, connectPublishingPlatform,
      addBlog, updateBlog, toggleBlogVisibility, deleteBlog, saveVlogProject,
      toggleVlogVisibility, deleteVlogProject, consumeAiCredits, publishToPlatforms,
      saveAvatarAsset, saveAiContent, deleteAvatarAsset, deleteAiContent,
      currentUserProfile, setCurrentUserProfile,
    }}>
      {children}
    </BlogContext.Provider>
  );
};
