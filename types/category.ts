import { Types, Document } from 'mongoose';

// ─── Gradient ───────────────────────────────────────────────────────────────

export interface CategoryGradient {
  from: string;
  via?: string;
  to: string;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  gradient: CategoryGradient;
  iconSet: string[];
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
}
