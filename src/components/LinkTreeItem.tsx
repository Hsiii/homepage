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

export default function LinkTreeItem({
    as: Component = 'div',
    className = '',
    children,
    icon = null,
    hotkey,
    isHotkeyHidden = false,
    modifiers = [],
    ...props
}: LinkTreeItemProps) {
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
