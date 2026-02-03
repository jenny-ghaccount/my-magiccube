'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface ImageUploadProps {
  onImagesUpload?: (files: File[]) => void;
}

interface PhotoSlot {
  id: 'corner1' | 'corner2';
  label: string;
  description: string;
  previewUrl: string | null;
  fileName: string | null;
}

export default function ImageUpload({ onImagesUpload }: ImageUploadProps) {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    {
      id: 'corner1',
      label: 'Corner 1: U + F + R',
      description: 'Top, Front & Right faces visible',
      previewUrl: null,
      fileName: null,
    },
    {
      id: 'corner2',
      label: 'Corner 2: D + B + L',
      description: 'Bottom, Back & Left faces visible',
      previewUrl: null,
      fileName: null,
    },
  ]);

  const fileInputRefs = {
    corner1: useRef<HTMLInputElement>(null),
    corner2: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (slotId: 'corner1' | 'corner2', file: File) => {
    const url = URL.createObjectURL(file);
    
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === slotId
          ? { ...photo, previewUrl: url, fileName: file.name }
          : photo
      )
    );
  };

  const handleInputChange = (slotId: 'corner1' | 'corner2') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(slotId, file);
    }
  };

  const handleDrop = (slotId: 'corner1' | 'corner2') => (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(slotId, file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClear = (slotId: 'corner1' | 'corner2') => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === slotId) {
          if (photo.previewUrl) {
            URL.revokeObjectURL(photo.previewUrl);
          }
          return { ...photo, previewUrl: null, fileName: null };
        }
        return photo;
      })
    );
    const inputRef = fileInputRefs[slotId];
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = (slotId: 'corner1' | 'corner2') => {
    fileInputRefs[slotId].current?.click();
  };

  const hasAnyPhoto = photos.some((p) => p.previewUrl);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
      >
        📷 Upload Photos of Your Cube (Optional)
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, textAlign: 'center' }}
      >
        Take 2 corner photos showing all 6 faces. Use them as reference while entering colors below.
      </Typography>

      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} key={photo.id}>
            <input
              ref={fileInputRefs[photo.id]}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange(photo.id)}
              style={{ display: 'none' }}
              aria-label={`Upload ${photo.label}`}
            />

            {!photo.previewUrl ? (
              <Paper
                onClick={() => handleClick(photo.id)}
                onDrop={handleDrop(photo.id)}
                onDragOver={handleDragOver}
                sx={{
                  p: 3,
                  border: '3px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'rgba(227, 0, 11, 0.05)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minHeight: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(227, 0, 11, 0.1)',
                    borderColor: 'primary.dark',
                  },
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 36, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {photo.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {photo.description}
                </Typography>
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 2,
                  border: '3px solid',
                  borderColor: 'success.main',
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={() => handleClear(photo.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'error.dark' },
                    zIndex: 1,
                  }}
                  size="small"
                  aria-label="Remove image"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Box
                  component="img"
                  src={photo.previewUrl}
                  alt={photo.label}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'success.main',
                  }}
                >
                  ✓ {photo.label}
                </Typography>
              </Paper>
            )}
          </Grid>
        ))}
      </Grid>

      {hasAnyPhoto && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ textAlign: 'center', mt: 2, fontWeight: 600 }}
        >
          ✓ Now use your photos as reference to enter the colors below!
        </Typography>
      )}
    </Box>
  );
}
