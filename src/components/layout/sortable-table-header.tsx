import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { TableHead } from '../ui/table';

export type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt';

export const SortableTableHeader = ({
  field,
  currentField,
  direction,
  onSort,
  children,
}: {
  field: SortField;
  currentField: string;
  direction: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) => {
  const isActive = currentField === field;
  const currentDirection = isActive ? direction : null;

  return (
    <TableHead
      className="cursor-pointer select-none hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {currentDirection === 'asc' && <ChevronUp className="h-4 w-4" />}
        {currentDirection === 'desc' && <ChevronDown className="h-4 w-4" />}
        {!isActive && <ChevronsUpDown className="h-4 w-4 opacity-50" />}
      </div>
    </TableHead>
  );
};
