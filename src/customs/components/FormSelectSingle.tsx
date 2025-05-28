import { safeParse } from '#/customs/helpers/data-helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { FieldPath, FieldPathValue, FieldValues, UseControllerProps } from 'react-hook-form';

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<Mandatory<UseControllerProps<TFieldValues, TName>, 'control'>, 'defaultValue'>
  & Omit<ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'value' | 'defaultChecked' | 'checked'>
  & {
    label?: ReactNode
    labelWidth?: CSSProperties['width']
    orientation?: 'vertical' | 'horizontal'
    showError?: boolean
  }
  & {
    items: {
      label: ReactNode
      value: Nullable<TName extends keyof TFieldValues
        ? FieldPathValue<TFieldValues, TName>
        : never
      >
    }[]
  };


/** 콤보박스(단일) */
export function FormSelectSingle<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: Props<TFieldValues, TName>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false,
    items,
  } = props;

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-wrap space-y-0',
            orientation === 'horizontal'
              ? 'flex-row'
              : 'flex-col',
          )}
        >
          {label && (
            <div
              style={{ width: labelWidth }}
              className="shrink-0 font-bold"
            >
              <FormLabel className="flex justify-between">
                {label}
                {required && (
                  <sup className="text-red-600"> *</sup>
                )}
              </FormLabel>
            </div>
          )}
          <div className="flex-1">
            <Select
              value={`${field.value}`}
              onValueChange={(v) => field.onChange(safeParse(v))}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map(({ value, label }) => (
                  <SelectItem key={`${value}`} value={`${value}`}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError && (
              <FormMessage />
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
