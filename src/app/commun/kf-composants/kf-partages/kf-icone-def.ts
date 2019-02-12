import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type KfIconeDef = IconDefinition | (() => IconDefinition);

export function ValeurIconeDef(iconeDef: KfIconeDef): IconDefinition {
    const icon = iconeDef as IconDefinition;
    if (icon.icon) {
        return icon;
    } else {
        const iconFnc = iconeDef as (() => IconDefinition);
        return iconFnc();
    }
}
