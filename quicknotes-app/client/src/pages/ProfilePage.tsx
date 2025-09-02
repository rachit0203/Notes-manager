import { UserProfile } from '@clerk/clerk-react';

const ProfilePage = () => {
  return (
    <div className="flex justify-center py-12">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
};

export default ProfilePage;