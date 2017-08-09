import React from 'react';

export default function RightHeavyTwoColumns({ Main, LeftMenu, minHeight }) {
  return (
    <div>
      <div className="left" style={{ width: '20%' }}>
        <div style={{ borderRight: '1px solid #eee', minHeight, padding: 10 }}>{LeftMenu}</div>
      </div>
      <div className="left" style={{ width: '80%' }}>
        <div style={{ padding: 10 }}>{Main}</div>
      </div>
      <div className="clear"></div>
    </div>
  );
}