import { safeParse } from '#/customs/helpers';
import { RadioGroup, RadioGroupItem } from '#/shadcn/components/ui';
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
      value: TName extends keyof TFieldValues
        ? FieldPathValue<TFieldValues, TName>
        : never
    }[]
  };


/** 라디오(그룹) */
export function FormRadioGroup<
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
            'flex flex-wrap !space-y-0',
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
              <RadioGroup
                value={`${field.value}`}
                onValueChange={(v) => field.onChange(safeParse(v))}
                className={cn(
                  'flex flex-wrap gap-2',
                  orientation === 'horizontal'
                    ? 'flex-row items-center'
                    : 'flex-col',
                )}
              >
                {
                  items.map((item) => (
                    <FormItem
                      key={`${item.value}`}
                      className={cn(
                        'flex flex-wrap space-y-0 gap-2',
                      )}
                    >
                      <FormControl>
                        <RadioGroupItem value={`${item.value}`} />
                      </FormControl>
                      <FormLabel>
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))
                }
              </RadioGroup>
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
