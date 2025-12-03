import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/redux';
import { selectUser } from '../../store/slices/authSlice';
import AuthButtons from '../auth/AuthButtons';
import ProfileDropdown from '../profile/ProfileDropdown';
import SearchBar from '../bars/SearchBar';


const Header = () => {
    const user = useAppSelector(selectUser);

    return (
        <>
            <style>{`
              .app-header {
                  height: 64px;
                  padding-left: 28px !important;
                  padding-right: 15px !important;
                  gap: 1rem;
              }

              @media (max-width: 768px) {
                  .app-header {
                      margin-left: 0 !important;
                      height: 60px;
                      padding: 0.5rem 0.875rem !important;
                      gap: 0.75rem;
                  }
              }

              @media (max-width: 480px) {
                  .app-header {
                      height: 52px;
                      padding: 0.5rem 0.625rem !important;
                      gap: 0.5rem;
                  }
              }

              @media (max-width: 320px) {
                  .app-header {
                      height: 50px;
                      padding: 0.375rem 0.5rem !important;
                      gap: 0.375rem;
                  }
              }
          `}</style>

            <motion.header
                className="app-header d-flex align-items-center sticky-top bg-white z-3"
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
