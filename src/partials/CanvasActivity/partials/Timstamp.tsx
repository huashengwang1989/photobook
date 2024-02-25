import React from 'react';

const MetaTimestamp: React.FC<{ ts: string, label: string }> = (props) => {
  const { ts, label } = props;

  const [dd, t] = ts.split(' ');
  const [y, mo, d] = dd.split('-');
  const [mm, s] = t.split(':');

  return (
    <li className="flex">
      <span className="mr-1 inline-block min-w-[72px] text-right">
        {label}:
      </span>
      <span className="mr-1 flex justify-center">
        <span className="inline-block min-w-7 text-right">{y}</span>
        <span className="inline-block">-</span>
        <span className="inline-block min-w-4 text-center">{mo}</span>
        <span className="inline-block">-</span>
        <span className="inline-block min-w-4 text-center">{d}</span>
      </span>
      <span className="flex justify-center">
        <span className="inline-block min-w-4 text-center">{mm}</span>
        <span className="inline-block">:</span>
        <span className="inline-block min-w-4 text-center">{s}</span>
      </span>
    </li>
  );
};

export default MetaTimestamp;
