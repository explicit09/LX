import { useState } from "react";
import { Material } from "@/lib/types";
import { FileText, Mic, FileDown, Eye, Trash2, MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MaterialItemProps {
  material: Material;
  onView: (material: Material) => void;
  onDelete: (material: Material) => void;
}

const MaterialItem = ({ material, onView, onDelete }: MaterialItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="bg-primary/10 p-2 rounded">
          {material.type === "pdf" ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <Mic className="h-5 w-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{material.name}</h4>
          <p className="text-sm text-gray-500">
            Uploaded {formatDate(material.uploadDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => onView(material)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(material)}>
              <Eye className="h-4 w-4 mr-2" />
              View Material
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(material)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Material
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MaterialItem;