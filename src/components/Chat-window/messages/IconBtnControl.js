// React Component for enabling user to like messages
import React from 'react';
import { Badge, Icon, IconButton, Whisper, Tooltip } from 'rsuite';

const IconBtnControl = ({
    isVisible,
    iconName,
    tooltip,
    onClick,
    badgeContent,
    ...props
}) => {
    const ConditionalBadge = ({ condition, children }) => {
        return condition ? (
            <Badge content={condition}>{children}</Badge>
        ) : (
            children
        );
    };
    // console.log(`${badgeContent}`);
    return (
        <div
            className="ml-2"
            style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
            <ConditionalBadge condition={badgeContent}>
                <Whisper
                    placement="top"
                    delay={0}
                    delayHide={0}
                    delayShow={0}
                    trigger="hover"
                    speaker={<Tooltip>{tooltip}</Tooltip>}
                >
                    <IconButton
                        {...props}
                        onClick={onClick}
                        circle
                        size="lg"
                        icon={<Icon icon={iconName} />}
                    />
                </Whisper>
            </ConditionalBadge>
        </div>
    );
};

export default IconBtnControl;
