import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSearchPins from '../../hooks/useSearchPins';
import { useAppSelector } from '../../hooks/redux';
import { selectUser } from '../../store/slices/authSlice';
import BeautifulDropdown, { BeautifulDropdownItem } from '../common/BeautifulDropdown';

const SearchBar = () => {
    const user = useAppSelector(selectUser);
    const isAuthenticated = !!user;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchScope, setSearchScope] = useState('all');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const navigate = useNavigate();
    const location = useLocation();

    // Detect mobile viewport changes
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        searchPins,
        resetSearch
    } = useSearchPins(searchScope);

    const SCOPE_LABELS = {
        all: 'All Pins',
        saved: 'Saved Pins',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        searchPins(trimmed, 1, 20);

        // Navigate to home page if not already there
        // Remove basename from pathname for comparison
        const pathnameWithoutBasename = location.pathname.replace(/^\/PinterestMini/, '') || '/';
        if (pathnameWithoutBasename !== '/') {
            navigate('/');
        }
    };

    return (
        <>
            <style>{`
                .search-bar-form {
                    flex-grow: 1;
                    margin: 0;
                }

                .search-bar-container {
                    background-color: #f1f1f1;
                    height: 48px;
                    width: 100%;
                }

                .search-scope-dropdown {
                    width: 160px;
                }

                .search-input {
                    font-size: 16px;
                    padding-left: 1rem;
                }

                .search-submit-btn {
                    min-width: 48px;
                    min-height: 48px;
                    width: 48px;
                }

                @media (max-width: 768px) {
                    .search-bar-container {
                        height: 44px;
                    }

                    .search-scope-dropdown {
                        width: 110px !important;
                        font-size: 13px !important;
                    }

                    .search-input {
                        font-size: 15px !important;
                        padding-left: 0.875rem !important;
                    }

                    .search-submit-btn {
                        min-width: 44px !important;
                        min-height: 44px !important;
                        width: 44px !important;
                    }
                }

                @media (max-width: 480px) {
                    .search-bar-container {
                        height: 44px;
                    }

                    .search-scope-dropdown {
                        display: none !important;
                    }

                    .search-input {
                        font-size: 14px !important;
                        padding-left: 0.75rem !important;
                    }

                    .search-submit-btn {
                        min-width: 44px !important;
                        min-height: 44px !important;
                    }
                }

                @media (max-width: 320px) {
                    .search-bar-container {
                        height: 42px;
                    }

                    .search-input {
                        font-size: 13px !important;
                        padding-left: 0.625rem !important;
                    }
                }
            `}</style>

            <form onSubmit={handleSubmit} className="search-bar-form">
                <div className="search-bar-container d-flex rounded-3 overflow-hidden shadow-sm align-items-center">
                    <input
                        type="text"
                        className="search-input form-control border-0 rounded-0"
                        placeholder={isMobile ? "Search..." : "Search for ideas..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search pins"
                        style={{
                            backgroundColor: 'transparent',
                            color: '#333',
                            boxShadow: 'none'
                        }}
                    />

                    {isAuthenticated && (
                        <BeautifulDropdown
                            variant="light"
                            align="start"
                            className="search-scope-dropdown rounded-3"
                            trigger={SCOPE_LABELS[searchScope] || 'All Pins'}
                            onSelect={(val) => {
                                if (!val) return;
                                setSearchScope(val);
                                resetSearch();
                            }}
                            toggleStyle={{
                                width: '160px',
                                textAlign: 'left',
                                height: '35px',
                            }}
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            <BeautifulDropdownItem eventKey="all" active={searchScope === 'all'}>
                                All Pins
                            </BeautifulDropdownItem>
                            <BeautifulDropdownItem eventKey="saved" active={searchScope === 'saved'}>
                                Saved Pins
                            </BeautifulDropdownItem>
                        </BeautifulDropdown>
                    )}

                    <button type="submit" className="search-submit-btn btn d-flex align-items-center justify-content-center border-0"
                        style={{ backgroundColor: 'transparent', padding: 0 }}
                        aria-label="Search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888' }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>
            </form>
        </>
    );
};

export default SearchBar;
