<?php

namespace App\Helpers;

class KhmerNumberHelper
{
    private static $ones = [
        0 => '',
        1 => 'មួយ',
        2 => 'ពីរ',
        3 => 'បី',
        4 => 'បួន',
        5 => 'ប្រាំ',
        6 => 'ប្រាំមួយ',
        7 => 'ប្រាំពីរ',
        8 => 'ប្រាំបី',
        9 => 'ប្រាំបួន'
    ];

    private static $tens = [
        10 => 'ដប់',
        20 => 'ម្ភៃ',
        30 => 'សាមសិប',
        40 => 'សែសិប',
        50 => 'ហាសិប',
        60 => 'ហុកសិប',
        70 => 'ចិតសិប',
        80 => 'ប៉ែតសិប',
        90 => 'កៅសិប'
    ];

    private static $scales = [
        1000000000 => 'ពាន់លាន',
        1000000 => 'លាន',
        10000 => 'សែន',
        1000 => 'ពាន់',
        100 => 'រយ'
    ];

    /**
     * Convert a number to Khmer text
     * 
     * @param float|int $number
     * @return string
     */
    public static function convertToKhmer($number)
    {
        if ($number == 0) {
            return 'សូន្យ';
        }

        $number = (float) $number;
        $isDecimal = $number != (int) $number;
        
        if ($isDecimal) {
            $parts = explode('.', number_format($number, 2, '.', ''));
            $wholePart = (int) $parts[0];
            $decimalPart = (int) $parts[1];
            
            $result = self::convertWholeNumber($wholePart);
            
            if ($decimalPart > 0) {
                $result .= ' ចុច ' . self::convertWholeNumber($decimalPart);
            }
            
            return $result;
        }
        
        return self::convertWholeNumber((int) $number);
    }

    /**
     * Convert whole number to Khmer text
     * 
     * @param int $number
     * @return string
     */
    private static function convertWholeNumber($number)
    {
        if ($number == 0) {
            return '';
        }

        $result = '';

        // Handle large numbers
        foreach (self::$scales as $scale => $scaleText) {
            if ($number >= $scale) {
                $quotient = intval($number / $scale);
                $result .= self::convertHundreds($quotient) . $scaleText;
                $number %= $scale;
            }
        }

        // Handle remaining hundreds, tens, and ones
        if ($number > 0) {
            $result .= self::convertHundreds($number);
        }

        return trim($result);
    }

    /**
     * Convert numbers less than 100000 to Khmer text
     * 
     * @param int $number
     * @return string
     */
    private static function convertHundreds($number)
    {
        $result = '';

        // Handle សែន (10,000s) - but don't process here, let main function handle it
        if ($number >= 100000) {
            return $result; // Let main function handle larger numbers
        }

        // Handle ពាន់ (1,000s)
        if ($number >= 1000) {
            $thousands = intval($number / 1000);
            $result .= self::$ones[$thousands] . 'ពាន់';
            $number %= 1000;
        }

        // Handle រយ (100s)
        if ($number >= 100) {
            $hundreds = intval($number / 100);
            $result .= self::$ones[$hundreds] . 'រយ';
            $number %= 100;
        }

        // Handle tens
        if ($number >= 20) {
            $tens = intval($number / 10) * 10;
            $result .= self::$tens[$tens];
            $number %= 10;
        } elseif ($number >= 10) {
            if ($number == 10) {
                $result .= 'ដប់';
            } else {
                $result .= 'ដប់' . self::$ones[$number % 10];
            }
            $number = 0;
        }

        // Handle ones
        if ($number > 0) {
            $result .= self::$ones[$number];
        }

        return $result;
    }

    /**
     * Convert currency amount to Khmer text with "ដុល្លារ" suffix
     * 
     * @param float|int $amount
     * @return string
     */
    public static function convertCurrencyToKhmer($amount)
    {
        $khmerText = self::convertToKhmer($amount);
        $result = $khmerText . 'ដុល្លារ';
        
        // Ensure UTF-8 encoding
        if (!mb_check_encoding($result, 'UTF-8')) {
            $result = mb_convert_encoding($result, 'UTF-8', 'auto');
        }
        
        return $result;
    }

