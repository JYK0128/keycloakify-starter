import { ProgressCircle } from '#/customs/components/ProgressCircle';
import { fileStreamLoader } from '#/customs/helpers';
import { useCallbackRef } from '#/customs/hooks';
import { Button } from '#/shadcn/components/ui';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/shadcn/components/ui/form';
import { cn } from '#/shadcn/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, forwardRef, ReactNode, useEffect, useState, useTransition } from 'react';
import { FieldPath, FieldValues, UseControllerProps, useWatch } from 'react-hook-form';

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
  & Omit<ComponentPropsWithoutRef<'p'>, 'defaultValue' | 'value' | 'defaultChecked' | 'checked'>
  & {
    label?: ReactNode
    labelWidth?: CSSProperties['width']
    orientation?: 'vertical' | 'horizontal'
    showError?: boolean
  }
  & {
    required?: boolean
  }
  & VariantProps<typeof styles>;


/** 리치 텍스트 입력 */
export const FormRicharea = forwardRef(
  function FormRichareaInner<T extends FieldValues>(
    props: Props<T>,
    ref: ForwardedRef<HTMLParagraphElement>,
  ) {
    const {
      name, control, disabled,
      label, labelWidth = 'auto', orientation = 'horizontal',
      showError = false, required = false, size,
      ...inputProps
    } = props;

    const [areaRef, setAreaRef] = useCallbackRef(ref);
    const innerHTML = useWatch({ name });

    const [, startTransition] = useTransition();

    useEffect(() => {
      startTransition(() => {
        if (!areaRef.current) return;
        if (areaRef.current.innerHTML !== innerHTML) {
          areaRef.current.innerHTML = innerHTML;
        }
      });
    }, [areaRef, innerHTML]);

    const [fileList, setFileList] = useState<Record<string, { file: File, pct: number }>>({});
    const addFiles = (files: (File | null)[]) => {
      const fileStreams = files.map((file) => {
        if (!file) throw Error('it is not readable file');
        return fileStreamLoader(file).create(
          (file: File, pct: number) =>
            setFileList((prev) => ({ ...prev, [file.name]: { file, pct } })),
        );
      });

      fileStreams.forEach((stream) => {
        const reader = stream.getReader();
        if (reader) {
          reader.read().then(async ({ done }) => {
            while (!done) {
              const { done, value } = await reader.read();
              if (done) break;
              if (!value) throw new Error('read is Failed');
            }
          });
        }
      });
    };

    const deleteFiles = (name: string) => {
      setFileList((prev) => {
        delete prev[name];
        return { ...prev };
      });
    };

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
              <div className="flex flex-wrap-reverse w-full">
                {Object.entries(fileList).map(([name, fileinfo]) => (
                  <div key={name} className="basis-1/3 flex items-center gap-2">
                    <ProgressCircle pct={fileinfo.pct} />
                    <span>{name}</span>
                    <Button size="icon" variant="outline" onClick={() => deleteFiles(name)}>
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <FormControl>
                <p
                  {...inputProps}
                  {...field}
                  contentEditable
                  ref={setAreaRef}
                  onInput={(e) => {
                    inputProps.onInput?.(e);
                    field.onChange(e.currentTarget.innerHTML);
                  }}
                  onBlur={(e) => {
                    inputProps.onBlur?.(e);
                    field.onBlur();
                  }}
                  onPaste={(e) => {
                    const clipboardFiles = [...e.clipboardData.items]
                      .filter((i) => i.kind === 'file');

                    if (clipboardFiles.length) {
                      const files = clipboardFiles
                        .map((i) => i.getAsFile());
                      addFiles(files);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      addFiles([...e.dataTransfer.files]);
                    }
                  }}
                  className={cn(
                    'cursor-default',
                    'min-h-[60px] max-h-[120px] overflow-auto w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'break-words',
                    inputProps.className,
                  )}
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
  },
);
