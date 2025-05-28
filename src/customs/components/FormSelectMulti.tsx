import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { Check, ChevronsUpDown, RotateCcw, Search } from 'lucide-react';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode, useEffect, useState } from 'react';
import { FieldPath, FieldPathValue, FieldValues, UseControllerProps, useWatch } from 'react-hook-form';

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<Mandatory<UseControllerProps<TFieldValues, TName>, 'control'>, 'defaultValue'>
  & Omit<ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'value' | 'defaultChecked' | 'checked' | 'placeholder'>
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
  }
  & {
    min?: number
    max?: number
  };


/** 콤보박스(다중) */
export function FormSelectMulti<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: Props<TFieldValues, TName>) {
  const {
    name, control, disabled,
    label, labelWidth = 'auto', orientation = 'horizontal',
    showError = false, required = false,
    items, min, max,
  } = props;

  const {
    placeholder = 'search...',
    notFound = 'Not found.',
    reset = 'Reset',
    filter = 'Filter',
  } = {};

  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Props<TFieldValues>['items'][number]['value'][]>([]);
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    size="default"
                    role="combobox"
                    className={cn(
                      'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
                      !field.value.length && 'text-muted-foreground',
                    )}
                  >
                    {
                      field.value.length
                        ? items.find((item) => field.value.includes(item.value))?.label
                        : `${placeholder}`
                    }
                    {field.value.length > 1 ? ` 외 ${field.value.length - 1} 건` : ''}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>{notFound}</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          key={`${item.value}`}
                          value={`${item.label}`}
                          onSelect={() => {
                            setSelection((selection) => {
                              if (selection.includes(item.value)) {
                                return (!min || selection.length > min)
                                  ? selection.filter((v) => v !== item.value)
                                  : selection;
                              }
                              else {
                                return (!max || selection.length < max)
                                  ? [...selection, item.value]
                                  : selection;
                              }
                            });
                          }}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              selection.includes(item.value)
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      className="font-bold"
                      onClick={() => {
                        setSelection([]);
                        field.onChange([]);
                      }}
                    >
                      {reset}
                      <RotateCcw />
                    </Button>
                    <Button
                      variant="default"
                      className="font-bold"
                      disabled={
                        !!(min && +min > selection.length)
                        && !!(max && +max < selection.length)
                      }
                      onClick={() => {
                        field.onChange(selection);
                        setOpen(false);
                      }}
                    >
                      {filter}
                      <Search />
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            {showError && (
              <FormMessage />
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
