import React, { ElementType, ReactElement, ReactNode } from 'react';

interface LinkTreeItemProps extends React.HTMLAttributes<HTMLElement> {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    icon?: ReactElement | null;
    hotkey: string | number;
    isHotkeyHidden?: boolean;
    modifiers?: (string | boolean | undefined | null)[];
    href?: string;
}

export const LinkTreeItem: React.FC<LinkTreeItemProps> = ({
    as: Component = 'div',
    className = '',
    children,
    icon = null,
    hotkey,
    isHotkeyHidden = false,
    modifiers = [],
    ...props
}) => {
    const modifierClasses = modifiers.filter(Boolean).join(' ');
    const finalClassName = `${className} ${modifierClasses}`.trim();

    return (
        <Component className={finalClassName} {...props}>
            {icon && icon}
            <code className={`hint ${isHotkeyHidden ? 'hidden' : ''}`}>
                [{hotkey}]
            </code>
            <span>{children}</span>
        </Component>
    );
};
