import { ThemeName } from '@/theme';
import { Data } from './data';
import { Discord } from './discord';
import { Filter, defaultFilter } from './filter';
import { Slack } from './slack';
import { Tab } from './tab';
import { Telegram } from './telegram';
import { View } from './view';

export interface StoredData {
  view: View;
  increment: number;
  correlationId: string;
  correlationIdLength: number;
  correlationIdNonceLength: number;
  responseExport: boolean;
  theme: ThemeName;
  publicKey: string;
  privateKey: string;
  secretKey: string;
  host: string;
  token: string;
  telegram: Telegram;
  slack: Slack;
  discord: Discord;
  selectedTab: Tab;
  tabs: Tab[];
  data: Data[];
  notes: string[];
  aesKey: string;
  filter: Filter;
}

export const defaultStoredData: StoredData = {
  theme: 'noir',
  privateKey: '',
  publicKey: '',
  correlationId: '',
  correlationIdLength: Number(process.env.NEXT_PUBLIC_CIDL) || 20,
  correlationIdNonceLength: Number(process.env.NEXT_PUBLIC_CIDN) || 13,
  responseExport: false,
  secretKey: '',
  data: [],
  aesKey: '',
  notes: [],
  view: 'side_by_side',
  increment: 1,
  host: process.env.NEXT_PUBLIC_HOST || 'oast.fun',
  tabs: [],
  token: process.env.NEXT_PUBLIC_TOKEN || '',
  telegram: {
    enabled: false,
    botToken: '',
    chatId: '',
  },
  slack: {
    enabled: false,
    hookKey: '',
    channel: '',
  },
  discord: {
    enabled: false,
    webhook: '',
    channel: '',
  },
  selectedTab: {
    'unique-id': '',
    correlationId: '',
    name: '1',
    url: '',
    note: '',
  },
  filter: defaultFilter,
};

export default StoredData;
