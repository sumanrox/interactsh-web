'use client';

import React, { useState } from 'react';
import { CloseIcon, DeleteIcon, DownloadIcon, LoaderIcon } from '@/components/icons';
import { handleDataExport, register } from '@/lib';
import { getStoredData, writeStoredData } from '@/lib/localStorage';
import './styles.scss';

interface ResetPopupP {
  handleCloseDialog: () => void;
}

const ResetPopup = ({ handleCloseDialog }: ResetPopupP) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStoredData = getStoredData();

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      register(currentStoredData.host, currentStoredData.token, true, false)
        .then((d) => {
          setIsLoading(false);
          localStorage.clear();
          writeStoredData(d);
          handleCloseDialog();
          window.location.reload();
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, 50);
  };

  return (
    <div className="backdrop_container">
      <div className="dialog_box">
        <div className="header">
          <span>RESET {currentStoredData.host.toUpperCase()}</span>
          <CloseIcon onClick={handleCloseDialog} style={{ cursor: 'pointer' }} />
        </div>
        <span>
          PLEASE CONFIRM THE ACTION. THIS ACTION CANNOT BE UNDONE AND ALL CLIENT DATA WILL BE
          DELETED IMMEDIATELY. YOU CAN DOWNLOAD A COPY OF YOUR DATA IN JSON FORMAT BY CLICKING THE
          EXPORT BUTTON BELOW OR IN THE TOP RIGHT.
        </span>
        <div className="buttons">
          <button type="button" title="EXPORT" className="button" onClick={handleDataExport}>
            EXPORT <DownloadIcon />
          </button>
        </div>
        <div className="buttons">
          <button
            type="button"
            disabled={isLoading}
            className="confirm_button"
            onClick={handleConfirm}
          >
            CONFIRM {isLoading ? <LoaderIcon /> : <DeleteIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPopup;
