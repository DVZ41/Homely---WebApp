import { Member } from '../App';

type UserAvatarProps = {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export function UserAvatar({ member, size = 'md', onClick }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white shadow-sm hover:scale-110 hover:shadow-lg transition-all duration-200`}
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.avatar}
    </button>
  );
}
