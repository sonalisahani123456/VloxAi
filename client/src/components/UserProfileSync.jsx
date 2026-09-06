import React, { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { api } from '../services/api';
import { useBlog } from '../context/BlogContext';

const UserProfileSync = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { showToast, setCurrentUserProfile, userProfile } = useBlog();

  useEffect(() => {
    let isMounted = true;

    const syncUserToBackend = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const token = await getToken().catch(() => null);

        const userData = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.username || 'Creator',
          avatar: user.imageUrl || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        };

        const response = await api.syncUser(userData, token);

        if (response && isMounted) {
          setCurrentUserProfile(response.user || userData);

          // If this was the user's very 1st time registering
          if (response.isNewUser) {
            showToast(`🎉 Welcome to VloxAI, ${userData.name}! Profile registered successfully.`, 'success');
          }
        }
      } catch (err) {
        console.warn('User profile sync notice:', err);
      }
    };

    syncUserToBackend();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
};

export default UserProfileSync;
