'use client';

import React, { memo, useCallback, useState, useMemo } from 'react';
import { CopyIcon } from '@/components/icons';
import { copyDataToClipboard } from '@/lib';
import { Protocol } from '@/lib/types/protocol';
import { View } from '@/lib/types/view';
import './styles.scss';

interface DetailedRequestP {
  title: string;
  data: string;
  view: View;
  protocol: Protocol;
}

const DetailedRequest = memo(({ title, data, view, protocol }: DetailedRequestP) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    copyDataToClipboard(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const lines = useMemo(() => {
    if (!data) return [' '];
    return data.replace(/\r\n/g, '\n').split('\n');
  }, [data]);

  return (
    <div className="detailed_request_container">
      <div className="pane-header">
        <div className="pane-title-group">
          <span className="pane-title">{title}</span>
          <button 
            className="copy-btn"
            onClick={handleCopy} 
            data-tooltip="Click to Copy"
            data-tooltip-clicked={copied ? "true" : undefined}
          >
            <CopyIcon style={{ width: '1.8rem', height: '1.8rem' }} />
          </button>
        </div>
      </div>
      <div className="tabs-strip">
        <div className="active-tab-label">Pretty</div>
      </div>
      <div className="editor-body">
        <div className="editor-grid">
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              <div className="line-number">{i + 1}</div>
              <div className="line-content">{line || ' '}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DetailedRequest;
