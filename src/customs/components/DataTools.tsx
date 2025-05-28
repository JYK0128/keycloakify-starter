import { FormCheckbox } from '#/customs/components/FormCheckbox';
import { FormDateRange } from '#/customs/components/FormDateRange';
import { FormInput } from '#/customs/components/FormInput';
import { FormSelectSingle } from '#/customs/components/FormSelectSingle';
import { Button, Form } from '#/shadcn/components/ui';
import { Table } from '@tanstack/react-table';
import { every, isDate } from 'lodash-es';
import { BaseSyntheticEvent, ReactNode, useCallback, useEffect } from 'react';
import { Control, FieldValues, UseFormReturn } from 'react-hook-form';

type DateRange<T> = {
  [K in keyof T]: T[K] extends Date ?
    {
      id: K
      label?: ReactNode
      value: [Optional<Date>, Optional<Date>]
    }
    : never
}[Extract<keyof T, string>];

type Category<T> = {
  [K in keyof T]: T[K] extends Literal<T[K]> ?
    {
      id: K
      label?: ReactNode
      value: Nullable<T[K]>
      items: { label: string, value: Nullable<T[K]> }[]
    }
    : never
}[Extract<keyof T, string>];

type Status<T> = {
  [K in keyof T]: T[K] extends boolean ?
    {
      id: K
      label?: ReactNode
      value: Nullable<T[K]>
    }
    : never
}[Extract<keyof T, string>];

type Search<T> = {
  [K in keyof T]: T[K] extends string ?
    {
      id: Nullable<Extract<{
        [K in keyof T]: T[K] extends Literal<T[K]> ? never : T[K] extends string ? K : never
      }[keyof T], string>>
      value: string
      items: {
        label: string
        value: Nullable<Extract<{
          [K in keyof T]: T[K] extends Literal<T[K]> ? never : T[K] extends string ? K : never
        }[keyof T], string>>
      }[]
    }
    : never
}[Extract<keyof T, string>];

export type ToolOptions<T> = {
  dateRange?: DateRange<T>
  category?: Category<T>
  status?: Status<T>
  search?: Search<T>
};

type Props<T> = {
  table: Table<T>
  form: UseFormReturn<ToolOptions<T>>
};


/** 데이터 필터링 도구 */
export function DataTools<T>({ table, form }: Props<T>) {
  const data = form.watch();

  const handleBlurDateRange = () => {
    const payload = form.getValues();
    if (every(payload.dateRange?.value, isDate)) {
      handleSearch(payload);
    }
  };

  const handleSearch = useCallback((payload: ToolOptions<T>) => {
    const { search, ...filters } = payload;
    table.resetPageIndex();
    table.resetGlobalFilter();
    if (search && search.id !== null) {
      if (search.id !== null) {
        table.setColumnFilters([
          ...Object.values(filters),
          { id: search.id, value: search.value },
        ]);
      }
      else {
        table.setColumnFilters([...Object.values(filters)]);
        table.setGlobalFilter(search.value);
      }
    }
    else {
      table.setColumnFilters([...Object.values(filters)]);
    }
  }, [table]);

  const handleSubmit = (payload: ToolOptions<T>, evt?: BaseSyntheticEvent) => {
    const { submitter } = (evt?.nativeEvent ?? {}) as SubmitEvent;
    if (!(submitter instanceof HTMLButtonElement)) return;

    if (submitter.name === 'search') {
      handleSearch(payload);
    }
  };

  useEffect(() => {
    handleSearch(form.getValues());
  }, [form, handleSearch]);


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-2"
      >
        <div className="justify-self-start flex gap-0.5">
          {data.dateRange && (
            <FormDateRange
              control={form.control as unknown as Control<FieldValues>}
              name="dateRange.value"
              onBlur={handleBlurDateRange}
            />
          )}
        </div>

        <div className="justify-self-end flex gap-0.5">
          {data.category && (
            <FormSelectSingle
              control={form.control as unknown as Control<FieldValues>}
              name="category.value"
              items={data.category.items as never}
            />
          )}
          {data.search && (
            <>
              <FormSelectSingle
                control={form.control as unknown as Control<FieldValues>}
                name="search.id"
                items={data.search.items as never}
              />
              <FormInput
                control={form.control as unknown as Control<FieldValues>}
                name="search.value"
                size="full"
              />
            </>
          )}
          <Button type="submit" name="search">검색</Button>
        </div>
        <div className="col-span-full flex justify-between">
          <div>
            {`총 ${table.getRowCount()} 개`}
            /
            {`선택 ${table.getFilteredSelectedRowModel().rows.length} 개`}
          </div>
          {
            data.status && (
              <FormCheckbox
                optional
                falsely={null}
                control={form.control as unknown as Control<FieldValues>}
                name="status.value"
                label={data.status.label}
              />
            )
          }
        </div>
      </form>
    </Form>
  );
}
