const animations = {
    zoom: {
        top: {
            entrance: 'zoomInDown',
            exit: 'zoomOutUp',
        },
        center: {
            entrance: 'zoomIn',
            exit: 'zoomOut',
        },
        bottom: {
            entrance: 'zoomInUp',
            exit: 'zoomOutDown',
        },
        left: {
            entrance: 'zoomInLeft',
            exit: 'zoomOutLeft',
        },
        right: {
            entrance: 'zoomInRight',
            exit: 'zoomOutRight',
        },
    },
};

/**
 *
 * @param {String} animation
 * @param {String} position
 */
export function getAnimationForPosition(animation, position) {
    position = /^(top|bottom|center)$/.test(position)
        ? position
        : position.replace(/^(top|bottom)-?/i, '').toLowerCase();

    if (!animations[animation]) {
        return animation;
    }

    return animations[animation][position];
}
