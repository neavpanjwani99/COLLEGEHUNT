import { colleges } from "@/data/colleges";
import CollegesClient from "./client";

export default function CollegesPage() {
  return <CollegesClient colleges={colleges} />;
}
