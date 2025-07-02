import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center justify-center" {...props}>
            <div className="relative flex flex-col items-center justify-center overflow-hidden">
                {/* Main logo container with subtle shadow and elegant design */}
                <div className="flex items-center justify-center">
                    {/* Temple silhouette icon - representing Cambodia's cultural heritage */}
                    <div className="mr-3 text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                    </div>
                    
                    {/* Text part of the logo with elegant typography */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-wider text-gray-800">CAMBODIA</span>
                        <div className="flex items-center">
                            <span className="text-sm font-medium tracking-widest text-blue-700">LAND TRACKER</span>
                            <div className="ml-1 h-1 w-1 rounded-full bg-red-500"></div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative element - horizontal line with gradient */}
                <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-red-500"></div>
            </div>
        </div>
    );
}
