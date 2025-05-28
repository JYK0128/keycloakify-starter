import { deconstruct } from '#/customs/helpers';
import { Form } from '#/shadcn/components/ui';
import { ComponentPropsWithoutRef, FormEventHandler, ForwardedRef, forwardRef } from 'react';
import { FieldValues, FormProviderProps, SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

type Props<TFieldValues extends FieldValues = FieldValues> =
  & FormProviderProps<TFieldValues>
  & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'onError'>
  & {
    formControl?: unknown
  } & (
    | {
      action: string
      onSubmit?: FormEventHandler<HTMLFormElement>
      onError?: FormEventHandler<HTMLFormElement>
    }
    | {
      action?: undefined
      onSubmit: SubmitHandler<TFieldValues>
      onError?: SubmitErrorHandler<TFieldValues>
    }
  );


/** 폼 컨트롤러 */
export const FormController = forwardRef(
  function FormControllerInner<TFieldValues extends FieldValues>(
    props: Props<TFieldValues>,
    ref: ForwardedRef<HTMLFormElement>,
  ) {
    const { onSubmit, onError, children, ...rest } = props;
    const [form, formProps] = deconstruct(rest,
      ['formControl', 'subscribe', 'watch', 'getValues', 'getFieldState', 'setError', 'clearErrors', 'setValue', 'trigger', 'formState', 'resetField', 'reset', 'handleSubmit', 'unregister', 'control', 'register', 'setFocus'],
    );

    return (
      <Form {...form}>
        <form
          {...formProps}
          ref={ref}
          onSubmit={
            typeof props.action === 'string'
              ? props.onSubmit
              : form.handleSubmit(props.onSubmit, props.onError)
          }
        >
          {children}
        </form>
      </Form>
    );
  },
);
