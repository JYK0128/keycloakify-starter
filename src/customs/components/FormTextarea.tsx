import { Textarea } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<Mandatory<UseControllerProps<TFieldValues, TName>, 'control'>, 'defaultValue'>
  & Omit<ComponentPropsWithoutRef<'textarea'>, 'defaultValue' | 'value' | 'defaultChecked' | 'checked'>
  & {
    label?: ReactNode
    labelWidth?: CSSProperties['width']
    orientation?: 'vertical' | 'horizontal'
    showError?: boolean
  }
  & VariantProps<typeof styles>;

const styles = cva('', {
  variants: {
    size: {
      full: 'size-full',
    },
  },
});


/** 텍스트 입력 */
export function FormTextarea<T extends FieldValues>(props: Props<T>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false, size,
    ...inputProps
  } = props;

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={cn(
            styles({ size }),
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
            <FormControl>
              <Textarea
                {...inputProps}
                {...field}
                onChange={(e) => {
                  inputProps.onChange?.(e);
                  field.onChange(e);
                }}
                onBlur={(e) => {
                  inputProps.onBlur?.(e);
                  field.onBlur();
                }}
              />
            </FormControl>
            {showError && (
              <FormMessage />
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
