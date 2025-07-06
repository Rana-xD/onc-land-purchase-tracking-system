import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: '#1890ff',
                success: '#52c41a',
                warning: '#faad14',
                error: '#f5222d',
                text: 'rgba(0, 0, 0, 0.85)',
                'text-secondary': 'rgba(0, 0, 0, 0.45)',
                border: '#d9d9d9',
                background: '#f0f2f5',
            },
            fontFamily: {
                sans: ['Koh Santepheap', ...defaultTheme.fontFamily.sans],
                khmer: ['Koh Santepheap', 'sans-serif'],
            },
            fontSize: {
                'xs': '12px',
                'sm': '12px',
                'base': '14px',
                'lg': '16px',
                'xl': '20px',
            },
            spacing: {
                'xs': '8px',
                'sm': '12px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
            },
            height: {
                'header': '64px',
            },
            width: {
                'sidebar': '256px',
            },
            maxWidth: {
                'content': '1200px',
            },
            borderRadius: {
                DEFAULT: '4px',
            },
            padding: {
                'card': '16px',
                'modal': '24px',
            },
        },
        screens: {
            'xs': {'max': '575px'},
            'sm': {'min': '576px', 'max': '767px'},
            'md': {'min': '768px', 'max': '991px'},
            'lg': {'min': '992px', 'max': '1199px'},
            'xl': {'min': '1200px', 'max': '1599px'},
            '2xl': {'min': '1600px'},
        },
    },

    plugins: [forms],
};
