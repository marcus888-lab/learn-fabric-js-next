import React from "react";
import { Trash2 } from "lucide-react";

const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return <Trash2 {...props} />;
};

export default DeleteIcon;
