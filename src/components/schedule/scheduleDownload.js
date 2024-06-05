import { Parser } from 'json2csv';
import React from 'react';
import { Button } from '../ui/button';
import { useSchedule } from './ScheduleContext';

export const DownloadButton = ({text, filename}) => {
  const { schedule, setSchedule } = useSchedule();
  const csvData = jsonToCsv(schedule);
  const handleDownload = (filename) => {
    const blob = new Blob([
      new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
      csvData],
      { type: 'text/csv;charset=utf-8;' }
      );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button className="bg-green-400" onClick={() => handleDownload(filename)} variant="primary">
      {text}
    </Button>
  );
};

export const jsonToCsv = (json) => {
  const fields = ['date', 'time', 'dest', 'content', 'cost', 'duration'];
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(json);
    return csv;
  } catch (err) {
    console.error(err);
    return null;
  }
};