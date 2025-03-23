
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileService, type Profile } from '@/services/ProfileService';
import { ArrowLeft, Camera, Check, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const profile = await ProfileService.getProfile(user.id);
        if (profile) {
          setProfile(profile);
          setUsername(profile.username || '');
          setBio(profile.bio || '');
          setAvatarUrl(profile.avatar_url || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        username,
        bio,
        avatar_url: avatarUrl,
      });
      
      setIsEditing(false);
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          username,
          bio,
          avatar_url: avatarUrl,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/chat" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft size={16} />
          Back to Chat
        </Link>
        
        <Card className="glass-panel border-none">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>View and edit your profile information</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-full"
                    onClick={() => {
                      const newAvatarUrl = prompt("Enter avatar URL", avatarUrl || "");
                      if (newAvatarUrl) setAvatarUrl(newAvatarUrl);
                    }}
                  >
                    <Camera size={16} />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <Label htmlFor="username">Username</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing || isSaving}
                    />
                  ) : (
                    <p className="text-lg font-medium">{username}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={bio || ''}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {bio || 'No bio provided'}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
