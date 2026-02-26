'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { ThemeProvider } from 'styled-components';

import AppLoader from '@/components/appLoader';
import Header from '@/components/header';
import DetailedRequest from '@/components/detailedRequest';
import { GlobalStyles } from '@/globalStyles';
import {
  generateUrl,
  poll,
  decryptAESKey,
  processData,
  register,
  copyDataToClipboard,
} from '@/lib';
import { Data } from '@/lib/types/data';
import { StoredData } from '@/lib/types/storedData';
import { Tab } from '@/lib/types/tab';
import { themes, defaultTheme } from '@/themes';
import { writeStoredData, getStoredData, defaultStoredData, flushStoredData } from '@/lib/localStorage';
import RequestsTableWrapper from './components/requestsTableWrapper';
import './styles.scss';

const HomePage = () => {
  const [aboutPopupVisibility, setAboutPopupVisibility] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Array<Data>>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isResetPopupDialogVisible, setIsResetPopupDialogVisible] = useState<boolean>(false);
  const [isNotificationsDialogVisible, setIsNotificationsDialogVisible] = useState<boolean>(false);
  const [loaderAnimationMode, setLoaderAnimationMode] = useState<string>('loading');
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [selectedInteractionData, setSelectedInteractionData] = useState<Data | null>(null);
  const [storedData, setStoredData] = useState<StoredData>(defaultStoredData);
  const [isCustomHostDialogVisible, setIsCustomHostDialogVisible] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  // Strict Resize States (flex-basis)
  const [tableHeight, setTableHeight] = useState(55); // %
  const [requestWidth, setRequestWidth] = useState(50); // %
  const [notesWidth, setNotesWidth] = useState(320); // px

  const hasLoadedInitialData = useRef(false);
  const filteredDataRef = useRef<Array<Data>>([]);
  const resizeRef = useRef<{
    type: 'h-main' | 'v-reqres' | 'v-notes' | null;
    startX: number;
    startY: number;
    startBasis: number;
  }>({ type: null, startX: 0, startY: 0, startBasis: 0 });

  useEffect(() => {
    setIsClient(true);
    const loadedData = getStoredData();
    setStoredData(loadedData);
    
    const h = localStorage.getItem('tableHeightBasis');
    if (h) setTableHeight(parseFloat(h));
    const rw = localStorage.getItem('requestWidthBasis');
    if (rw) setRequestWidth(parseFloat(rw));
    const nw = localStorage.getItem('notesWidthBasis');
    if (nw) setNotesWidth(parseInt(nw, 10));
    
    hasLoadedInitialData.current = true;

    const handleUnload = () => flushStoredData();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleMouseDown = (type: 'h-main' | 'v-reqres' | 'v-notes') => (e: React.MouseEvent) => {
    resizeRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startBasis: type === 'h-main' ? tableHeight : type === 'v-reqres' ? requestWidth : notesWidth,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = type === 'h-main' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { type, startX, startY, startBasis } = resizeRef.current;
    if (!type) return;

    if (type === 'h-main') {
      const deltaY = e.clientY - startY;
      const bodyHeight = window.innerHeight - 44; // Header height
      const newVal = startBasis + (deltaY / bodyHeight) * 100;
      if (newVal > 15 && newVal < 85) {
        setTableHeight(newVal);
        localStorage.setItem('tableHeightBasis', newVal.toString());
      }
    } else if (type === 'v-reqres') {
      const deltaX = e.clientX - startX;
      const leftContentWidth = window.innerWidth - notesWidth;
      const newVal = startBasis + (deltaX / leftContentWidth) * 100;
      if (newVal > 20 && newVal < 80) {
        setRequestWidth(newVal);
        localStorage.setItem('requestWidthBasis', newVal.toString());
      }
    } else if (type === 'v-notes') {
      const deltaX = startX - e.clientX; // Resizing from right
      const newVal = startBasis + deltaX;
      if (newVal > 240 && newVal < 600) {
        setNotesWidth(newVal);
        localStorage.setItem('notesWidthBasis', newVal.toString());
      }
    }
  }, [notesWidth]);

  const handleMouseUp = useCallback(() => {
    resizeRef.current.type = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, [handleMouseMove]);

  const handleUrlCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (storedData.selectedTab?.url) {
      copyDataToClipboard(storedData.selectedTab.url);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  }, [storedData.selectedTab?.url]);

  const handleResetPopupDialogVisibility = useCallback(() => setIsResetPopupDialogVisible(v => !v), []);
  const handleNotificationsDialogVisibility = useCallback(() => setIsNotificationsDialogVisible(v => !v), []);
  const handleCustomHostDialogVisibility = useCallback(() => setIsCustomHostDialogVisible(v => !v), []);
  
  const handleThemeSelection = (name: string) => 
    setStoredData((prev) => ({ ...prev, theme: name }));
  
  const handleTabButtonClick = (tab: Tab) => { 
    setStoredData((prev) => ({ ...prev, selectedTab: tab })); 
    setSelectedInteraction(null); 
  };

  const handleAddNewTab = () => {
    setStoredData((prev) => {
      const { increment, host, correlationId, correlationIdNonceLength } = prev;
      const newIncrement = increment + 1;
      const { url, uniqueId } = generateUrl(correlationId, correlationIdNonceLength, newIncrement, host);
      const tabData: Tab = { 'unique-id': uniqueId, correlationId, name: newIncrement.toString(), url, note: '' };
      return { 
        ...prev, 
        tabs: prev.tabs.concat([tabData]), 
        selectedTab: tabData, 
        increment: newIncrement 
      };
    });
    setSelectedInteraction(null);
  };

  const handleNoteInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const value = e.target.value;
    setStoredData((prev) => {
      const { selectedTab, tabs } = prev;
      const updatedTab = { ...selectedTab, note: value };
      const newTabs = tabs.map((tab) => 
        tab['unique-id'] === selectedTab['unique-id'] ? updatedTab : tab
      );
      return { ...prev, tabs: newTabs, selectedTab: updatedTab };
    });
  };

  const handleResponseExportChange = (enabled: boolean) => {
    setStoredData((prev) => ({ ...prev, responseExport: enabled }));
  };

  const handleRowClick = useCallback((id: string) => {
    setSelectedInteraction(id);
    const reqDetails = filteredDataRef.current.find((item) => item.id === id);
    if (reqDetails) setSelectedInteractionData(reqDetails);
  }, []);

  const processPolledData = useCallback(async () => {
    try {
      const current = getStoredData();
      const pollData = await poll(
        current.correlationId, 
        current.secretKey, 
        current.host, 
        current.token, 
        handleResetPopupDialogVisibility, 
        handleCustomHostDialogVisibility
      );
      
      setIsRegistered(true);
      if (pollData?.data?.length > 0 && !pollData.error) {
        let aes = current.aesKey;
        if (pollData.aes_key) aes = decryptAESKey(current.privateKey, pollData.aes_key);
        const processed = await processData(aes, pollData);
        
        setStoredData((prev) => {
          const combined = prev.data.concat(processed);
          return { ...prev, data: combined, aesKey: aes };
        });
      }
    } catch (error) { 
      setIsRegistered(false); 
    }
  }, [handleResetPopupDialogVisibility, handleCustomHostDialogVisibility]);

  useEffect(() => { 
    if (hasLoadedInitialData.current) {
      writeStoredData(storedData); 
    }
  }, [storedData]);

  useEffect(() => {
    if (!isClient) return;
    const sync = () => setStoredData(getStoredData());
    window.addEventListener('storage', sync);
    
    // Initial registration if needed
    if (storedData.correlationId === '') {
      setTimeout(() => {
        register(storedData.host, storedData.token, false, false).then(d => { 
          setStoredData(d); 
          setIsRegistered(true); 
        });
      }, 1500);
    }
    
    return () => window.removeEventListener('storage', sync);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || storedData.tabs.length === 0) return;
    const id = setInterval(processPolledData, 4000);
    
    const filtered = storedData.data.filter((i) => {
      const matchesTab = i['unique-id'] === storedData.selectedTab['unique-id'];
      const matchesSearch = searchQuery === '' || 
        i['full-id'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        i['remote-address'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i['raw-request'] && i['raw-request'].toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesTab && matchesSearch;
    });
    
    filteredDataRef.current = filtered;
    setFilteredData(filtered);
    
    return () => clearInterval(id);
  }, [storedData.selectedTab, storedData.data, isClient, processPolledData, searchQuery]);

  const selectedTabsIndex = storedData.tabs.findIndex(
    (item) => item['unique-id'] === storedData.selectedTab['unique-id']
  );
  const theme = useMemo(() => themes[storedData.theme] || defaultTheme, [storedData.theme]);

  if (!isClient) return null;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <div className="main">
        <AppLoader isRegistered={isRegistered} mode={loaderAnimationMode} />
        <Header
          handleAboutPopupVisibility={() => setAboutPopupVisibility(v => !v)}
          theme={storedData.theme}
          host={storedData.host}
          url={storedData.selectedTab?.url}
          urlCopied={urlCopied}
          onUrlCopy={handleUrlCopy}
          handleThemeSelection={handleThemeSelection}
          isResetPopupDialogVisible={isResetPopupDialogVisible}
          isNotificationsDialogVisible={isNotificationsDialogVisible}
          handleResetPopupDialogVisibility={handleResetPopupDialogVisibility}
          handleNotificationsDialogVisibility={handleNotificationsDialogVisibility}
          isCustomHostDialogVisible={isCustomHostDialogVisible}
          handleCustomHostDialogVisibility={handleCustomHostDialogVisibility}
          processPolledData={processPolledData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResponseExportChange={handleResponseExportChange}
        />
        <div className="main-content">
          <div className="left-content">
            <div className="capture-table" style={{ flexBasis: `${tableHeight}%` }}>
              <RequestsTableWrapper
                data={filteredData}
                selectedInteraction={selectedInteraction || ''}
                handleRowClick={handleRowClick}
                filter={storedData.filter}
              />
            </div>

            <div className="splitter-h" onMouseDown={handleMouseDown('h-main')} />

            <div className="editor-section">
              <div className="request-panel" style={{ flexBasis: `${requestWidth}%` }}>
                <DetailedRequest
                  key={`req-${selectedInteractionData?.id || 'empty'}`}
                  view="side_by_side"
                  data={selectedInteractionData ? `${selectedInteractionData['raw-request']}` : ''}
                  title="REQUEST"
                  protocol={selectedInteractionData?.protocol || 'http'}
                />
              </div>

              <div className="splitter-v" onMouseDown={handleMouseDown('v-reqres')} />

              <div className="response-panel">
                <DetailedRequest
                  key={`res-${selectedInteractionData?.id || 'empty'}`}
                  view="side_by_side"
                  data={selectedInteractionData ? `${selectedInteractionData['raw-response'] || ''}` : ''}
                  title="RESPONSE"
                  protocol={selectedInteractionData?.protocol || 'http'}
                />
              </div>
            </div>
          </div>

          <div className="splitter-v" onMouseDown={handleMouseDown('v-notes')} />

          <div className="notes-panel" style={{ flexBasis: `${notesWidth}px` }}>
            <div className="section_header">NOTES</div>
            <div className="notes_editor">
              <textarea
                id="notes_textarea"
                placeholder="Capture notes here..."
                value={storedData.tabs[selectedTabsIndex]?.note || ''}
                onChange={handleNoteInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
