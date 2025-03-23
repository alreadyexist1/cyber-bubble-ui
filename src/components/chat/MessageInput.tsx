
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Paperclip, 
  Send, 
  Smile,
  X,
  Image
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage,
  placeholder = "Type a message..." 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<Array<{ type: string; url: string; name: string }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() || previewFiles.length > 0) {
      onSendMessage(message);
      setMessage('');
      setPreviewFiles([]);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Mock recording functionality
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
      }, 5000);
    }
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => {
        const isImage = file.type.startsWith('image/');
        return {
          type: isImage ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name
        };
      });
      
      setPreviewFiles([...previewFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...previewFiles];
    URL.revokeObjectURL(updatedFiles[index].url);
    updatedFiles.splice(index, 1);
    setPreviewFiles(updatedFiles);
  };
  
  return (
    <div className="relative">
      {/* File previews */}
      {previewFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 mb-2 rounded-lg glass-panel">
          {previewFiles.map((file, index) => (
            <div key={index} className="relative group">
              {file.type === 'image' ? (
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md bg-white/10 flex items-center justify-center p-2">
                  <span className="text-xs text-center line-clamp-2">{file.name}</span>
                </div>
              )}
              
              <button 
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-background/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="relative flex items-end gap-2 glass-panel p-2 rounded-2xl">
        <button 
          onClick={handleFileClick}
          className="p-2 text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-white/10"
        >
          <Paperclip className="w-5 h-5" />
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent border-none focus:outline-none text-foreground placeholder:text-foreground/50 py-2 px-3 max-h-32 scrollbar-thin"
            rows={1}
          />
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-white/10">
            <Smile className="w-5 h-5" />
          </button>
          
          {message.trim() || previewFiles.length > 0 ? (
            <button 
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={toggleRecording}
              className={`p-2 rounded-full ${isRecording ? 'bg-destructive text-destructive-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors ${isRecording ? 'animate-pulse' : ''}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {isRecording && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium animate-fade-in flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Recording...
        </div>
      )}
    </div>
  );
};

export default MessageInput;
