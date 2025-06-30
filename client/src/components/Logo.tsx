import { Building } from "lucide-react";

export default function Logo() {
  return (
    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
      <Building className="w-6 h-6 text-white" />
    </div>
  );
}
