import React from 'react';
import { motion } from 'framer-motion';
import { usePopularTags, usePinsByTag } from '../../hooks/useTags';
import PinGrid from '../pin/PinGrid';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const { tags, loading, error } = usePopularTags(5);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error loading tags</div>;

  return (
      <motion.div
          className="container py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <h1 className="text-center fw-bold mb-5" style={{ fontSize: '2rem' }}>Explore</h1>

        <div className="mt-4">
          {tags.map(tag => (
              <TagSection key={tag} tag={tag} />
          ))}
        </div>
      </motion.div>
  );
};

const TagSection = ({ tag }) => {
  const { pins, loading, error } = usePinsByTag(tag);
  const navigate = useNavigate();

  if (loading || error || pins.length === 0) return null;

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate(`/tag/${encodeURIComponent(tag)}`);
  };

  return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 px-3">
          <h2 className="fw-semibold mb-0" style={{ fontSize: '1.5rem' }}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </h2>
          <motion.button
            onClick={handleViewAll}
            className="btn btn-sm fw-bold px-4 rounded-3"
            style={{
              background: '#efefef',
              border: 'none',
              color: '#111',
              height: '36px',
              minWidth: '100px',
            }}
            whileHover={{ scale: 1.05, background: '#e2e2e2' }}
            whileTap={{ scale: 0.97 }}
          >
            View all
          </motion.button>
        </div>
        <PinGrid pins={pins.slice(0, 4)} />
      </div>
  );
};

export default Explore;
