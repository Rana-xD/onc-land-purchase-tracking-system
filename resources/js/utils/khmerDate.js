// Khmer month names mapping
export const KHMER_MONTHS = {
    1: 'មករា',
    2: 'កុម្ភៈ', 
    3: 'មីនា',
    4: 'មេសា',
    5: 'ឧសភា',
    6: 'មិថុនា',
    7: 'កក្កដា',
    8: 'សីហា',
    9: 'កញ្ញា',
    10: 'តុលា',
    11: 'វិច្ឆិកា',
    12: 'ធ្នូ'
};

// Convert date to Khmer format: DD-KhmerMonth-YYYY
export const formatKhmerDate = (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    
    return `${day}-${KHMER_MONTHS[month]}-${year}`;
};

// Parse Khmer date format back to standard date
export const parseKhmerDate = (khmerDateString) => {
    if (!khmerDateString) return null;
    
    const parts = khmerDateString.split('-');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const year = parseInt(parts[2]);
    
    // Find month number from Khmer month name
    const monthNumber = Object.keys(KHMER_MONTHS).find(
        key => KHMER_MONTHS[key] === parts[1]
    );
    
    if (!monthNumber) return null;
    
    return new Date(year, parseInt(monthNumber) - 1, day);
};

// Custom DatePicker component with Khmer format
export const formatDatePickerValue = (date) => {
    if (!date) return '';
    return formatKhmerDate(date);
};
