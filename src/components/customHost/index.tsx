'use client';

import React, { useState } from 'react';
import { ArrowRightIcon, CloseIcon, LoaderIcon } from '@/components/icons';
import { register } from '@/lib';
import { defaultStoredData, getStoredData, writeStoredData } from '@/lib/localStorage';
import './styles.scss';

interface CustomHostP {
  handleCloseDialog: () => void;
}

const CustomHost = ({ handleCloseDialog }: CustomHostP) => {
  const data = getStoredData();
  const { host, token, correlationIdLength, correlationIdNonceLength } = data;
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState('');
  const [inputValue, setInputValue] = useState<string>(host === 'oast.fun' ? '' : host);
  const [tokenInputValue, setTokenInputValue] = useState<string>(token === '' ? '' : token);
  const [correlationIdLengthInputValue, setCorrelationIdLengthValue] = useState<number>(
    correlationIdLength === 20 ? 20 : correlationIdLength
  );
  const [correlationIdNonceLengthInputValue, setCorrelationIdNonceLengthValue] = useState<number>(
    correlationIdNonceLength === 13 ? 13 : correlationIdNonceLength
  );

  const handleDeleteConfirmationVisibility = () => {
    setIsDeleteConfirmationVisible(!isDeleteConfirmationVisible);
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    switch (e.target.name) {
      case 'custom_host':
        setInputValue(e.target.value);
        break;
      case 'token':
        setTokenInputValue(e.target.value);
        break;
      case 'cidl':
        setCorrelationIdLengthValue(parseInt(e.target.value, 10));
        break;
      case 'cidn':
        setCorrelationIdNonceLengthValue(parseInt(e.target.value, 10));
        break;
      default:
        break;
    }
  };

  const handleConfirm = () => {
    if (
      (inputValue !== '' && inputValue !== 'oast.fun' && host !== inputValue) ||
      (inputValue !== '' && inputValue !== 'oast.fun' && tokenInputValue !== token)
    ) {
      setIsLoading(true);
      const oldData = getStoredData();
      setTimeout(() => {
        writeStoredData({
          ...getStoredData(),
          correlationIdLength: correlationIdLengthInputValue,
          correlationIdNonceLength: correlationIdNonceLengthInputValue,
        });
        register(
          inputValue.replace(/(^\w+:|^)\/\//, ''),
          tokenInputValue,
          inputValue !== host && tokenInputValue === token,
          inputValue === host && tokenInputValue !== token
        )
          .then((d) => {
            localStorage.clear();
            writeStoredData(d);
            setIsLoading(false);
            handleCloseDialog();
            setErrorText('');
            window.location.reload();
          })
          .catch((err) => {
            if (err.message === 'auth failed') {
              setIsLoading(false);
              setErrorText('Authentication failed, token not valid.');
            } else {
              setIsLoading(false);
              setErrorText(
                'We were unable to establish a connection with your server; please try again by clicking on confirm.'
              );
            }
            writeStoredData({ ...oldData });
          });
      }, 30);
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    const oldData = getStoredData();
    setTimeout(() => {
      writeStoredData({
        ...getStoredData(),
        correlationIdLength: defaultStoredData.correlationIdLength,
        correlationIdNonceLength: defaultStoredData.correlationIdNonceLength,
      });
      register(defaultStoredData.host, defaultStoredData.token, true, false)
        .then((d) => {
          localStorage.clear();
          writeStoredData(d);
          setIsLoading(false);
          handleCloseDialog();
          setErrorText('');
          window.location.reload();
        })
        .catch((err) => {
          if (err.message === 'auth failed') {
            setIsLoading(false);
            setErrorText('Authentication failed, token not valid.');
          } else {
            setIsLoading(false);
            setErrorText(
              'We were unable to establish a connection with your server; please try again by clicking on confirm.'
            );
          }
          writeStoredData({ ...oldData });
        });
    }, 30);
  };

  return (
    <div className="backdrop_container">
      {isDeleteConfirmationVisible ? (
        <div className="dialog_box">
          <div className="header">
            <span>REMOVE CUSTOM HOST</span>
            <CloseIcon onClick={handleDeleteConfirmationVisibility} style={{ cursor: 'pointer' }} />
          </div>
          <span>
            Please confirm the action, this action can&apos;t be undone and all the client data will be
            deleted immediately.
          </span>
          <div className="buttons">
            <button
              type="button"
              className="delete_button"
              disabled={isLoading}
              onClick={handleDelete}
            >
              DELETE {isLoading && <LoaderIcon />}
            </button>
          </div>
        </div>
      ) : (
        <div className="dialog_box">
          <div className="header">
            <span>CUSTOM HOST</span>
            <CloseIcon onClick={handleCloseDialog} style={{ cursor: 'pointer' }} />
          </div>
          <span>
            You can point your self hosted oast.fun server below to connect with this web client.
          </span>
          <input
            type="text"
            name="custom_host"
            placeholder="HOST (e.g. oast.fun)"
            value={inputValue}
            onChange={handleInput}
          />
          <input
            type="text"
            name="token"
            placeholder="TOKEN (OPTIONAL)"
            disabled={inputValue === ''}
            value={tokenInputValue}
            onChange={handleInput}
          />
          <div className="advanced_options">
            <span>CORRELATION ID LENGTH (CIDL)</span>
            <input
              type="number"
              min="1"
              max="50"
              name="cidl"
              placeholder="LENGTH"
              disabled={inputValue === ''}
              value={correlationIdLengthInputValue}
              onChange={handleInput}
            />
          </div>
          <div className="advanced_options">
            <span>CORRELATION ID NONCE LENGTH (CIDN)</span>
            <input
              type="number"
              min="1"
              max="50"
              name="cidn"
              placeholder="LENGTH"
              disabled={inputValue === ''}
              value={correlationIdNonceLengthInputValue}
              onChange={handleInput}
            />
          </div>
          {errorText !== '' && <div className="error">{errorText}</div>}
          <div className="buttons">
            {host !== 'oast.fun' && (
              <button
                type="button"
                className="remove_button"
                onClick={handleDeleteConfirmationVisibility}
              >
                REMOVE CUSTOM HOST
              </button>
            )}
            <button
              type="button"
              className="submit_button"
              disabled={
                isLoading ||
                (host === inputValue &&
                  token === tokenInputValue &&
                  correlationIdLength === correlationIdLengthInputValue &&
                  correlationIdNonceLength === correlationIdNonceLengthInputValue)
              }
              onClick={handleConfirm}
            >
              CONFIRM
              {isLoading ? <LoaderIcon /> : <ArrowRightIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomHost;
