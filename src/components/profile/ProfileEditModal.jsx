/* src/components/profile/ProfileEditModal.jsx
   Modal for updating name, password, and avatar via PUT /api/profile.
   Sends JSON when no image is present, multipart when an image is.
*/

import { useEffect, useState } from 'react';
import * as profileApi from '../../api/profile';
import { toFieldErrors } from '../../utils/formErrors';
import { resolveAvatar } from '../../utils/avatar';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB to match backend validation

const ProfileEditModal = ({ open, onClose, profile, onUpdated }) => {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(profile?.name || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setImage(null);
    setImagePreview(null);
    setErrors({});
    setSubmitError('');
    setSuccessMessage('');
  }, [open, profile]);

  if (!open) return null;

  const avatarSrc = imagePreview || resolveAvatar(profile?.image);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: 'Image must be 5 MB or smaller.' }));
      return;
    }
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Image must be PNG, JPEG, or WebP.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: undefined }));
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});

    const localErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      localErrors.name = 'Name must be at least 2 characters.';
    }
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        localErrors.current_password = 'Enter your current password to change it.';
      }
      if (!newPassword) {
        localErrors.new_password = 'New password is required.';
      } else if (newPassword.length < 8) {
        localErrors.new_password = 'New password must be at least 8 characters.';
      }
      if (newPassword !== confirmPassword) {
        localErrors.confirm_password = 'Passwords do not match.';
      }
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {};
      if (name.trim() && name.trim() !== profile?.name) payload.name = name.trim();
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
        payload.confirmPassword = confirmPassword;
      }
      if (image) payload.image = image;

      // If nothing changed, don't bother hitting the API.
      if (Object.keys(payload).length === 0) {
        onClose?.();
        return;
      }

      const res = await profileApi.updateProfile(payload);
      onUpdated?.(res.data);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => onClose?.(), 700);
    } catch (err) {
      const fieldErrors = toFieldErrors(err.errors);
      setErrors(fieldErrors);
      setSubmitError(err.message || 'Could not update your profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md surface-card rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="eyebrow mb-1">Edit profile</p>
            <h2 id="profile-edit-title" className="font-display text-xl font-semibold text-text-primary">
              Update your details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-tertiary hover:text-text-primary p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm"
          >
            {submitError}
          </div>
        )}
        {successMessage && (
          <div
            role="status"
            className="mb-5 px-4 py-3 rounded-lg bg-tertiary/10 border border-tertiary/30 text-tertiary text-sm"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full p-[2px] flex-none"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-elevated flex items-center justify-center">
                {avatarSrc ? (
                  <ImageWithSkeleton src={avatarSrc} alt="Avatar preview" className="w-full h-full" />
                ) : (
                  <span className="material-symbols-outlined text-2xl text-text-tertiary">person</span>
                )}
              </div>
            </div>
            <label className="inline-flex items-center gap-2 rounded-full border border-border-strong text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs font-medium uppercase tracking-wide px-4 py-2 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[16px]">image</span>
              Change photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.image && (
            <p className="text-accent text-xs -mt-2 pl-1">{errors.image}</p>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Display name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.name
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
            />
            {errors.name && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-current" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Current password
            </label>
            <input
              id="edit-current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Leave blank to keep your password"
              aria-invalid={!!errors.current_password}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.current_password
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
            />
            {errors.current_password && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.current_password}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-new" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              New password
            </label>
            <input
              id="edit-new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-invalid={!!errors.new_password}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.new_password
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
            />
            {errors.new_password && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.new_password}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-confirm" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Confirm new password
            </label>
            <input
              id="edit-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!errors.confirm_password}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.confirm_password
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
            />
            {errors.confirm_password && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.confirm_password}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-gradient-ghost btn-gradient-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-gradient btn-gradient-sm">
              {submitting && <span className="loading loading-spinner loading-xs" />}
              {submitting ? 'Saving' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;