'use client';

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ArrowRightIcon, CloseIcon, LoaderIcon } from '@/components/icons';
import ToggleBtn from '@/components/toggleBtn';
import { getStoredData, writeStoredData } from '@/lib/localStorage';
import './styles.scss';

interface NotificationsPopupP {
  handleCloseDialog: () => void;
}

const NotificationsPopup = ({ handleCloseDialog }: NotificationsPopupP) => {
  const data = getStoredData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputData, setInputData] = useState({
    telegram: data.telegram,
    slack: data.slack,
    discord: data.discord,
  });

  const handleTelegramConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, telegram: inputData.telegram });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleDiscordConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, discord: inputData.discord });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleSlackConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, slack: inputData.slack });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'telegram_bot_token') {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, botToken: e.target.value } });
    } else if (e.target.id === 'telegram_chat_id') {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, chatId: e.target.value } });
    } else if (e.target.id === 'slack_hook_key') {
      setInputData({ ...inputData, slack: { ...inputData.slack, hookKey: e.target.value } });
    } else if (e.target.id === 'slack_channel') {
      setInputData({ ...inputData, slack: { ...inputData.slack, channel: e.target.value } });
    } else if (e.target.id === 'discord_webhook') {
      setInputData({ ...inputData, discord: { ...inputData.discord, webhook: e.target.value } });
    } else if (e.target.id === 'discord_channel') {
      setInputData({ ...inputData, discord: { ...inputData.discord, channel: e.target.value } });
    }
  };

  const handleToggleBtn = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'telegram') {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, enabled: e.target.checked } });
      writeStoredData({ ...data, telegram: { ...data.telegram, enabled: e.target.checked } });
    } else if (e.target.name === 'slack') {
      setInputData({ ...inputData, slack: { ...inputData.slack, enabled: e.target.checked } });
      writeStoredData({ ...data, slack: { ...data.slack, enabled: e.target.checked } });
    } else if (e.target.name === 'discord') {
      setInputData({ ...inputData, discord: { ...inputData.discord, enabled: e.target.checked } });
      writeStoredData({ ...data, discord: { ...data.discord, enabled: e.target.checked } });
    }
  };

  return (
    <div className="backdrop_container">
      <div className="dialog_box">
        <div className="header">
          <span>NOTIFICATIONS</span>
          <CloseIcon onClick={handleCloseDialog} style={{ cursor: 'pointer' }} />
        </div>
        <div className="body">
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList className="tab_list">
              <Tab className="tab">
                <div
                  id="editor_button"
                  style={{
                    color: inputData.telegram.enabled ? 'var(--accent)' : '#fff',
                  }}
                >
                  TELEGRAM
                </div>
                <ToggleBtn
                  name="telegram"
                  onChangeHandler={handleToggleBtn}
                  value={inputData.telegram.enabled}
                />
              </Tab>
              <Tab className="tab">
                <div
                  id="editor_button"
                  style={{
                    color: inputData.slack.enabled ? 'var(--accent)' : '#fff',
                  }}
                >
                  SLACK
                </div>
                <ToggleBtn
                  name="slack"
                  onChangeHandler={handleToggleBtn}
                  value={inputData.slack.enabled}
                />
              </Tab>
              <Tab className="tab">
                <div
                  id="editor_button"
                  style={{
                    color: inputData.discord.enabled ? 'var(--accent)' : '#fff',
                  }}
                >
                  DISCORD
                </div>
                <ToggleBtn
                  name="discord"
                  onChangeHandler={handleToggleBtn}
                  value={inputData.discord.enabled}
                />
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="panel">
                <input
                  id="telegram_bot_token"
                  type="text"
                  placeholder="ENTER TELEGRAM BOT TOKEN"
                  onChange={handleInput}
                  value={inputData.telegram.botToken}
                />
                <input
                  id="telegram_chat_id"
                  type="text"
                  placeholder="ENTER TELEGRAM CHAT ID"
                  onChange={handleInput}
                  value={inputData.telegram.chatId}
                />
                <button
                  type="button"
                  className="submit_button"
                  disabled={
                    inputData.telegram.botToken === '' ||
                    inputData.telegram.chatId === '' ||
                    (inputData.telegram.botToken === data.telegram.botToken &&
                      inputData.telegram.chatId === data.telegram.chatId)
                  }
                  onClick={handleTelegramConfirm}
                >
                  CONFIRM
                  {isLoading ? <LoaderIcon /> : <ArrowRightIcon />}
                </button>
              </TabPanel>
              <TabPanel className="panel">
                <input
                  id="slack_hook_key"
                  type="text"
                  placeholder="HTTPS://HOOKS.SLACK.COM/SERVICES/XXX/XXX/XXXXXXXX"
                  onChange={handleInput}
                  value={inputData.slack.hookKey}
                />
                <input
                  id="slack_channel"
                  type="text"
                  placeholder="ENTER SLACK CHANNEL (OPTIONAL)"
                  onChange={handleInput}
                  value={inputData.slack.channel}
                />
                <button
                  type="button"
                  className="submit_button"
                  disabled={
                    inputData.slack.hookKey === '' ||
                    (inputData.slack.hookKey === data.slack.hookKey &&
                      inputData.slack.channel === data.slack.channel)
                  }
                  onClick={handleSlackConfirm}
                >
                  CONFIRM
                  {isLoading ? <LoaderIcon /> : <ArrowRightIcon />}
                </button>
              </TabPanel>
              <TabPanel className="panel">
                <input
                  id="discord_webhook"
                  type="text"
                  placeholder="HTTPS://DISCORD.COM/API/WEBHOOKS/XXXXX/XXXXXXXXXX"
                  onChange={handleInput}
                  value={inputData.discord.webhook}
                />
                <input
                  id="discord_channel"
                  type="text"
                  placeholder="ENTER DISCORD CHANNEL (OPTIONAL)"
                  onChange={handleInput}
                  value={inputData.discord.channel}
                />
                <button
                  type="button"
                  className="submit_button"
                  disabled={
                    inputData.discord.webhook === '' ||
                    (inputData.discord.webhook === data.discord.webhook &&
                      inputData.discord.channel === data.discord.channel)
                  }
                  onClick={handleDiscordConfirm}
                >
                  CONFIRM
                  {isLoading ? <LoaderIcon /> : <ArrowRightIcon />}
                </button>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopup;
