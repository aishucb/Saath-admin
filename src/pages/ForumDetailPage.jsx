import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Divider,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ForumDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', body: '', tagInput: '' });
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');
  const [deletingComment, setDeletingComment] = useState(null);
  
  // Reply functionality
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [addingReply, setAddingReply] = useState(false);
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await api.get(`/forum/forum/${id}`);
        setForum(response.data.forumPost);
      } catch (err) {
        setError('Failed to fetch forum details');
        console.error('Error fetching forum:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchAdmin = async () => {
      try {
        const response = await api.get('/admin/me');
        setAdmin(response.data.admin);
        console.log('Admin set in ForumPage:', response.data.admin);
      } catch (err) {
        // ignore
      }
    };
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await api.get(`/forumcomment/all-forum-comments/${id}`);
        if (response.data.success && response.data.comments) {
          setComments(response.data.comments);
        } else {
          setCommentsError('Invalid response format');
        }
      } catch (err) {
        setCommentsError('Failed to fetch comments');
        console.error('Error fetching comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    
    fetchForum();
    fetchAdmin();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (forum) {
      setEditData({
        title: forum.title,
        body: forum.body,
        tagInput: ''
      });
      setTags(forum.tags || []);
    }
  }, [forum]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/forum/forum/${id}`);
      navigate('/forums', { state: { tab: 'me' } });
    } catch (err) {
      setDeleteError('Failed to delete forum');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
    setEditError('');
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setEditError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && editData.tagInput.trim()) {
      e.preventDefault();
      const newTag = editData.tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setEditData(prev => ({
        ...prev,
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmitEdit = async () => {
    if (!editData.title.trim() || !editData.body.trim()) {
      setEditError('Title and body are required');
      return;
    }

    setSaving(true);
    setEditError('');

    try {
      const response = await api.put(`/forum/${id}`, {
        title: editData.title.trim(),
        body: editData.body.trim(),
        tags: tags
      });
      
      setForum(response.data.forumPost);
      setEditing(false);
    } catch (err) {
      console.error('Error updating forum:', err);
      setEditError(err.response?.data?.error || 'Failed to update forum');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingComment(commentId);
    try {
      await api.delete(`/forumcomment/${commentId}`);
      // Refresh comments after deletion
      const response = await api.get(`/forumcomment/all-forum-comments/${id}`);
      if (response.data.success && response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    } finally {
      setDeletingComment(null);
    }
  };

  const handleReplyClick = (comment) => {
    setReplyToComment(comment);
    setReplyContent('');
    setReplyError('');
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setReplyToComment(null);
    setReplyContent('');
    setReplyError('');
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      setReplyError('Reply content is required');
      return;
    }

    setAddingReply(true);
    setReplyError('');

    try {
      const response = await api.post('/forumcomment/add', {
        forumId: id,
        userId: admin?._id || '685d209fd04f883e85784c72', // Use admin ID or fallback
        content: replyContent.trim(),
        replyTo: replyToComment._id
      });

      if (response.status === 201) {
        // Refresh comments after adding reply
        const commentsResponse = await api.get(`/forumcomment/all-forum-comments/${id}`);
        if (commentsResponse.data.success && commentsResponse.data.comments) {
          setComments(commentsResponse.data.comments);
        }
        handleCloseReplyDialog();
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      setReplyError(err.response?.data?.error || 'Failed to add reply');
    } finally {
      setAddingReply(false);
    }
  };

  // Helper function to build comment tree
  const buildCommentTree = (flatComments) => {
    console.log('Building comment tree with:', flatComments);
    
    const idToComment = {};
    const roots = [];

    // First pass: create all comment objects with empty replies array
    for (const comment of flatComments) {
      idToComment[comment._id] = {
        ...comment,
        replies: []
      };
    }

    // Second pass: build the tree structure
    for (const comment of flatComments) {
      console.log(`Comment ${comment._id}:`, {
        content: comment.content?.substring(0, 30) + '...',
        replyTo: comment.replyTo,
        hasParent: comment.replyTo && idToComment[comment.replyTo]
      });
      
      if (comment.replyTo && idToComment[comment.replyTo]) {
        // This is a reply, add it to its parent's replies
        idToComment[comment.replyTo].replies.push(idToComment[comment._id]);
        console.log(`Added ${comment._id} as reply to ${comment.replyTo}`);
      } else {
        // This is a root comment (no replyTo or replyTo doesn't exist)
        roots.push(idToComment[comment._id]);
        console.log(`Added ${comment._id} as root comment`);
      }
    }

    console.log('Final tree structure:', roots);
    return roots;
  };

  const renderComment = (comment, isReply = false) => {
    const commentDate = comment.addedTime ? new Date(comment.addedTime).toLocaleString() : 'Unknown';
    
    // Check if this comment is a reply (has replyTo field or is nested)
    const isReplyComment = comment.replyTo || isReply;
    
    return (
      <Box
        key={comment._id}
        sx={{
          marginLeft: isReply ? 4 : 0,
          marginTop: 2,
          padding: 2,
          backgroundColor: isReply ? '#f8f9fa' : '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
              {comment.userId?.name || comment.userId || 'Anonymous'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {commentDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={() => handleReplyClick(comment)}
              sx={{ 
                fontSize: '0.75rem', 
                padding: '2px 8px',
                minWidth: 'auto',
                color: '#666',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  color: '#333'
                }
              }}
            >
              Reply
            </Button>
            <IconButton
              size="small"
              onClick={() => handleDeleteComment(comment._id)}
              disabled={deletingComment === comment._id}
              sx={{ color: '#dc3545' }}
            >
              {deletingComment === comment._id ? (
                <CircularProgress size={16} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.5 }}>
          {comment.content}
        </Typography>
        
        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </Box>
        )}
      </Box>
    );
  };

  if (loading) return <div>Loading forum details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!forum) return <div>Forum not found</div>;

  // Only show delete if admin is creator
  const getCreatedById = (createdBy) => {
    if (!createdBy) return '';
    if (typeof createdBy === 'string') return createdBy;
    if (typeof createdBy === 'object' && createdBy._id) return createdBy._id;
    return '';
  };
  const isCreator = admin && getCreatedById(forum.createdBy) === String(admin._id);

  return (
    <Layout>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '2rem'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#8B3A3A',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Forums
        </button>

        {/* Forum Details */}
        <h1 style={{ 
          color: '#333', 
          margin: '0 0 1rem 0',
          fontSize: '2rem'
        }}>
          {forum.title}
        </h1>

        <div style={{
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem',
          whiteSpace: 'pre-wrap'
        }}>
          {forum.body}
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          {forum.tags && forum.tags.length > 0 ? (
            forum.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#F5E8E8',
                  color: '#8B3A3A',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                {tag}
              </span>
            ))
          ) : (
            <span style={{ color: '#888', fontStyle: 'italic' }}>No tags</span>
          )}
        </div>

        <div style={{
          borderTop: '1px solid #eee',
          paddingTop: '1.5rem',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Created by:</strong> {forum.createdBy?.name || forum.createdBy || 'Unknown'}
          </div>
          <div>
            <strong>Created on:</strong> {forum.createdAt ? new Date(forum.createdAt).toLocaleString() : 'Unknown'}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Forum ID:</strong> {forum._id}
          </div>
        </div>

        {/* Action buttons for creator only */}
        {isCreator && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleEditClick}
              style={{
                backgroundColor: '#8B3A3A',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <EditIcon style={{ fontSize: '1rem' }} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                backgroundColor: '#8B3A3A',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            {deleteError && <div style={{ color: 'red', marginTop: 8, width: '100%' }}>{deleteError}</div>}
          </div>
        )}

        {/* Comments Section */}
        <Divider sx={{ margin: '3rem 0 2rem 0' }} />
        
        <Box sx={{ marginBottom: '2rem' }}>
          <Typography variant="h5" sx={{ color: '#333', marginBottom: '1rem', fontWeight: 'bold' }}>
            Comments ({comments.length})
          </Typography>
          
          {commentsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <CircularProgress />
            </Box>
          ) : commentsError ? (
            <Typography color="error" sx={{ textAlign: 'center', padding: '2rem' }}>
              {commentsError}
            </Typography>
          ) : comments.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '2rem' }}>
              No comments yet
            </Typography>
          ) : (
            <Box>
              {buildCommentTree(comments).map((comment) => renderComment(comment))}
            </Box>
          )}
        </Box>

        {/* Edit Dialog */}
        <Dialog open={editing} onClose={handleCloseEdit} maxWidth="md" fullWidth>
          <DialogTitle>Edit Forum Post</DialogTitle>
          <DialogContent>
            {editError && (
              <div style={{ color: 'red', marginBottom: '1rem' }}>
                {editError}
              </div>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editData.title}
              onChange={handleInputChange}
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              margin="dense"
              name="body"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={editData.body}
              onChange={handleInputChange}
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <TextField
                margin="dense"
                name="tagInput"
                label="Add Tags (Press Enter to add)"
                type="text"
                fullWidth
                variant="outlined"
                value={editData.tagInput}
                onChange={handleInputChange}
                onKeyDown={handleTagInputKeyDown}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                    sx={{ marginRight: 0.5 }}
                  />
                ))}
              </Box>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseEdit} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEdit} 
              variant="contained" 
              color="primary"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Reply to Comment
            {replyToComment && (
              <Typography variant="body2" sx={{ color: '#666', marginTop: 1, fontStyle: 'italic' }}>
                Replying to: {replyToComment.content?.substring(0, 50)}...
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {replyError && (
              <Typography color="error" sx={{ marginBottom: '1rem' }}>
                {replyError}
              </Typography>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Your Reply"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseReplyDialog} disabled={addingReply}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReply} 
              variant="contained" 
              sx={{ 
                backgroundColor: '#8B3A3A',
                '&:hover': { backgroundColor: '#6b2a2a' }
              }}
              disabled={addingReply}
              startIcon={addingReply ? <CircularProgress size={20} /> : null}
            >
              {addingReply ? 'Adding Reply...' : 'Add Reply'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ForumDetailPage;