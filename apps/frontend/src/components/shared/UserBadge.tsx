import React from 'react';

interface UserBadgeProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
}

export default function UserBadge({ user, className }: UserBadgeProps) {
  if (!user) {
    return <div className={className}>No user</div>;
  }

  return (
    <div className={className}>
      <span>{user.name}</span>
    </div>
  );
}