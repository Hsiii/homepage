import type { ElementType, ReactElement, ReactNode } from 'react';
import React from 'react';

interface LinkTreeItemProps extends React.HTMLAttributes<HTMLElement> {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    icon?: ReactElement;
    hotkey: string | number;
    isHotkeyHidden?: boolean;
    modifiers?: Array<string | boolean | undefined | null>;
    href?: string;
}

export const LinkTreeItem: React.FC<LinkTreeItemProps> = ({
    as: Component = 'div',
    className = '',
    children,
    icon,
    hotkey,
    isHotkeyHidden = false,
    modifiers = [],
    ...props
}) => {
    const modifierClasses = modifiers.filter(Boolean).join(' ');
    const finalClassName = `${className} ${modifierClasses}`.trim();

    return (
        <Component className={finalClassName} {...props}>
            {icon}
            <code className={`hint ${isHotkeyHidden ? 'hidden' : ''}`}>
                [{hotkey}]
            </code>
            <span>{children}</span>
        </Component>
    );
};
