import React from "react";
import { CSVManagerMode } from "@/types";
import {
    ArrowUpTrayIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface ModeToggleProps {
    currentMode: CSVManagerMode;
    onModeChange: (mode: CSVManagerMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
    currentMode,
    onModeChange,
}) => {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
                モード選択 (Select Mode)
            </label>
            <div className="inline-flex rounded-md shadow-sm">
                <button
                    className={`flex-1 items-center justify-center px-6 py-3 text-base font-medium rounded-l-md border ${
                        currentMode === CSVManagerMode.UPLOAD
                            ? "bg-primary-800 text-white border-primary-900 shadow-inner"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-primary-50 hover:text-primary-800"
                    } transition-all duration-200 ease-in-out`}
                    onClick={() => onModeChange(CSVManagerMode.UPLOAD)}
                >
                    <div className="flex items-center justify-center">
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        <span>Upload</span>
                    </div>
                </button>
                <button
                    className={`flex-1 items-center justify-center px-6 py-3 text-base font-medium rounded-r-md border ${
                        currentMode === CSVManagerMode.DOWNLOAD
                            ? "bg-primary-800 text-white border-primary-900 shadow-inner"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-primary-50 hover:text-primary-800"
                    } transition-all duration-200 ease-in-out`}
                    onClick={() => onModeChange(CSVManagerMode.DOWNLOAD)}
                >
                    <div className="flex items-center justify-center">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        <span>Download</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ModeToggle;
