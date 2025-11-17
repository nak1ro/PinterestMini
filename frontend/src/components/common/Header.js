import React from 'react';
import {motion} from 'framer-motion';
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
              }

              @media (max-width: 768px) {
                  .app-header {
                      margin-left: 0 !important;
                      height: 56px;
                      padding: 0.5rem 1rem !important;
                  }
              }
          `}</style>

            <motion.header
                className="app-header d-flex align-items-center justify-content-between py-3 sticky-top bg-white z-3"
                initial={{y: -50}}
                animate={{y: 0}}
                transition={{duration: 0.3}}
            >

                <SearchBar/>
                {user ? <ProfileDropdown/> : <AuthButtons/>}

            </motion.header>
        </>
    );
};

export default Header;
