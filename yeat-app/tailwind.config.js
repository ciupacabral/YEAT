/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primaryOrange: '#FF7043',
                secondaryGreen: '#8BC34A',
                lightGreen: '#C8E6C9',
                warmNeutral: '#FFF8E1',
                accentBrown: '#6D4C41',
                lightGray: '#FAFAFA',
                accentRed: '#FF5252',
                movuliu: '#550c55',
                movuliu_background: '#6a2d6a',
                primaryCoral: '#FF7043',
                secondaryMagenta: '#550c55',
                lightPeach: '#FFB39D',
                softLavender: '#D8A7D9',
                mutedTerracotta: '#D2695C',
                darkPlum: '#3E0B3D',
                lightCream: '#FFF8E1',
                lighterOrange: '#FFB298'

            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}