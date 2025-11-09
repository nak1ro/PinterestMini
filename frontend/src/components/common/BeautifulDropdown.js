import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Portal from 'react-overlays/Portal';

/**
 * Portal wrapper for dropdown menu to ensure it renders above other elements
 */
const PortalMenu = React.forwardRef(({ children, style, ...props }, ref) => (
    <Portal>
        <div ref={ref} {...props} style={{ zIndex: 2000, ...style }}>
            {children}
        </div>
    </Portal>
));
PortalMenu.displayName = 'PortalMenu';

/**
 * Beautiful dropdown component with consistent Pinterest-style design
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Dropdown items (should use BeautifulDropdownItem)
 * @param {React.ReactNode} props.trigger - Button content/text
 * @param {string} props.variant - Button variant ('standard' | 'light' | 'transparent')
 * @param {string} props.align - Menu alignment ('start' | 'end')
 * @param {Function} props.onSelect - Callback when item is selected (receives eventKey)
 * @param {Object} props.toggleStyle - Custom styles for toggle button
 * @param {boolean} props.usePortal - Whether to use portal for menu (default: true)
 * @param {string} props.className - Additional classes for toggle
 * @param {Object} props.style - Additional styles for container
 */
const BeautifulDropdown = ({
    children,
    trigger,
    variant = 'standard',
    align = 'end',
    onSelect,
    toggleStyle = {},
    usePortal = true,
    className = '',
    style = {},
    drop,
}) => {
    // Base toggle styles
    const baseToggleStyle = {
        transition: 'all 0.2s ease',
        fontSize: '14px',
        fontWeight: 500,
    };

    // Variant-specific toggle styles
    const variantStyles = {
        standard: {
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: '#111',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '8px 16px',
        },
        light: {
            border: 'none',
            backgroundColor: 'transparent',
            color: '#555',
            boxShadow: 'none',
            borderRadius: '0',
            padding: '0 12px',
        },
        transparent: {
            border: 'none',
            backgroundColor: 'transparent',
            color: '#111',
            boxShadow: 'none',
            borderRadius: '12px',
            padding: '8px 16px',
        },
    };

    const toggleStyles = {
        ...baseToggleStyle,
        ...variantStyles[variant],
        ...toggleStyle,
    };

    // Menu styles
    const menuStyle = {
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        padding: '8px',
        marginTop: '8px',
        backgroundColor: '#fff',
        overflow: 'hidden',
        minWidth: '180px',
    };

    // Hover handlers for toggle
    const handleMouseEnter = (e) => {
        if (variant === 'standard') {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = '#ccc';
        } else if (variant === 'light') {
            e.currentTarget.style.color = '#111';
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
        } else if (variant === 'transparent') {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
        }
    };

    const handleMouseLeave = (e) => {
        if (variant === 'standard') {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = '#ddd';
        } else if (variant === 'light') {
            e.currentTarget.style.color = '#555';
            e.currentTarget.style.backgroundColor = 'transparent';
        } else if (variant === 'transparent') {
            e.currentTarget.style.backgroundColor = 'transparent';
        }
    };

    const toggleVariant = variant === 'standard' ? 'outline-dark' : variant === 'light' ? 'light' : 'outline-dark';

    return (
        <Dropdown
            onSelect={onSelect}
            align={align}
            style={style}
            drop={drop}
        >
            <Dropdown.Toggle
                variant={toggleVariant}
                className={`${variant === 'light' ? 'border-0 rounded-0' : 'rounded-3'} fw-medium ${className}`}
                style={toggleStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
    );
};

/**
 * Beautiful dropdown item component with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Item content
 * @param {string} props.eventKey - Value for onSelect callback
 * @param {boolean} props.active - Whether this item is active/selected
 * @param {Function} props.onClick - Optional click handler
 * @param {string} props.className - Additional classes
 * @param {Object} props.style - Additional styles
 */
export const BeautifulDropdownItem = ({
    children,
    eventKey,
    active = false,
    onClick,
    className = '',
    style = {},
    ...props
}) => {
    const itemStyle = {
        padding: '10px 16px',
        borderRadius: '10px',
        margin: '2px 0',
        fontSize: '14px',
        color: active ? '#fff' : '#333',
        backgroundColor: active ? 'transparent' : 'transparent',
        background: active ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)' : 'transparent',
        fontWeight: active ? 500 : 400,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        ...style,
    };

    const handleMouseEnter = (e) => {
        if (!active) {
            e.currentTarget.style.backgroundColor = '#f1f1f1';
            e.currentTarget.style.transform = 'translateX(2px)';
        }
    };

    const handleMouseLeave = (e) => {
        if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
        }
    };

    return (
        <Dropdown.Item
            eventKey={eventKey}
            active={active}
            onClick={onClick}
            className={className}
            style={itemStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </Dropdown.Item>
    );
};

export default BeautifulDropdown;

