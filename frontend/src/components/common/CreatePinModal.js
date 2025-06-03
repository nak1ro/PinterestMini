import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePinModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would upload the image and save the pin
    console.log('Creating pin:', { title, description, imageUrl, selectedFile });
    onClose();
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="create-pin-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create Pin</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-pin-form">
          <div className="form-group">
            <label htmlFor="pin-image">Pin Image</label>
            <div className="image-upload-area">
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span>Drag and drop or click to upload</span>
                  <input 
                    type="file" 
                    id="pin-image" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pin-title">Title</label>
            <input
              type="text"
              id="pin-title"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin-description">Description</label>
            <textarea
              id="pin-description"
              placeholder="Tell everyone what your Pin is about"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin-url">Destination link (optional)</label>
            <input
              type="url"
              id="pin-url"
              placeholder="Add a destination link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">Create</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePinModal;
