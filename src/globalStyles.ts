import { createGlobalStyle } from 'styled-components';
import { Theme } from '@/theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  :root {
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --accent: #b5fc58;
    --accent-subtle: #1a2314;
  }

  * {
    box-sizing: border-box;
    border-radius: 0 !important;
    box-shadow: none !important;
    text-shadow: none !important;
    transition: none !important;
  }

  html {
    font-size: 10px;
  }

  body {
    background: #0b0b0b;
    color: #eaeaea;
    font-family: var(--font-sans);
    margin: 0;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  button {
    font-family: var(--font-sans);
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 0;
    color: inherit;
    outline: none;
  }

  input, textarea {
    font-family: var(--font-mono);
    background: transparent;
    color: #eaeaea;
    border: 1px solid #1a1a1a;
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #222;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }

  /* TOOLTIP SYSTEM - Render on the RIGHT to avoid blocking content below */
  [data-tooltip] {
    position: relative;
  }

  [data-tooltip]:before,
  [data-tooltip]:after {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    z-index: 100000;
  }

  [data-tooltip]:before {
    content: attr(data-tooltip);
    top: 50%;
    left: 100%;
    transform: translateY(-50%) translateX(10px);
    background: var(--accent);
    color: #000;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: 4px 0 15px rgba(0,0,0,0.3);
  }

  [data-tooltip]:after {
    content: '';
    top: 50%;
    left: 100%;
    transform: translateY(-50%) translateX(2px);
    border: 4px solid transparent;
    border-right-color: var(--accent); /* Arrow pointing left */
  }

  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    opacity: 1;
  }

  /* COPIED STATE */
  [data-tooltip-clicked]:before {
    content: "COPIED" !important;
    background: #fff !important;
    color: #000 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  [data-tooltip-clicked]:after {
    border-right-color: #fff !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .feather-spin {
    animation: spin 2s linear infinite;
  }
`;

export default {};
