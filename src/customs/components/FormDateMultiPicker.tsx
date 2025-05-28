import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { CalendarIcon, RotateCcw } from 'lucide-react';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode, useEffect, useState } from 'react';
import { FieldPath, FieldValues, UseControllerProps, useWatch } from 'react-hook-form';

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<Mandatory<UseControllerProps<TFieldValues, TName>, 'control'>, 'defaultValue'>
  & Omit<ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'value'>
  & {
    label?: ReactNode
    labelWidth?: CSSProperties['width']
    orientation?: 'vertical' | 'horizontal'
    showError?: boolean
  }
  & {
    min?: number
    max?: number
    fromDate?: Date
    toDate?: Date
    dateFormat?: string
  };


/** 날짜 선택(복수)  */
export function FormDateMultiPicker<T extends FieldValues>(props: Props<T>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false,
    dateFormat = 'yyyy-MM-dd', fromDate, toDate,
    min, max, onBlur,
  } = props;

  const {
    reset = 'Reset',
  } = {};

  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Date[]>([]);
  const value = useWatch({ name });

  useEffect(() => {
    setSelection(value);
  }, [value]);

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <FormItem>
          <div
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
              <Popover open={open} onOpenChange={setOpen}>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-52">
                      <CalendarIcon />
                      <span className="flex-1">
                        {selection[0] && `${format(sortBy(selection)[0], dateFormat)}`}
                        {selection[1] ? ` 외 ${selection.length - 1} 건` : ''}
                      </span>
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent
                  className="w-auto"
                  align="start"
                  onCloseAutoFocus={(evt) => {
                    if ((!min || +min <= selection.length)
                      && (!max || selection.length <= +max)) {
                      field.onChange(selection);
                    }
                    else {
                      setSelection([]);
                      field.onChange([]);
                    }
                    onBlur?.(evt as never);
                  }}
                >
                  <div className="flex">
                    {/* 날짜 */}
                    <Calendar
                      mode="multiple"
                      selected={selection}
                      onSelect={
                        (dt) => setSelection(dt ?? [])
                      }
                      min={(min && +min) || undefined}
                      max={(max && +max) || undefined}
                      fromDate={fromDate}
                      toDate={toDate}
                    />
                  </div>
                  <div className="flex justify-start">
                    <Button
                      variant="ghost"
                      className="font-bold"
                      onClick={() => {
                        setSelection([]);
                        field.onChange([]);
                      }}
                    >
                      <RotateCcw />
                      {reset}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              {showError && (
                <FormMessage />
              )}
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
