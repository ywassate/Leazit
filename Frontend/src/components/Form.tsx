import React, { useRef } from "react";
import styled from 'styled-components';

type FormProps = {
  onFilesChange: (files: File[]) => void;
  maxTotalSizeMo: number;
  errorMsg?: string;
  files?: File[];
};

const Form: React.FC<FormProps> = ({
  onFilesChange,
  errorMsg,
  files = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const filesArr = Array.from(filesList);
    onFilesChange(filesArr);
  };

  return (
    <StyledWrapper>
      <form className="file-upload-form" onSubmit={e => e.preventDefault()}>
        <label htmlFor="file" className="file-upload-label">
          <div className="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
            </svg>
            <p>Drag and Drop</p>
            <p>or</p>
            <span className="browse-button">Browse file</span>
          </div>
          <input
            id="file"
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFiles(e.target.files)}
          />
        </label>
        {errorMsg && (
          <div className="text-red-600 text-sm mt-3">{errorMsg}</div>
        )}
        {files && files.length > 0 && (
          <ul className="space-y-1 mt-4">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center">
                <span className="font-medium">{file.name}</span>
                <span className="ml-2 text-gray-500">
                  ({(file.size / (1024 * 1024)).toFixed(2)} Mo)
                </span>
                <button
                  type="button"
                  className="ml-3 text-red-500 text-xs underline"
                  onClick={e => {
                    e.stopPropagation();
                    // Appelle le onFilesChange sans le fichier supprimé
                    onFilesChange(files.filter((_, i) => i !== idx));
                  }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}

      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .file-upload-form {
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .file-upload-label input {
    display: none;
  }
  .file-upload-label svg {
    height: 50px;
    fill: rgb(0, 128, 0);
    margin-bottom: 20px;
  }
  .file-upload-label {
    cursor: pointer;
    background-color: #ddd;
    padding: 30px 70px;
    border-radius: 40px;
    border: 2px dashed rgb(0, 128, 0);
    box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);
  }
  .file-upload-design {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .browse-button {
    background-color: rgb(0, 128, 0);
    padding: 5px 15px;
    border-radius: 10px;
    color: white;
    transition: all 0.3s;
  }
  .browse-button:hover {
    background-color: rgb(50, 205, 50);
  }
`;

export default Form;