    /**
     * Convert size with "ម៉ែត្រការ៉េ" suffix
     * 
     * @param float|int $size
     * @return string
     */
    public static function convertSizeToKhmer($size)
    {
        $khmerText = self::convertToKhmer($size);
        return $khmerText . 'ម៉ែត្រការ៉េ';
    }

    /**
     * Convert English numbers to Khmer numerals
     * 
     * @param string|int|float $number
     * @return string
     */
    public static function convertToKhmerNumerals($number)
    {
        $khmerNumerals = [
            '0' => '០', '1' => '១', '2' => '២', '3' => '៣', '4' => '៤',
            '5' => '៥', '6' => '៦', '7' => '៧', '8' => '៨', '9' => '៩'
        ];
        
        return strtr((string)$number, $khmerNumerals);
    }

    /**
     * Format number for display - remove .00 if whole number, keep decimals if not
     * 
     * @param float|int $number
     * @return string
     */
    public static function formatNumberForDisplay($number)
    {
        $number = floatval($number);
        
        // If it's a whole number (no decimal part), display without decimals
        if ($number == intval($number)) {
            return self::convertToKhmerNumerals(intval($number));
        }
        
        // If it has decimal places, format with 2 decimal places and convert to Khmer
        return self::convertToKhmerNumerals(number_format($number, 2));
    }

    /**
     * Convert date to Khmer format
     * 
     * @param \DateTime|string $date
     * @return string
     */
    public static function convertDateToKhmer($date)
    {
        if (is_string($date)) {
            $date = new \DateTime($date);
        }
        
        $khmerMonths = [
            1 => 'មករា', 2 => 'កុម្ភៈ', 3 => 'មីនា', 4 => 'មេសា',
            5 => 'ឧសភា', 6 => 'មិថុនា', 7 => 'កក្កដា', 8 => 'សីហា',
            9 => 'កញ្ញា', 10 => 'តុលា', 11 => 'វិច្ឆិកា', 12 => 'ធ្នូ'
        ];
        
        $day = self::convertToKhmerNumerals($date->format('j'));
        $month = $khmerMonths[(int)$date->format('n')];
        $year = self::convertToKhmerNumerals($date->format('Y'));
        
        $result = "ថ្ងៃទី {$day} ខែ {$month} ឆ្នាំ {$year}";
        
        // Ensure UTF-8 encoding
        if (!mb_check_encoding($result, 'UTF-8')) {
            $result = mb_convert_encoding($result, 'UTF-8', 'auto');
        }
        
        return $result;
    }

    /**
     * Add period to date and return Khmer formatted date
     * 
     * @param \DateTime|string $baseDate
     * @param string $period (format: "1 ខែ", "2 សប្តាហ៍", "5 ថ្ងៃ")
     * @return string
     */
    public static function addPeriodToDate($baseDate, $period)
    {
        if (is_string($baseDate)) {
            $baseDate = new \DateTime($baseDate);
        } else {
            $baseDate = clone $baseDate;
        }
        
        // Parse the period string
        if (strpos($period, 'ខែ') !== false) {
            $months = (int)trim(str_replace('ខែ', '', $period));
            $baseDate->add(new \DateInterval("P{$months}M"));
        } elseif (strpos($period, 'សប្តាហ៍') !== false) {
            $weeks = (int)trim(str_replace('សប្តាហ៍', '', $period));
            $days = $weeks * 7;
            $baseDate->add(new \DateInterval("P{$days}D"));
        } elseif (strpos($period, 'ថ្ងៃ') !== false) {
            $days = (int)trim(str_replace('ថ្ងៃ', '', $period));
            $baseDate->add(new \DateInterval("P{$days}D"));
        }
        
        return self::convertDateToKhmer($baseDate);
    }
}
