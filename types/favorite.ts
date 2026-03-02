import { Types, Document } from 'mongoose';

// ─── Favorite ───────────────────────────────────────────────────────────────

export interface IFavorite {
  userId: Types.ObjectId;
  creatorId: Types.ObjectId;
  createdAt: Date;
}

export interface IFavoriteDocument extends IFavorite, Document {
  _id: Types.ObjectId;
}
