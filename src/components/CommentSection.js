import React, { useState } from 'react';

const Comment = ({ id, user, content, inputType, replies, onEdit, onReply, onDelete, level }) => {
  const [edit, setedit] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [replyContent, setReplyContent] = useState('');
  const [replyInputType, setReplyInputType] = useState('text');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleEdit = () => {
    onEdit(id, editedContent);
    setedit(false);
  };

  const handleReply = () => {
    onReply(id, replyContent, replyInputType);
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <div className={`comment level-${level}`}>
      <strong>{user}</strong>:
      {edit ? (
        <>
          {inputType === 'text' ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          )}
          <button onClick={handleEdit}>Save</button>
        </>
      ) : (
        <>
          {content}
          <div className="commentdiv">
            <button onClick={() => setedit(true)}>Edit</button>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
            <button onClick={() => onDelete(id)}>Delete</button>
          </div>
          {showReplyForm && (
            <div className="reply-section">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <select
                name="inputType"
                value={replyInputType}
                onChange={(e) => setReplyInputType(e.target.value)}
              >
                
              </select>
              <button onClick={handleReply}>Post</button>
            </div>
          )}
          {replies && replies.length > 0 && (
            <div className="nested-replies">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  id={reply.id}
                  user={reply.user}
                  content={reply.content}
                  inputType={reply.inputType}
                  replies={reply.replies}
                  onEdit={onEdit}
                  onReply={onReply}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CommentSection = () => {
  const [comments, setComments] = useState([]);

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const editComment = (commentId, editedContent) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, content: editedContent } : comment
      )
    );
  };

  const replyToComment = (parentCommentId, replyContent, inputType) => {
    const newReply = {
      id: comments.length + 1,
      user: 'User', 
      content: replyContent,
      inputType: inputType || 'text', 
      replies: [],
    };

    const updatedComments = addReplyToComment(comments, parentCommentId, newReply);

    setComments(updatedComments);
  };

  const addReplyToComment = (comments, parentCommentId, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentCommentId, newReply),
        };
      }
      return comment;
    });
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          user={comment.user}
          content={comment.content}
          inputType={comment.inputType || 'text'} 
          replies={comment.replies}
          onEdit={editComment}
          onReply={replyToComment}
          onDelete={deleteComment}
          level={1}
        />
      ))}
      {/* Form for adding new comments */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newComment = {
            id: comments.length + 1,
            user: 'User',
            content: e.target.comment.value,
            inputType: e.target.inputType.value || 'text', 
            replies: [], 
          };
          addComment(newComment);
          e.target.comment.value = '';
        }}
      >
        <input type="text" name="comment" placeholder="Add a comment..." />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentSection;
