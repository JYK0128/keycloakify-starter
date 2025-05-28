import { FormCheckGroup, FormController, FormDateMultiPicker, FormDatePicker, FormDatetimePicker, FormInput, FormMonthMultiPicker, FormMonthPicker, FormRadioGroup, FormRange, FormSelectMulti, FormSelectSingle, FormTextarea } from '#/customs';
import { transformZodValidator } from '#/login/helpers';
import { Button } from '#/shadcn/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Attribute } from 'keycloakify/login';
import { getUserProfileApi } from 'keycloakify/login/lib/getUserProfileApi';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { UserProfileFormFieldsProps } from 'keycloakify/login/UserProfileFormFieldsProps';
import type { JSX } from 'keycloakify/tools/JSX';
import type { LazyOrNot } from 'keycloakify/tools/LazyOrNot';
import { keyBy, mapValues } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { I18n } from '../i18n';
import type { KcContext } from '../KcContext';

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>
  doMakeUserConfirmPassword: boolean
};

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes, doMakeUserConfirmPassword } = props;

  const api = getUserProfileApi({
    kcContext, doMakeUserConfirmPassword,
  });

  const { formFieldStates } = api.getFormState();
  const formFieldsByKey = keyBy(formFieldStates, 'attribute.name');

  const getZodResolver = () => transformZodValidator(formFieldsByKey);
  const getDefaultValues = () => mapValues(formFieldsByKey, 'valueOrValues');

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(getZodResolver()),
    defaultValues: getDefaultValues(),
  });


  const { msg, msgStr, advancedMsg } = i18n;

  const { url, messagesPerField } = kcContext;

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    for (const [key] of Object.entries(formFieldsByKey)) {
      if (messagesPerField.existsError(key)) {
        form.setError(key, {
          type: 'custom',
          message: messagesPerField.getFirstError(key),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists('global')}
      displayRequiredFields
      headerNode={msg('loginIdpReviewProfileTitle')}
    >
      <FormController
        {...form}
        id="kc-register-form"
        className="flex flex-col gap-1"
        onSubmit={() => {
          setIsSubmitButtonDisabled(true);
          return true;
        }}
        action={url.loginAction}
        method="post"
      >
        {
          formFieldStates.map((field) => {
            const props = {
              control: form.control,
              showError: true,
              labelWidth: '80px',
              readOnly: field.attribute.readOnly,
              required: field.attribute.required,
              label: advancedMsg(field.attribute.displayName ?? ''),
              name: field.attribute.name,
            };
            const { min, max } = field.attribute.validators.integer ?? {};
            const { multivalued, name: fieldName } = field.attribute;
            const { options = [] } = field.attribute.validators.options ?? {};
            const { inputType = 'text' } = field.attribute.annotations;

            switch (inputType) {
              case 'text': {
                return (
                  <FormInput
                    key={fieldName}
                    {...props}
                    type={
                      /password/i.test(fieldName)
                        ? 'password'
                        : 'text'
                    }
                  />
                );
              }
              case 'html5-email': {
                return <FormInput key={fieldName} {...props} type="email" />;
              }
              case 'html5-tel': {
                return <FormInput key={fieldName} {...props} type="tel" />;
              }
              case 'html5-url': {
                return <FormInput key={fieldName} {...props} type="url" />;
              }
              case 'html5-number': {
                return <FormInput key={fieldName} {...props} type="number" />;
              }
              case 'textarea': {
                return <FormTextarea key={fieldName} {...props} />;
              }
              case 'select': {
                return (
                  <FormSelectSingle
                    key={fieldName}
                    {...props}
                    items={options.map((option) => ({
                      label: inputLabel(i18n, field.attribute, option),
                      value: option,
                    }))}
                  />
                );
              }
              case 'select-radiobuttons': {
                return (
                  <FormRadioGroup
                    key={fieldName}
                    {...props}
                    items={options.map((option) => ({
                      label: inputLabel(i18n, field.attribute, option),
                      value: option,
                    }))}
                  />
                );
              }
              case 'multiselect': {
                return (
                  <FormSelectMulti
                    key={fieldName}
                    {...props}
                    items={options.map((option) => ({
                      label: inputLabel(i18n, field.attribute, option),
                      value: option,
                    }))}
                  />
                );
              }
              case 'multiselect-checkboxes': {
                return (
                  <FormCheckGroup
                    key={fieldName}
                    {...props}
                    items={options.map((option) => ({
                      label: inputLabel(i18n, field.attribute, option),
                      value: option,
                    }))}
                  />
                );
              }
              case 'html5-range': {
                return <FormRange key={fieldName} {...props} min={min} max={max} />;
              }
              case 'html5-datetime-local': {
                return <FormDatetimePicker key={fieldName} {...props} />;
              }
              case 'html5-date': {
                return multivalued
                  ? <FormDateMultiPicker key={fieldName} {...props} />
                  : <FormDatePicker key={fieldName} {...props} />;
              }
              case 'html5-month': {
                return multivalued
                  ? <FormMonthMultiPicker key={fieldName} {...props} />
                  : <FormMonthPicker key={fieldName} {...props} />;
              }
              case 'html5-week': {
                return <FormInput key={fieldName} {...props} type="week" />;
              }
              case 'html5-time': {
                return <FormInput key={fieldName} {...props} type="time" />;
              }
            }
          })
        }

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitButtonDisabled || !form.formState.isValid}
          >
            {msgStr('doSubmit')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n;

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations;

    return advancedMsg(inputOptionLabels[option] ?? option);
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
  }

  return option;
}
