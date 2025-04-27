import { FileText, Mic, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Material } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaterialItemProps {
  material: Material;
  onView: (material: Material) => void;
  onDelete: (material: Material) => void;
}

const MaterialItem = ({ material, onView, onDelete }: MaterialItemProps) => {
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "EEEE MM/dd/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 file-card">
      <div className="flex items-center">
        <div className={`rounded-md p-2 mr-3 ${
          material.type === "pdf" ? "bg-primary/10" : "bg-indigo-100"
        }`}>
          {material.type === "pdf" ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <Mic className="h-5 w-5 text-indigo-600" />
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900">{material.name}</h4>
          <p className="text-xs text-gray-500">
            Added on {formatDate(material.uploadDate)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(material)}>
              View Material
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(material)}
              className="text-red-600 focus:text-red-600"
            >
              Delete Material
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MaterialItem;
