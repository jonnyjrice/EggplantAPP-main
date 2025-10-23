'use client'

import ViewSwitcher from '@/components/ViewSwitcher'

export default function TestViewSwitcher() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>View Switcher Test</h1>
      <p>Click the buttons below to test the view switcher:</p>
      <ViewSwitcher />
      <div style={{ marginTop: '2rem' }}>
        <p>Current URL: {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}</p>
      </div>
    </div>
  )
}
