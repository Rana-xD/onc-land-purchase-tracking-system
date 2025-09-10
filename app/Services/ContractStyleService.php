<?php

namespace App\Services;

class ContractStyleService
{
    /**
     * Get the unified CSS styles for all contract types.
     * This ensures consistency between TinyMCE editor and template preview.
     *
     * @return string
     */
    public static function getContractCSS()
    {
        return file_get_contents(resource_path('css/contract-styles.css'));
    }

    /**
     * Get CSS styles formatted for TinyMCE content_style.
     * Removes @import statements since TinyMCE handles font loading differently.
     *
     * @return string
     */
    public static function getTinyMCEStyles()
    {
        $css = self::getContractCSS();
        
        // Remove @import statements for TinyMCE
        $css = preg_replace('/@import[^;]+;/', '', $css);
        
        // Add Google Fonts import for TinyMCE
        $tinymceCSS = "@import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');\n\n";
        $tinymceCSS .= $css;
        
        return $tinymceCSS;
    }

    /**
     * Get CSS styles for template HTML files.
     * Uses unified contract styles for both deposit and sale contracts.
     *
     * @return string
     */
    public static function getTemplateStyles()
    {
        $cssPath = resource_path('css/contract-styles.css');
        
        if (!file_exists($cssPath)) {
            throw new \Exception('CSS file not found: ' . $cssPath);
        }
        
        return file_get_contents($cssPath);
    }
}
