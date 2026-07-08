import { Schema, model, models, Document } from "mongoose";

export interface ISignUp extends Document {
  eventId: Schema.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  adultsComing?: number;
  childrenComing?: number;
  addons?: Schema.Types.ObjectId[];
  createdAt: Date;
}

const SignUpSchema = new Schema<ISignUp>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  adultsComing: {
    type: Number,
  },
  childrenComing: {
    type: Number,
  },
  addons: {
    type: [{ type: Schema.Types.ObjectId, ref: "AddOn" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SignUp = models.SignUp || model<ISignUp>("SignUp", SignUpSchema);

export default SignUp;
