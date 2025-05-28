import { FormCheckbox, FormCheckGroup, FormController, FormDateMultiPicker, FormDatePicker, FormDatetimePicker, FormInput, FormMonthMultiPicker, FormMonthPicker, FormRadioGroup, FormRange, FormSelectMulti, FormSelectSingle, FormTextarea } from '#/customs';
import { KcContext } from '#/login/KcContext';
import { transformZodValidator } from '#/login/helpers';
import { I18n } from '#/login/i18n';
import { Button } from '#/shadcn/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Attribute } from 'keycloakify/login';
import type { UserProfileFormFieldsProps } from 'keycloakify/login/UserProfileFormFieldsProps';
import { getUserProfileApi } from 'keycloakify/login/lib/getUserProfileApi';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { JSX } from 'keycloakify/tools/JSX';
import type { LazyOrNot } from 'keycloakify/tools/LazyOrNot';
import { keyBy, mapValues } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type RegisterProps = PageProps<Extract<KcContext, { pageId: 'register.ftl' }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>
  doMakeUserConfirmPassword: boolean
};

export default function Register(props: RegisterProps) {
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
  const areTermsAccepted = form.watch('termsAccepted');


  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr, advancedMsg } = i18n;

  const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } = kcContext;

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
      headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg('registerTitle')}
      displayMessage={messagesPerField.exists('global')}
      displayRequiredFields
    >
      <FormController
        {...form}
        id="kc-register-form"
        className="flex flex-col gap-1"
        onSubmit={() => {
          setIsSubmitButtonDisabled(true);
          return true;
        }}
        action={url.registrationAction}
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

        {/* 약관동의(내용) */}
        {termsAcceptanceRequired && (
          <div className={kcClsx('kcInputWrapperClass')}>
            {msg('termsTitle')}
            <div id="kc-registration-terms-text">{msg('termsText')}</div>
          </div>
        )}

        {/* 약관동의 */}
        {termsAcceptanceRequired && (
          <FormCheckbox
            control={form.control}
            name="termsAccepted"
            label={msg('acceptTerms')}
          />
        )}

        {/* 리캡쳐 */}
        {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
          <div className="form-group">
            <div className={kcClsx('kcInputWrapperClass')}>
              <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction} />
            </div>
          </div>
        )}

        {/* 뒤로가기 */}
        <Button className="text-link font-bold self-start" variant="ghost" asChild>
          <a href={url.loginUrl}>
            {msg('backToLogin')}
          </a>
        </Button>
        {/* 제출 */}
        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined
          ? (
            <Button
              className={clsx('g-recaptcha')}
              data-sitekey={recaptchaSiteKey}
              data-callback={() => {
                (document.getElementById('kc-register-form') as HTMLFormElement).submit();
              }}
              data-action={recaptchaAction}
              type="submit"
            >
              {msg('doRegister')}
            </Button>
          )
          : (
            <Button
              disabled={
                isSubmitButtonDisabled
                || !form.formState.isValid
                || (termsAcceptanceRequired && !areTermsAccepted)
              }
              type="submit"
            >
              {msgStr('doRegister')}
            </Button>
          )}
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
