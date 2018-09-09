export interface ReglesDeMotDePasse {
    noSpaces: boolean;
    requiredLength: number;
    requireDigit: boolean;
    requireLowercase: boolean;
    requireUppercase: boolean;
    requireNonAlphanumeric: boolean;
}
