import Modal from 'react-modal';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { X } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

interface ResumeViewerProps {
  fileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeViewer = ({ fileUrl, isOpen, onClose }: ResumeViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Resume Viewer Modal"
      className="fixed inset-0 w-full h-full bg-background flex flex-col focus:outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      style={{ content: { position: 'fixed', inset: 0 } }}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="text-lg font-semibold text-foreground ml-3">My Resume</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary" aria-label="Close">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Worker workerUrl={pdfWorkerUrl}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance, fullScreenPluginInstance]}
            defaultScale={1.3}
          />
        </Worker>
      </div>
    </Modal>
  );
};
