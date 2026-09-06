import { Vlog } from '../models/Vlog.js';

export const getVlogs = async (req, res) => {
  try {
    const query = req.query.search
      ? { $or: ['title', 'filterStyle'].map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } })) }
      : {};
    const vlogs = await Vlog.find(query).sort({ updatedAt: -1 });
    return res.json({ success: true, count: vlogs.length, vlogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not load video projects.' });
  }
};

export const getVlogById = async (req, res) => {
  try {
    const vlog = await Vlog.findById(req.params.id);
    if (!vlog) return res.status(404).json({ success: false, message: 'Video project not found.' });
    return res.json({ success: true, vlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not load this video project.' });
  }
};

export const saveVlog = async (req, res) => {
  try {
    if (!req.body.title?.trim()) return res.status(400).json({ success: false, message: 'A project title is required.' });
    const id = req.body.id || req.body._id || `vlog_${Date.now()}`;
    const payload = { ...req.body, _id: id, id, lastModified: new Date().toISOString() };
    const vlog = await Vlog.findByIdAndUpdate(id, payload, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    return res.json({ success: true, vlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not save this video project.' });
  }
};

export const toggleVlogVisibility = async (req, res) => {
  try {
    const vlog = await Vlog.findById(req.params.id);
    if (!vlog) return res.status(404).json({ success: false, message: 'Video project not found.' });
    vlog.isPrivate = !vlog.isPrivate;
    await vlog.save();
    return res.json({ success: true, isPrivate: vlog.isPrivate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not change video visibility.' });
  }
};

export const deleteVlog = async (req, res) => {
  try {
    const vlog = await Vlog.findByIdAndDelete(req.params.id);
    if (!vlog) return res.status(404).json({ success: false, message: 'Video project not found.' });
    return res.json({ success: true, message: 'Video project deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not delete this video project.' });
  }
};

export const startRenderJob = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Video export needs a connected rendering provider before it can create an MP4 file.',
  });
};

export const getRenderStatus = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'No rendering provider is connected for this project.',
  });
};
