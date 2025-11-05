import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Portal from 'react-overlays/Portal';

/**
 * Portal wrapper for dropdown menu to ensure it renders above other elements
 */
const PortalMenu = React.forwardRef(({ children, style, ...props }, ref) => (
    <Portal>
        <div
            ref={ref}
            {...props}
            style={{ zIndex: 2000, ...style }}
        >
            {children}
        </div>
    </Portal>
));
PortalMenu.displayName = 'PortalMenu';

/**
 * Unified dropdown menu component with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Dropdown items
 * @param {string} props.trigger - Button text or content
 * @param {string} props.variant - Button variant ('primary', 'outline', 'light')
 * @param {string} props.align - Menu alignment ('start', 'end')
 * @param {Function} props.onSelect - Callback when item is selected
 * @param {Object} props.toggleStyle - Custom styles for toggle button
 * @param {boolean} props.usePortal - Whether to use portal for menu (default: true)
 */
const DropdownMenu = ({
    children,
    trigger,
    variant = 'outline',
    align = 'end',
    onSelect,
    toggleStyle = {},
    usePortal = true,
    className = '',
}) => {
    const defaultToggleStyle = {
        borderRadius: '12px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        border: variant === 'outline' ? '1px solid #ddd' : 'none',
        backgroundColor: variant === 'light' ? 'transparent' : variant === 'primary' ? '#e60023' : 'white',
        color: variant === 'primary' ? 'white' : '#333',
        transition: 'all 0.2s ease',
        boxShadow: variant === 'outline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    };

    const menuStyle = {
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        padding: '8px',
        marginTop: '8px',
        backgroundColor: 'white',
        overflow: 'hidden',
    };

    return (
        <>
            <style>{`
                .custom-dropdown-toggle:hover {
                    transform: translateY(-1px);
                    box-shadow: ${variant === 'outline' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 4px 12px rgba(230, 0, 35, 0.25)'} !important;
                }
                
                .custom-dropdown-toggle:focus {
                    box-shadow: ${variant === 'outline' ? '0 0 0 3px rgba(0,0,0,0.1)' : '0 0 0 3px rgba(230, 0, 35, 0.2)'} !important;
                }
                
                .custom-dropdown-item {
                    padding: 10px 16px;
                    border-radius: 10px;
                    margin: 2px 0;
                    font-size: 14px;
                    color: #333;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .custom-dropdown-item:hover {
                    background-color: #f1f1f1;
                    color: #111;
                    transform: translateX(2px);
                }
                
                .custom-dropdown-item.active {
                    background: linear-gradient(135deg, #e60023 0%, #bd081c 100%);
                    color: white;
                    font-weight: 500;
                }
                
                .custom-dropdown-divider {
                    margin: 8px 0;
                    border-top: 1px solid #e0e0e0;
                }
            `}</style>
            <Dropdown
                onSelect={onSelect}
                align={align}
            >
                <Dropdown.Toggle
                    className={`custom-dropdown-toggle ${className}`}
                    variant={variant === 'primary' ? 'danger' : variant === 'light' ? 'light' : 'outline-dark'}
                    style={{ ...defaultToggleStyle, ...toggleStyle }}
                >
                    {trigger}
                </Dropdown.Toggle>

                <Dropdown.Menu
                    as={usePortal ? PortalMenu : undefined}
                    style={menuStyle}
                    popperConfig={
                        usePortal
                            ? {
                                  strategy: 'fixed',
                                  modifiers: [
                                      { name: 'offset', options: { offset: [0, 8] } },
                                      { name: 'preventOverflow', options: { boundary: 'viewport' } },
                                  ],
                              }
                            : undefined
                    }
                >
                    {children}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

/**
 * Dropdown item component with consistent styling
 * Supports 'as' prop for custom element types (Link, anchor, etc.)
 */
export const DropdownItem = ({ children, eventKey, active, onClick, className = '', as, style, ...props }) => {
    if (as) {
        // For custom elements (Link, anchor, etc.), render as that element
        const Component = as;
        return (
            <Component
                className={`custom-dropdown-item ${active ? 'active' : ''} ${className}`}
                onClick={onClick}
                style={style}
                {...props}
            >
                {children}
            </Component>
        );
    }
    
    // Default: use Dropdown.Item
    return (
        <Dropdown.Item
            eventKey={eventKey}
            active={active}
            onClick={onClick}
            className={`custom-dropdown-item ${className}`}
            style={style}
            {...props}
        >
            {children}
        </Dropdown.Item>
    );
};

/**
 * Dropdown divider component
 */
export const DropdownDivider = () => {
    return <hr className="custom-dropdown-divider" />;
};

export default DropdownMenu;

