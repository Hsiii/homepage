import React from 'react';
import PropTypes from 'prop-types';

export default function LinkTreeItem({
    as: Component = 'div',
    className = '',
    children,
    icon = null,
    hotkey,
    isHotkeyHidden = false,
    modifiers = [],
    ...props
}) {
    const modifierClasses = modifiers.filter(Boolean).join(' ');
    const finalClassName = `${className} ${modifierClasses}`.trim();

    return (
        <Component className={finalClassName} {...props}>
            {icon && icon}
            <p className={`hint ${isHotkeyHidden ? 'hidden' : ''}`}>
                [{hotkey}]
            </p>
            <span>{children}</span>
        </Component>
    );
}

LinkTreeItem.propTypes = {
    as: PropTypes.elementType,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    icon: PropTypes.element,
    hotkey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    isHotkeyHidden: PropTypes.bool,
    modifiers: PropTypes.arrayOf(PropTypes.string),
};
