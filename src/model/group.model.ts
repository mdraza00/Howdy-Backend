import mongoose, { model, Schema } from "mongoose";

interface IGroup {
  members: mongoose.Schema.Types.ObjectId[];
  groupName: string;
  groupProfilePhoto: string;
}

const Group_Schema = new Schema<IGroup>({
  members: [mongoose.Schema.Types.ObjectId],
  groupName: { type: String, default: "group name" },
  groupProfilePhoto: { type: String },
});

const Group_Model = model<IGroup>("Group", Group_Schema);
export default Group_Model;
