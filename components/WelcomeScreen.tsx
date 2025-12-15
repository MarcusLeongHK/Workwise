/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import Spinner from './Spinner';
import UploadCloudIcon from './icons/UploadCloudIcon';
import PhotoshopIcon from './icons/PhotoshopIcon';
import PowerBIIcon from './icons/PowerBIIcon';
import DocumentIcon from './icons/DocumentIcon';
import TrashIcon from './icons/TrashIcon';

interface WelcomeScreenProps {
    onUpload: () => Promise<void>;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const sampleDocuments = [
    {
            name: 'SOP Manual',
            details: '7 pages, PDF',
            url: '/SAMPLE_SOP_2.pdf',
            icon: <DocumentIcon />,
            fileName: 'SAMPLE_SOP_2.pdf'
    },
    {
        name: 'Photoshop Manual',
        details: '1017 pages, PDF',
        url: '/photoshop_reference.pdf',
        icon: <PhotoshopIcon />,
        fileName: 'photoshop_reference.pdf'
    },
    {
      name: 'PowerBI Manual',
      details: '407 pages, PDF',
      url: '/powerbi_reference.pdf',
      icon: <PowerBIIcon />,
      fileName: 'powerbi_reference.pdf'
    }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUpload, files, setFiles }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [loadingSample, setLoadingSample] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(event.dataTransfer.files)]);
        }
    }, [setFiles]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);
    
    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleSelectSample = async (name: string, url: string, fileName: string) => {
        if (loadingSample) return;
        setLoadingSample(name);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${name}: ${response.statusText}. This may be a CORS issue.`);
            }
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });
            setFiles(prev => [...prev, file]);
        } catch (error) {
            console.error("Error fetching sample file:", error);
            if (error instanceof Error && error.message.includes('Failed to fetch')) {
                alert(`Could not fetch the sample document. Please try uploading a local file instead.`);
            }
        } finally {
            setLoadingSample(null);
        }
    };

    const handleConfirmUpload = async () => {
        try {
            await onUpload();
        } catch (error) {
            // Error is handled by the parent component, but we catch it here
            // to prevent an "uncaught promise rejection" warning in the console.
            console.error("Upload process failed:", error);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-3xl text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-2">Empower your SRL with AI</h1>
                <p className="text-gem-offwhite/70 mb-8">
                    Powered by <strong className="font-semibold text-gem-offwhite">FileSearch</strong>. Upload a manual or select example to see RAG in action.
                </p>

                <div 
                    className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors mb-6 ${isDragging ? 'border-gem-blue bg-gem-mist/10' : 'border-gem-mist/50'}`}
                    onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center justify-center">
                        <UploadCloudIcon />
                        <p className="mt-4 text-lg text-gem-offwhite/80">Drag & drop your PDF, .txt, or .md file here.</p>
                        <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.md"/>
                         <label 
                            htmlFor="file-upload" 
                            className="mt-4 cursor-pointer px-6 py-2 bg-gem-blue text-white rounded-full font-semibold hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gem-onyx focus:ring-gem-blue" 
                            title="Select files from your device"
                            tabIndex={0}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    (document.getElementById('file-upload') as HTMLInputElement)?.click();
                                }
                            }}
                         >
                            Or Browse Files
                        </label>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="w-full max-w-xl mx-auto mb-6 text-left">
                        <h4 className="font-semibold mb-2">Selected Files ({files.length}):</h4>
                        <ul className="max-h-36 overflow-y-auto space-y-1 pr-2">
                            {files.map((file, index) => (
                                <li key={`${file.name}-${index}`} className="text-sm bg-gem-mist/50 p-2 rounded-md flex justify-between items-center group">
                                    <span className="truncate" title={file.name}>{file.name}</span>
                                    <div className="flex items-center flex-shrink-0">
                                        <span className="text-xs text-gem-offwhite/50 ml-2">{(file.size / 1024).toFixed(2)} KB</span>
                                        <button 
                                            onClick={() => handleRemoveFile(index)}
                                            className="ml-2 p-1 text-red-400 hover:text-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Remove ${file.name}`}
                                            title="Remove this file"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="w-full max-w-xl mx-auto">
                    {files.length > 0 && (
                        <button 
                            onClick={handleConfirmUpload}
                            className="w-full px-6 py-3 rounded-md bg-gem-blue hover:bg-blue-500 text-white font-bold transition-colors"
                            title="Start chat session with the selected files"
                        >
                            Upload and Chat
                        </button>
                    )}
                </div>
                
                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gem-mist"></div>
                    <span className="flex-shrink mx-4 text-gem-offwhite/60">OR</span>
                    <div className="flex-grow border-t border-gem-mist"></div>
                </div>

                <div className="text-left mb-4">
                    <p className="text-gem-offwhite/80">Try an example:</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {sampleDocuments.map(doc => (
                        <button
                            key={doc.name}
                            onClick={() => handleSelectSample(doc.name, doc.url, doc.fileName)}
                            disabled={!!loadingSample}
                            className="bg-gem-slate p-4 rounded-lg border border-gem-mist/30 hover:border-gem-blue/50 hover:bg-gem-mist/10 transition-all text-left flex items-center space-x-4 disabled:opacity-50 disabled:cursor-wait"
                            title={`Chat with the ${doc.name}`}
                        >
                            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-gem-mist/20 rounded-lg">
                                {loadingSample === doc.name ? <Spinner /> : doc.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-gem-offwhite">{doc.name}</p>
                                <p className="text-sm text-gem-offwhite/60">{doc.details}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
