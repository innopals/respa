import React from 'react';

export default function HomePageWelcomePart({ name, ip, error }) {
  return (
    <div>
      <div>Hello {name || 'my friend'}! {ip && `You're coming from ${ip}.`}</div>
      {error && <p>Unable to get your public IP address.</p>}
    </div>
  )
}
