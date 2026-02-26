'use client';

import React, { Suspense, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DetailedRequest from '@/components/detailedRequest';
import { Data } from '@/lib/types/data';
import { View } from '@/lib/types/view';
import { IssuesListFallback, IssuesListErrorFallback } from '@/helpers/fallback-loaders';

interface RequestDetailsWrapperP {
  view: View;
  selectedInteractionData: Data;
}

const RequestDetailsWrapper = memo((props: RequestDetailsWrapperP) => {
  const { selectedInteractionData, view } = props;

  // We are forcing side-by-side in styles.scss anyway, 
  // but we should always provide both for the Burp look
  return (
    <div className="detailed_request_wrapper">
      <ErrorBoundary
        FallbackComponent={({ resetErrorBoundary }) => (
          <IssuesListErrorFallback retry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<IssuesListFallback />}>
          <DetailedRequest
            view={view}
            data={`${selectedInteractionData['raw-request']}`}
            title="Request"
            protocol={selectedInteractionData.protocol}
          />
          {selectedInteractionData.protocol !== 'smtp' && (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData['raw-response'] || ''}`}
              title="Response"
              protocol={selectedInteractionData.protocol}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});

export default RequestDetailsWrapper;
