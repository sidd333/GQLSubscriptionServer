import { Schema, model, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId; 
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Post = model<IPost>('Post', postSchema);
export default Post;
