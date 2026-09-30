import { z } from 'zod';

// Format: dept_year_batch_group (e.g. CSE_2024_B1_G3)
export const folderNameRegex = /^[A-Za-z]+_\d{4}_[A-Za-z0-9]+_[A-Za-z0-9]+$/;

export const createFolderSchema = z.object({
  dept: z.string().min(1, 'Department is required').regex(/^[A-Za-z]+$/, 'Department must contain only letters'),
  year: z.number().int().min(1).max(4),
  batch: z.string().min(1, 'Batch is required').regex(/^[A-Za-z0-9]+$/, 'Batch must contain only alphanumeric characters'),
  groupName: z.string().min(1, 'Group is required').regex(/^[A-Za-z0-9]+$/, 'Group must contain only alphanumeric characters'),
});

export const createFileSchema = z.object({
  heading: z.string().min(1, 'Heading is required').max(100, 'Heading too long'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().max(100000, 'File content too large (max 100KB)'),
});

export const updateFileSchema = z.object({
  heading: z.string().min(1).max(100).optional(),
  content: z.string().max(100000).optional(),
});
