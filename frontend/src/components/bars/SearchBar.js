import React, {useState} from 'react';
import useSearchPins from '../../hooks/useSearchPins';
import { useAppContext } from '../../context/AppContext';
import BeautifulDropdown, {BeautifulDropdownItem} from '../common/BeautifulDropdown';

const SearchBar = () => {
    const { user } = useAppContext();
    const isAuthenticated = !!user;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchScope, setSearchScope] = useState('all');

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
    };

    return (
        <form onSubmit={handleSubmit} className="flex-grow-1 mx-3">
            <div className="d-flex rounded-3 overflow-hidden shadow-sm align-items-center"
                 style={{backgroundColor: '#f1f1f1', height: '48px', width: '100%'}}>
                <input
                    type="text"
                    className="form-control border-0 rounded-0"
                    placeholder="Search for ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search pins"
                    style={{
                        backgroundColor: 'transparent',
                        color: '#333',
                        fontSize: '16px',
                        boxShadow: 'none',
                        paddingLeft: '1rem'
                    }}
                />

                {isAuthenticated && (
                    <BeautifulDropdown
                        variant="light"
                        align="start"
                        className="rounded-3"
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
                        style={{position: 'relative', zIndex: 1}}
                    >
                        <BeautifulDropdownItem eventKey="all" active={searchScope === 'all'}>
                            All Pins
                        </BeautifulDropdownItem>
                        <BeautifulDropdownItem eventKey="saved" active={searchScope === 'saved'}>
                            Saved Pins
                        </BeautifulDropdownItem>
                    </BeautifulDropdown>
                )}

                <button type="submit" className="btn d-flex align-items-center justify-content-center border-0"
                        style={{width: '48px', backgroundColor: 'transparent', padding: 0}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round" style={{color: '#888'}}>
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
