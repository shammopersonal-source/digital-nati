import { notFound } from "next/navigation";

// Any address we don't know shows the friendly "not found" page.
export default function CatchAll() {
  notFound();
}
