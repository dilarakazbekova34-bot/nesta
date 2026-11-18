// src/hooks/useNativeCapacitor.ts
// Capacitor native plugin wrappers with PWA fallbacks

import { useState, useCallback } from 'react';

// Detect if running in Capacitor native context
const isNative = () => {
  return typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor.isNativePlatform();
};

// --- HAPTICS ---
export const useHaptics = () => {
  const vibrate = useCallback(async (style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'medium') => {
    if (isNative()) {
      try {
        // @ts-ignore
        const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');
        if (style === 'success' || style === 'warning' || style === 'error') {
          const typeMap = {
            success: NotificationType.Success,
            warning: NotificationType.Warning,
            error: NotificationType.Error,
          };
          await Haptics.notification({ type: typeMap[style] });
        } else {
          const styleMap = {
            light: ImpactStyle.Light,
            medium: ImpactStyle.Medium,
            heavy: ImpactStyle.Heavy,
          };
          await Haptics.impact({ style: styleMap[style as 'light' | 'medium' | 'heavy'] });
        }
      } catch (e) {
        console.warn('Haptics not available', e);
      }
    } else {
      // PWA fallback: navigator.vibrate
      if ('vibrate' in navigator) {
        const durationMap = { light: 30, medium: 60, heavy: 100, success: 50, warning: 80, error: 150 };
        navigator.vibrate(durationMap[style] || 60);
      }
    }
  }, []);

  return { vibrate };
};

// --- CAMERA ---
export interface CameraResult {
  dataUrl: string | null;
  error?: string;
}

export const useCamera = () => {
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = useCallback(async (): Promise<CameraResult> => {
    setIsLoading(true);
    try {
      if (isNative()) {
        // @ts-ignore
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });
        return { dataUrl: image.dataUrl || null };
      } else {
        // PWA fallback: input[type=file] with camera capture
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) { resolve({ dataUrl: null }); return; }
            const reader = new FileReader();
            reader.onload = () => resolve({ dataUrl: reader.result as string });
            reader.onerror = () => resolve({ dataUrl: null, error: 'Ошибка чтения файла' });
            reader.readAsDataURL(file);
          };
          input.oncancel = () => resolve({ dataUrl: null });
          input.click();
        });
      }
    } catch (error: any) {
      return { dataUrl: null, error: error?.message || 'Ошибка камеры' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickFromGallery = useCallback(async (): Promise<CameraResult> => {
    setIsLoading(true);
    try {
      if (isNative()) {
        // @ts-ignore
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos,
        });
        return { dataUrl: image.dataUrl || null };
      } else {
        // PWA fallback: standard file picker
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) { resolve({ dataUrl: null }); return; }
            const reader = new FileReader();
            reader.onload = () => resolve({ dataUrl: reader.result as string });
            reader.onerror = () => resolve({ dataUrl: null, error: 'Ошибка чтения файла' });
            reader.readAsDataURL(file);
          };
          input.oncancel = () => resolve({ dataUrl: null });
          input.click();
        });
      }
    } catch (error: any) {
      return { dataUrl: null, error: error?.message || 'Ошибка выбора фото' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { takePhoto, pickFromGallery, isLoading };
};

// --- SHARE ---
export const useShare = () => {
  const share = useCallback(async (options: { title: string; text: string; url?: string }) => {
    if (isNative()) {
      try {
        // @ts-ignore
        const { Share } = await import('@capacitor/share');
        await Share.share(options);
      } catch (e) {
        console.warn('Share not available', e);
      }
    } else if (navigator.share) {
      try {
        await navigator.share(options);
      } catch (e) {
        // User cancelled or not supported
        console.warn('Web Share API cancelled or failed', e);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(options.url || options.text);
      } catch (e) {
        console.warn('Clipboard not available', e);
      }
    }
  }, []);

  return { share };
};

// --- LOCAL NOTIFICATIONS ---
export const useLocalNotifications = () => {
  const scheduleNotification = useCallback(async (options: {
    title: string;
    body: string;
    id: number;
    scheduleAt: Date;
  }) => {
    if (isNative()) {
      try {
        // @ts-ignore
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const perms = await LocalNotifications.requestPermissions();
        if (perms.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              title: options.title,
              body: options.body,
              id: options.id,
              schedule: { at: options.scheduleAt },
              sound: undefined,
              attachments: undefined,
              actionTypeId: '',
              extra: null,
            }],
          });
        }
      } catch (e) {
        console.warn('Local notifications not available', e);
      }
    } else {
      // PWA fallback: Web Notifications API
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          const delay = options.scheduleAt.getTime() - Date.now();
          if (delay > 0) {
            setTimeout(() => {
              new Notification(options.title, { body: options.body });
            }, delay);
          }
        }
      }
    }
  }, []);

  return { scheduleNotification };
};
