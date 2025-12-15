// src/app/profile/page.tsx

import React from 'react';
import LogoutButton from '@/components/profile/LogOutButton';

export default function ProfilePage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Profile</h1>
      <p>Welcome to the  profile page</p>
      <LogoutButton />
    </div>
  );
}
