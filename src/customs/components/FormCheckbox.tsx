import { Checkbox } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

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
    optional?: boolean
    falsely?: Nullish<false>
  };


/** 체크박스(단일) */
export function FormCheckbox<T extends FieldValues>(props: Props<T>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false, optional, falsely,
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
              ? 'flex-row gap-2'
              : 'flex-col',
          )}
        >
          <div className="shrink-0 flex items-center">
            <FormControl>
              <Checkbox
                {...field}
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v || ((required || optional) ? falsely : false))}
              />
            </FormControl>
          </div>
          <div className="shrink-0 flex items-center">
            {label && (
              <FormLabel
                style={{ width: labelWidth }}
                className="font-bold mb-0"
              >
                {label}
                {required && (
                  <sup className="text-red-600"> *</sup>
                )}
              </FormLabel>
            )}
            {showError && <FormMessage />}
          </div>
        </FormItem>
      )}
    />
  );
}
