/**
 * Tests for lib/cloudinary.ts
 *
 * We mock the cloudinary SDK so tests run without real credentials.
 */

// ── Mock cloudinary before importing our module ────────────────────────────

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
    url: jest.fn(),
  },
}));

import { v2 as cloudinaryMock } from 'cloudinary';
import {
  uploadImage,
  deleteImage,
  buildImageUrl,
  CLOUDINARY_FOLDERS,
  TRANSFORMATIONS,
} from '@/lib/cloudinary';

const mockUpload = cloudinaryMock.uploader.upload as jest.Mock;
const mockDestroy = cloudinaryMock.uploader.destroy as jest.Mock;
const mockUrl = cloudinaryMock.url as jest.Mock;

// ── Helpers ────────────────────────────────────────────────────────────────

const fakeUploadResult = {
  public_id: 'liveshopmarket/profiles/abc123',
  secure_url: 'https://res.cloudinary.com/demo/image/upload/liveshopmarket/profiles/abc123.webp',
  width: 256,
  height: 256,
  format: 'webp',
  bytes: 15000,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ── uploadImage ────────────────────────────────────────────────────────────

describe('uploadImage', () => {
  it('uploads a base64 image and returns normalised result', async () => {
    mockUpload.mockResolvedValue(fakeUploadResult);

    // Small base64 string (well under any limit)
    const file = 'data:image/png;base64,iVBORw0KGgoAAAANSUh';
    const result = await uploadImage({
      file,
      folder: CLOUDINARY_FOLDERS.profileImages,
      transformation: TRANSFORMATIONS.profileAvatar,
    });

    expect(mockUpload).toHaveBeenCalledTimes(1);
    expect(mockUpload).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        folder: 'liveshopmarket/profiles',
        overwrite: true,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      })
    );
    expect(result).toEqual({
      public_id: fakeUploadResult.public_id,
      secure_url: fakeUploadResult.secure_url,
      width: 256,
      height: 256,
      format: 'webp',
      bytes: 15000,
    });
  });

  it('uploads with a custom publicId', async () => {
    mockUpload.mockResolvedValue(fakeUploadResult);

    await uploadImage({
      file: 'https://example.com/image.jpg',
      folder: CLOUDINARY_FOLDERS.sessionThumbnails,
      publicId: 'my-session-thumb',
    });

    expect(mockUpload).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      expect.objectContaining({
        public_id: 'my-session-thumb',
        folder: 'liveshopmarket/sessions',
      })
    );
  });

  it('rejects oversized base64 files before calling API', async () => {
    // Create a base64 string that represents ~6 MB
    const bigBase64 = 'data:image/png;base64,' + 'A'.repeat(8_000_000);

    await expect(
      uploadImage({
        file: bigBase64,
        folder: CLOUDINARY_FOLDERS.profileImages,
        maxBytes: 5 * 1024 * 1024,
      })
    ).rejects.toThrow(/exceeds/i);

    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('propagates Cloudinary SDK errors', async () => {
    mockUpload.mockRejectedValue(new Error('Invalid image file'));

    await expect(
      uploadImage({ file: 'data:image/png;base64,bad', folder: CLOUDINARY_FOLDERS.profileImages })
    ).rejects.toThrow('Invalid image file');
  });
});

// ── deleteImage ────────────────────────────────────────────────────────────

describe('deleteImage', () => {
  it('calls cloudinary.uploader.destroy and returns result', async () => {
    mockDestroy.mockResolvedValue({ result: 'ok' });

    const res = await deleteImage('liveshopmarket/profiles/abc123');

    expect(mockDestroy).toHaveBeenCalledWith('liveshopmarket/profiles/abc123');
    expect(res).toEqual({ result: 'ok' });
  });
});

// ── buildImageUrl ──────────────────────────────────────────────────────────

describe('buildImageUrl', () => {
  it('delegates to cloudinary.url with secure: true', () => {
    mockUrl.mockReturnValue('https://res.cloudinary.com/demo/image/upload/w_256/abc.webp');

    const url = buildImageUrl('abc', { width: 256, format: 'webp' });

    expect(mockUrl).toHaveBeenCalledWith('abc', {
      secure: true,
      width: 256,
      format: 'webp',
    });
    expect(url).toContain('cloudinary.com');
  });
});

// ── Constants ──────────────────────────────────────────────────────────────

describe('constants', () => {
  it('exposes expected folder paths', () => {
    expect(CLOUDINARY_FOLDERS.profileImages).toBe('liveshopmarket/profiles');
    expect(CLOUDINARY_FOLDERS.sessionThumbnails).toBe('liveshopmarket/sessions');
    expect(CLOUDINARY_FOLDERS.brandBanners).toBe('liveshopmarket/banners');
  });

  it('has transformation presets with expected dimensions', () => {
    expect(TRANSFORMATIONS.profileAvatar.width).toBe(256);
    expect(TRANSFORMATIONS.sessionThumbnail.width).toBe(640);
    expect(TRANSFORMATIONS.brandBanner.width).toBe(1200);
  });
});
