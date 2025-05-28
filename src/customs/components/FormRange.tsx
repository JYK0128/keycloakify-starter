import { Slider } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

const styles = cva('', {
  variants: {
    size: {
      full: 'size-full',
    },
  },
});

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<Mandatory<UseControllerProps<TFieldValues, TName>, 'control'>, 'defaultValue'>
  & Omit<ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'value' | 'defaultChecked' | 'checked' | 'size'>
  & {
    label?: ReactNode
    labelWidth?: CSSProperties['width']
    orientation?: 'vertical' | 'horizontal'
    onChange?: (e: number[]) => void
    onBlur?: (e: number[]) => void
    showError?: boolean
    dir?: 'ltr' | 'rtl'
  }
  & VariantProps<typeof styles>;

/** 단순 텍스트 입력 */
export function FormRange<T extends FieldValues>(props: Props<T>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false, size,
    dir = 'ltr', min = 0, max = 100, step = 1,
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
            'flex flex-wrap gap-1',
            orientation === 'horizontal'
              ? 'flex-row items-center'
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
              <Slider
                {...inputProps}
                {...field}
                dir={dir}
                min={+min}
                max={+max}
                step={+step}
                onValueChange={(e) => {
                  inputProps.onChange?.(e);
                  field.onChange(e);
                }}
                onValueCommit={(e) => {
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
