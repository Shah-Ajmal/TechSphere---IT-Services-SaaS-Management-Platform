import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  updateProfile,
  changeUserPassword,
  updateNotificationPreferences,
  deleteUserAccount,
} from "@/services/authService";
import { setUser } from "@/redux/slices/authSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReports: false,
  });
  const [notificationLoading, setNotificationLoading] = useState({
    email: false,
    push: false,
    weeklyReports: false,
  });

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Initialize profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
      setNotifications(
        user.notifications || {
          email: true,
          push: true,
          weeklyReports: false,
        }
      );
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });
    setProfileLoading(true);

    try {
      const response = await updateProfile(profileData);

      if (response.success) {
        // Update Redux store
        dispatch(setUser(response.data.user));
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully!",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setProfileMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        // Clear form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async (key) => {
    setNotificationLoading({ ...notificationLoading, [key]: true });

    const newValue = !notifications[key];

    // Optimistically update UI
    setNotifications({ ...notifications, [key]: newValue });

    try {
      const response = await updateNotificationPreferences({
        ...notifications,
        [key]: newValue,
      });

      if (response.success) {
        // Update confirmed
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      // Revert on error
      setNotifications({ ...notifications, [key]: !newValue });
      console.error("Failed to update notifications:", error);
    } finally {
      setNotificationLoading({ ...notificationLoading, [key]: false });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await deleteUserAccount(deletePassword);

      if (response.success) {
        // Clear auth data and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete account"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 container mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {profileMessage.text && (
              <Alert
                variant={
                  profileMessage.type === "error" ? "destructive" : "default"
                }
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{profileMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={profileLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled={profileLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={profileLoading}>
              {profileLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordMessage.text && (
              <Alert
                variant={
                  passwordMessage.type === "error" ? "destructive" : "default"
                }
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{passwordMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                disabled={passwordLoading}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  disabled={passwordLoading}
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={passwordLoading}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationToggle("email")}
              disabled={notificationLoading.email}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={() => handleNotificationToggle("push")}
              disabled={notificationLoading.push}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Get weekly summary reports via email
              </p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={() => handleNotificationToggle("weeklyReports")}
              disabled={notificationLoading.weeklyReports}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="delete-password">
              Enter your password to confirm
            </Label>
            <Input
              id="delete-password"
              type="password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteError("");
              }}
              disabled={deleteLoading}
              placeholder="Your password"
            />
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeletePassword("");
                setDeleteError("");
              }}
              disabled={deleteLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
