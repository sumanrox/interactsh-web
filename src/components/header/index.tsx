'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DeleteIcon,
  DownloadIcon,
  SwitchIcon,
  LogoIcon,
  CopyIcon,
  BellIcon,
  RefreshIcon,
  SearchIcon,
  CloseIcon,
} from '@/components/icons';
import { themes } from '@/themes';
import NotificationsPopup from '@/components/notificationsPopup';
import ResetPopup from '@/components/resetPopup';
import ToggleBtn from '@/components/toggleBtn';
import CustomHost from '@/components/customHost';
import { handleDataExport } from '@/lib';
import { getStoredData, writeStoredData } from '@/lib/localStorage';
import './styles.scss';

interface HeaderP {
  handleAboutPopupVisibility: () => void;
  theme: string;
  host: string;
  url?: string;
  urlCopied?: boolean;
  onUrlCopy?: (e: React.MouseEvent) => void;
  handleThemeSelection: (name: string) => void;
  isResetPopupDialogVisible: boolean;
  isNotificationsDialogVisible: boolean;
  isCustomHostDialogVisible: boolean;
  handleResetPopupDialogVisibility: () => void;
  handleNotificationsDialogVisibility: () => void;
  handleCustomHostDialogVisibility: () => void;
  processPolledData: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResponseExportChange: (enabled: boolean) => void;
}

const Header = ({
  host,
  theme,
  url,
  urlCopied,
  onUrlCopy,
  handleAboutPopupVisibility,
  handleThemeSelection,
  isResetPopupDialogVisible,
  isNotificationsDialogVisible,
  isCustomHostDialogVisible,
  handleResetPopupDialogVisibility,
  handleNotificationsDialogVisibility,
  handleCustomHostDialogVisibility,
  processPolledData,
  searchQuery,
  onSearchChange,
  onResponseExportChange,
}: HeaderP) => {
  const data = getStoredData();
  const [inputData, setInputData] = useState({
    responseExport: data.responseExport,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleToggleBtn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, responseExport: e.target.checked });
    onResponseExportChange(e.target.checked);
  };

  const onRefreshClick = () => {
    setIsRefreshing(true);
    processPolledData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="header">
      <div className="left-group">
        <div className="brand" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
          <LogoIcon style={{ height: '22px', width: '22px' }} />
          <span className="logo_text">INTERACTSH</span>
        </div>

        {url && (
          <div 
            className="url_centerpiece"
            data-tooltip="Click to Copy"
            data-tooltip-clicked={urlCopied ? "true" : undefined}
            onClick={onUrlCopy}
          >
            <span className="url_val">{url}</span>
          </div>
        )}
      </div>

      <div className="center-group">
        <div className="search_bar">
          <SearchIcon className="search_icon" />
          <input 
            type="text" 
            placeholder="SEARCH_INTERACTIONS..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear_search" onClick={() => onSearchChange('')}>
              <CloseIcon style={{ width: '12px', height: '12px' }} />
            </button>
          )}
        </div>
      </div>

      <div className="right-group">
        <div className="actions">
          <div className="tool_item">
            <span className="label">AUTO-DOWNLOAD</span>
            <ToggleBtn
              name="responseExport"
              onChangeHandler={handleToggleBtn}
              value={inputData.responseExport}
            />
          </div>

          <button
            type="button"
            title="Switch host"
            className="host_btn"
            onClick={handleCustomHostDialogVisibility}
          >
            <SwitchIcon />
            <span>SWITCH HOST</span>
          </button>

          <div className="icon_group">
            <button type="button" onClick={handleResetPopupDialogVisibility} title="Reset">
              <DeleteIcon />
            </button>
            <button type="button" onClick={handleNotificationsDialogVisibility} title="Notifications">
              <BellIcon />
            </button>
            <button type="button" onClick={handleDataExport} title="Export">
              <DownloadIcon />
            </button>
          </div>
          
          <div className="v-divider" />
          
          <div className="nav_group">
            <Link href="/terms" className="nav_link">TERMS</Link>
            <button type="button" onClick={handleAboutPopupVisibility} className="nav_link">
              ABOUT
            </button>
          </div>

          <div className="v-divider" />

          <div className="theme_selector" title="Switch Theme">
            <div className="active_theme" style={{ background: (themes[theme] || themes['cyan']).accent }}></div>
            <div className="theme_dropdown">
              {Object.values(themes).map((t) => (
                <div 
                  key={t.name} 
                  className={`theme_option ${t.name === theme ? 'active' : ''}`}
                  onClick={() => handleThemeSelection(t.name)}
                >
                  <div className="dot" style={{ background: t.accent }}></div>
                  <span>{t.name.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="refresh-btn" onClick={onRefreshClick}>
            <RefreshIcon className={isRefreshing ? 'feather-spin' : ''} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {isCustomHostDialogVisible && (
        <CustomHost handleCloseDialog={handleCustomHostDialogVisibility} />
      )}
      {isResetPopupDialogVisible && (
        <ResetPopup handleCloseDialog={handleResetPopupDialogVisibility} />
      )}
      {isNotificationsDialogVisible && (
        <NotificationsPopup handleCloseDialog={handleNotificationsDialogVisibility} />
      )}
    </header>
  );
};

export default Header;
