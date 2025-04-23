/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { NewspaperIcon } from "@heroicons/react/24/outline";

interface MediaLogoProps {
    logoPath: string | null | undefined;
    mediaName?: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    fallbackIcon?: React.ReactNode;
}

/**
 * A reusable component to display media logos with fallback handling
 */
export default function MediaLogo({
    logoPath,
    mediaName = "Media",
    size = "sm",
    className = "",
    fallbackIcon = null,
}: MediaLogoProps) {
    const [imageError, setImageError] = useState(false);

    // Default sizes
    const sizeClasses = {
        xs: "w-3 h-3",
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    // Generate size class
    const sizeClass = sizeClasses[size] || sizeClasses.sm;

    // Skip rendering image if logo path is invalid
    const isValidLogoPath = logoPath && logoPath !== "nan";

    // Default fallback icon if none provided
    const DefaultFallbackIcon = () => (
        <NewspaperIcon className={`${sizeClass} text-gray-400`} />
    );

    // If image failed to load or no valid path, show fallback
    if (imageError || !isValidLogoPath) {
        return (
            <div className={`${sizeClass} flex-shrink-0 ${className}`}>
                {fallbackIcon || <DefaultFallbackIcon />}
            </div>
        );
    }

    // Otherwise show the image
    return (
        <div
            className={`${sizeClass} relative flex-shrink-0 rounded overflow-hidden ${className}`}
        >
            <img
                src={logoPath as string}
                alt={`${mediaName} logo`}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
            />
        </div>
    );
}
