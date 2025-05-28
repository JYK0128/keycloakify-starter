import { DataTableContextMenu } from '#/customs/components/DataTableContextMenu';
import { Separator, TableHead } from '#/shadcn/components/ui';
import { cn } from '#/shadcn/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flexRender, Header, Table as ReactTable } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { CSSProperties, useMemo } from 'react';

type Props<T> = {
  table: ReactTable<T>
  header: Header<T, unknown>
};


/** 테이블 head */
export function DataTableHead<T>(props: Props<T>) {
  const { table, header } = props;
  const isPinned = header.column.getIsPinned();
  const isLeftLastPin = header.column.getIsLastColumn(isPinned);
  const isRightFirstPin = header.column.getIsFirstColumn(isPinned);

  const {
    isDragging, transform,
    setNodeRef, attributes, listeners,
  } = useSortable({ id: header.column.id });


  const pinningStyles = useMemo(() => getColumnPinningStyles({
    isPinned,
    isLeftLastPin,
    isRightFirstPin,
  }), [isLeftLastPin, isPinned, isRightFirstPin]);
  const sortStyles = useMemo(() => getColumnSortStyles(isDragging), [isDragging]);
  const commonStyles = useMemo(() => cn(
    'border-border border-solid border-b',
  ), []);

  const dynamicStyles: CSSProperties = {
    width: header.column.getSize(),
    left: isPinned ? header.column.getStart('left') : undefined,
    right: isPinned ? header.column.getAfter('right') : undefined,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <TableHead
      ref={setNodeRef}
      key={header.id}
      colSpan={header.colSpan}
      className={cn(
        commonStyles,
        pinningStyles,
        sortStyles,
      )}
      style={dynamicStyles}
    >
      {
        !header.isPlaceholder
        && (
          <div className="group size-full flex items-center gap-x-1">
            {/* 테이블 헤더 - 제목 */}
            <div
              className="flex-1"
              {...attributes}
              {...listeners}
            >
              {
                flexRender(header.column.columnDef.header, header.getContext())
              }
            </div>
            {/* 테이블 헤더 - 아이콘 */}
            {(header.column.getCanSort()
              || header.column.getCanPin()
              || header.column.getCanHide())
            && (
              <DataTableContextMenu {...{ table, header }} />
            )}

            {/* 테이블 헤더 - 사이징 */}
            <Separator
              orientation="vertical"
              className={cn(
                header.column.getCanResize() ? 'cursor-col-resize group-hover:w-1' : '',
              )}
              style={{ right: 0 }}
              onDoubleClick={header.column.resetSize}
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
            />
          </div>
        )
      }
    </TableHead>
  );
}

/** Column Pinning Style */
type pinningParams = {
  isPinned: 'left' | 'right' | false
  isLeftLastPin: boolean
  isRightFirstPin: boolean
};
function getColumnPinningStyles(params: pinningParams) {
  const { isPinned, isLeftLastPin, isRightFirstPin } = params;
  const styles = cva('', {
    variants: {
      isPinned: {
        left: cn(
          'bg-background',
          'sticky z-10',
          isLeftLastPin ? 'shadow-[-4px_0_4px_-4px_gray_inset]' : undefined,
        ),
        right: cn(
          'bg-background',
          'sticky z-10',
          isRightFirstPin ? 'shadow-[4px_0_4px_-4px_gray_inset]' : undefined,
        ),
        false: '',
      },
    },
  });

  return styles({ isPinned });
};

/** Column Sort Styles */
function getColumnSortStyles(isDragging: boolean) {
  const styles = cva('', {
    variants: {
      isDragging: {
        true: 'transition-transform bg-background',
        false: '',
      },
    },
  });

  return styles({ isDragging });
}
