import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import AuthButtons from '../auth/AuthButtons';
import ProfileDropdown from '../profile/ProfileDropdown';
import SearchBar from '../bars/SearchBar';


const Header = () => {
  const { user } = useAppContext();

  return (
      <>
          <motion.header
              className="d-flex align-items-center justify-content-between px-4 py-3 sticky-top bg-white z-3"
              style={{ marginLeft: '80px', height: '64px' }}
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
          >
         
              <SearchBar />
              {user ? <ProfileDropdown /> : <AuthButtons />}


        </motion.header>
      </>
  );
};

export default Header;
