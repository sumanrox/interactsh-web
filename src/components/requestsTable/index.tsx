'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef, memo } from 'react';
import { formatDistance } from 'date-fns';
import { FilterIcon, FilterSelectedIcon } from '@/components/icons';
import { getStoredData, writeStoredData } from '@/lib/localStorage';
import { Data, filterByProtocols } from '@/lib/types/data';
import { Filter } from '@/lib/types/filter';
import { Protocol, protocols } from '@/lib/types/protocol';
import { trueKeys } from '@/lib/utils';
import './styles.scss';

interface RequestsTableP {
  data: Data[];
  handleRowClick: (id: string) => void;
  selectedInteraction: string;
  filter: Filter;
}

const RequestsTable = memo(({ data, handleRowClick, selectedInteraction, filter }: RequestsTableP) => {
  const [filterDropdownVisibility, setFilterDropdownVisibility] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<Filter>(filter);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFiltered = trueKeys(filterValue).length !== protocols.length;

  const filteredData = useMemo(() => {
    const activeProtocols = trueKeys(filterValue);
    return filterByProtocols(activeProtocols)(data);
  }, [data, filterValue]);

  useEffect(() => {
    if (!filterDropdownVisibility) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterDropdownVisibility(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filterDropdownVisibility]);

  const handleFilterDropdownVisibility = useCallback(() => {
    setFilterDropdownVisibility(prev => !prev);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setFilterValue(getStoredData().filter);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFilterSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterValue: Filter = {
      ...filterValue,
      [e.target.value as Protocol]: e.target.checked,
    };

    setFilterValue(newFilterValue);
    writeStoredData({ ...getStoredData(), filter: newFilterValue });
  };

  return (
    <table className="requests_table">
      <thead>
        <tr>
          <th>#</th>
          <th>
            <div id="filter_dropdown" ref={dropdownRef}>
              <div
                className={isFiltered ? '__filtered' : ''}
                onClick={handleFilterDropdownVisibility}
              >
                TYPE
                {isFiltered ? <FilterSelectedIcon style={{ marginLeft: '4px' }} /> : <FilterIcon style={{ marginLeft: '4px' }} />}
              </div>
              {filterDropdownVisibility && (
                <div className="filter_dropdown">
                  <ul>
                    {protocols.map((p) => (
                      <li key={p}>
                        <label htmlFor={p}>
                          <input
                            onChange={handleFilterSelection}
                            type="checkbox"
                            name="filter"
                            id={p}
                            value={p}
                            checked={filterValue[p]}
                          />
                          <span className="checkmark" />
                          <span>{Protocol.show.show(p)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </th>
          <th>ID</th>
          <th>ADDRESS</th>
          <th>INFO</th>
          <th>TIME</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, i) => (
          <TableRow
            key={item.id}
            item={item}
            index={i}
            total={filteredData.length}
            isSelected={item.id === selectedInteraction}
            onClick={handleRowClick}
          />
        ))}
      </tbody>
    </table>
  );
});

const TableRow = memo(({ 
  item, 
  index, 
  total, 
  isSelected, 
  onClick 
}: { 
  item: Data; 
  index: number; 
  total: number; 
  isSelected: boolean; 
  onClick: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  const formattedTime = useMemo(() => 
    formatDistance(new Date(item.timestamp), new Date(), { addSuffix: true }),
    [item.timestamp]
  );

  const info = useMemo(() => {
    if (item.protocol === 'dns') {
      return item['q-type'] || 'A';
    }
    if (item.protocol === 'smtp') return `FROM: ${item['smtp-from'] || 'Unknown'}`;
    if (item.protocol === 'http') {
      const firstLine = item['raw-request'].split('\n')[0];
      const match = firstLine.match(/^([A-Z]+)\s+([^\s?]+)/);
      if (match) return `${match[1]} ${match[2]}`;
      return firstLine.substring(0, 50);
    }
    return '';
  }, [item]);

  return (
    <tr
      onClick={handleClick}
      className={isSelected ? 'selected_row' : ''}
    >
      <td>{total - index}</td>
      <td>{item.protocol.toUpperCase()}</td>
      <td>{item['full-id']}</td>
      <td>{item['remote-address']}</td>
      <td title={info}>{info}</td>
      <td>{formattedTime}</td>
    </tr>
  );
});

export default RequestsTable;
